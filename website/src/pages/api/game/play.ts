import { NextApiRequest, NextApiResponse } from 'next'
import crypto_utils from '../../../../utils/crypto_utils';
import client from '../_db';
import game_utils from '../../../../utils/game_utils';
import User from '../../../../models/User';
import tracking_utils from '../../../../utils/tracking_utils';
import Guess from '../../../../models/Guess';
import Game from '../../../../models/Game';

client.db("KongsberGuessr").collection("games");
client.db("KongsberGuessr").collection("guesses");

class GuessrGame {
    token: string;
    rounds: any[] = [];
    id: string = crypto_utils.sha1(crypto_utils.generateToken()).slice(0, 3);

    db: any;

    constructor(token: string) {
        this.token = token;
    }
}

class PvPGame extends GuessrGame {
    started: boolean = false;
    players: any = {};
    rounds: any = {};
    public: any = {
        players: []
    };
    constructor(token: string) {
        super(token);
    }
}

let games: { [id: string]: GuessrGame; } = {};

async function getRandomPlace() {
    return await game_utils.getValidPlace(5)
}

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    const data = await tracking_utils.validateData(req, res);
    if (typeof data == "string") return;
    const { user, token, session } = data;

    let game = games[token];
    let mode = req.body.mode;
    let round = req.body.round;
    let action = req.body.action;
    const id = req.body.id;
    const pvp = req.body.pvp;

    if (mode) {
        switch (mode) {
            case "solo":
                game = games[token] = new GuessrGame(token);

                game.db = await Game.create({
                    creator: user._id,
                    session: session,
                    game_id: game.id,
                    timestamp: Date.now(),
                    mode: "solo",
                    settings: {},
                });

                res.send({ id: game.id });
                return;
            case "pvp":
                res.send({ id: "actions" });
                break;
            default:
                res.status(400).json({ error: 'Invalid mode' })
                return;
        }
    }

    if (!game && !pvp) {
        res.status(400).json({ error: 'Invalid game' })
        return;
    }

    if (!pvp && id != game.id) {
        res.status(400).json({ error: 'Another Game Started' })
        return;
    }

    const allGames = Object.values(games).filter(game => game instanceof PvPGame).map(game => [game.token, game.id]);
    let gameFound = null;

    for (const game of allGames) {
        if (game[1] == id) {
            gameFound = games[game[0]];
            break;
        }
    }

    let rnd = !pvp ? game.rounds[round] : null;

    switch (action) {
        case "create":
            const pvpGame = new PvPGame(token);
            game = games[token] = pvpGame;

            pvpGame.players[token] = user.username;
            pvpGame.public.players.push({ id: String(user._id).slice(0, 6), username: user.username, xp: user.xp });
            pvpGame.public.started = false;

            res.send({ id: game.id });
            break;
        case "update":
            {
                if (!(gameFound instanceof PvPGame)) {
                    res.status(400).json({ error: 'Invalid game' })
                    return;
                }
                if (!gameFound.started || gameFound.rounds[token] == null) {
                    const settings = req.body.settings;

                    if (!gameFound) {
                        res.status(404).json({ error: "Found no game with ID" })
                        return;
                    }

                    if (!(gameFound instanceof PvPGame)) return;

                    const isHost = gameFound.token == token;

                    if (isHost && settings) {
                        gameFound.public.settings = settings;
                    }

                    gameFound.db = await Game.create({
                        creator: user._id,
                        session: session,
                        game_id: gameFound.id,
                        timestamp: Date.now(),
                        mode: "pvp",
                        settings: gameFound.public.settings,
                    })

                    res.json(gameFound.public);
                } else {
                    const rounds = gameFound.rounds;
                    const players = gameFound.players;
                    const highestRound = Object.keys(rounds).map(token => Object.keys(rounds[token]).length).sort((a, b) => b - a)[0];
                    const playerAndScores = Object.keys(rounds).map(token => {
                        const username = players[token];

                        const roundsIncompleted = Object.keys(rounds[token]).filter(round => rounds[token][round].guess == null).length;
                        const totalScore = Object.values(rounds[token]).map((round: any) => round.score).reduce((x, y) => x + y);

                        return { username, roundsIncompleted, totalScore };
                    })

                    res.json({ players: playerAndScores, startNextRound: gameFound.public.finished || highestRound > round });
                }
            }
            break;
        case "join":
            {
                if (!id) {
                    res.status(400).json({ error: 'Missing id' })
                    return;
                }

                if (!gameFound) {
                    res.status(404).json({ error: "Found no game with ID" })
                    return;
                }

                if (!(gameFound instanceof PvPGame)) return;

                if (gameFound.started) {
                    res.status(400).json({ error: 'Game already started' })
                    return;
                }

                const hasAlreadyJoined = Object.keys(gameFound.players).includes(token);

                if (hasAlreadyJoined) {
                    res.status(400).json({ error: 'Already joined' })
                    return;
                }

                gameFound.players[token] = user.username;
                gameFound.public.players.push({ id: String(user._id).slice(0, 6), username: user.username, xp: user.xp });

                res.json({
                    id: gameFound.id,
                })
            }
            break;
        case "start":
            if (gameFound instanceof PvPGame) {
                const game = gameFound;
                if (!game.started) {
                    const isHost = game.token == token;

                    if (!isHost) {
                        res.status(400).json({ error: 'Not host' })
                        return;
                    }

                    if (Object.keys(game.players).length < 1) {
                        res.status(400).json({ error: 'Not enough players' })
                        return;
                    }

                    game.started = true;
                    game.public.rounds = [];

                    if (game.public.settings.challenges == "Everyone Same") {
                        game.public.rounds[0] = {
                            round_id: 0,
                            started: Date.now(),
                            location: await getRandomPlace(),
                            rounds: {}
                        }
                    } else {
                        game.public.rounds[0] = {};
                    }

                    game.public.started = true;

                    game.db = await Game.create({
                        creator: user._id,
                        session: session,
                        game_id: game.id,
                        timestamp: Date.now(),
                        mode: "pvp",
                        settings: game.public.settings,
                    });

                    res.json({ status: "ok" });
                } else {
                    const currentRound = game.public.rounds.length;
                    const isHost = game.token == token;

                    if (round > game.public.settings.rounds) {
                        const rounds = gameFound.rounds;
                        const players = gameFound.players;

                        const playerAndScores = Object.keys(rounds).map(token => {
                            const username = players[token];

                            const roundsPlayed = Object.keys(rounds[token]).filter(round => rounds[token][round] != null).length;
                            const totalScore = Object.values(rounds[token]).map((round: any) => round.score).reduce((x, y) => x + y);

                            return { username, roundsPlayed, totalScore };
                        })

                        game.public.finished = true;
                        return res.status(210).json({ data: playerAndScores });
                    }

                    if (round != currentRound) {
                        if (isHost) {
                            if (game.public.settings.challenges == "Everyone Same") {
                                game.public.rounds[round - 1] = {
                                    round_id: 0,
                                    started: Date.now(),
                                    location: await getRandomPlace(),
                                    rounds: {}
                                }
                            } else {
                                game.public.rounds[round - 1] = {};
                            }
                        } else {
                            res.status(400).json({ error: 'Invalid round' })
                            return;
                        }
                    }

                    if (game.public.settings.challenges == "Everyone Same") {
                        const currentRound = {
                            round_id: round,
                            started: Date.now(),
                            finished: null,
                            score: 0,
                            location: game.public.rounds[round - 1].location,
                            distance: null,
                            guess: null,
                            time_taken: null,
                        };

                        if (!game.rounds[token]) game.rounds[token] = {};
                        game.rounds[token][round] = currentRound;

                        res.json({ ...{ lat: currentRound.location.lat, lng: currentRound.location.lng }, ...{ isHost, ...game.public.settings } });
                    } else {
                        const currentRound = {
                            round_id: round,
                            started: Date.now(),
                            finished: null,
                            score: 0,
                            location: await getRandomPlace(),
                            distance: null,
                            guess: null,
                            time_taken: null,
                        };

                        if (!game.rounds[token]) game.rounds[token] = {};
                        game.rounds[token][round] = currentRound;

                        res.json({ ...{ lat: currentRound.location.lat, lng: currentRound.location.lng }, ...{ isHost, ...game.public.settings } });
                    }
                }
            } else if (!pvp) {
                if (round && typeof round == "number") {
                    if (rnd) {
                        res.status(400).json({ error: 'Round already started' })
                        return;
                    }

                    if (round > game_utils.max_rounds || round < 0) {
                        res.status(210).json({ total: structuredClone(game.rounds).map(e => e.score).reduce((x, y) => x + y) })
                        return;
                    }

                    const currentRound = {
                        round_id: round,
                        started: Date.now(),
                        finished: null,
                        score: 0,
                        location: await getRandomPlace(),
                        distance: null,
                        guess: null,
                        time_taken: null,
                    };

                    game.rounds[round] = currentRound;

                    res.json(currentRound.location);
                }
            } else {
                res.status(400).json({ error: 'Invalid game' })
                return;
            }
            return;
        case "guess":
            const guess = req.body.guess;

            if (rnd && rnd.guess) {
                res.status(400).json({ error: 'Guess already made' })
                return;
            }

            const isPvP = pvp;
            let gameId = game?.db._id;

            if (isPvP && gameFound != null && gameFound instanceof PvPGame) {
                rnd = gameFound.rounds[token][round];
                gameId = gameFound.db._id;
            }

            if (!guess) {
                rnd.guess = {};
                rnd.finished = Date.now();
                rnd.time_taken = rnd.finished - rnd.started;
                rnd.distance = -1;
    
                rnd.score = 0;
    
                res.json({
                    data: rnd
                });
                return;
            }

            if (!rnd) {
                res.status(400).json({ error: 'Invalid round' })
                return;
            }

            const answer = rnd.location;

            rnd.guess = { ...{ address: (await game_utils.getGeoData(guess.lat, guess.lng)).formatted_address }, ...guess };
            rnd.finished = Date.now();
            rnd.time_taken = rnd.finished - rnd.started;
            rnd.distance = Math.round(game_utils.calculateDistance(answer.lat, answer.lng, guess.lat, guess.lng));

            rnd.score = Math.ceil(game_utils.calculateScore(rnd));

            User.findOneAndUpdate({ _id: user._id }, { xp: user.xp + rnd.score }).exec();

            Guess.create({
                user: user._id,
                game: gameId,

                round: round,

                start_time: rnd.started,
                time_taken: rnd.time_taken,

                score: rnd.score,
                distance: rnd.distance,

                answer_lat: rnd.location.lat,
                answer_lng: rnd.location.lng,

                guess_lat: rnd.guess.lat,
                guess_lng: rnd.guess.lng,
            })

            res.json({ data: rnd });
            return;
        default:
            res.status(400).json({ error: 'Invalid' })
            return;
    }
}
