import { NextApiRequest, NextApiResponse } from 'next'
import crypto_utils from '../../../../utils/crypto_utils';
import client from '../_db';
import game_utils from '../../../../utils/game_utils';
import User from '../../../../models/User';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("users");

class Game {
    token: string;
    rounds: any[] = [];
    id: string = crypto_utils.sha1(crypto_utils.generateToken()).slice(0, 3);
    constructor(token: string) {
        this.token = token;
    }
}

class PvPGame extends Game {
    started: boolean = false;
    players: any[] = [];
    rounds: any = {};
    public: any = {
        players: []
    };
    constructor(token: string) {
        super(token);
    }
}

let games: { [id: string]: Game; } = {};

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    const data = await tracking_utils.validateData(req, res);
    if (typeof data == "string") return;
    const { user, token } = data;

    let game = games[token];
    let mode = req.body.mode;
    let round = req.body.round;
    let action = req.body.action;
    const id = req.body.id;
    const pvp = req.body.pvp;

    if (mode) {
        switch (mode) {
            case "solo":
                game = games[token] = new Game(token);
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

            pvpGame.players.push(user._id);
            pvpGame.public.players.push({ id: String(user._id).slice(0, 6), username: user.username, xp: user.xp });
            pvpGame.public.started = false;

            res.send({ id: game.id });
            break;
        case "update":
            {
                const settings = req.body.settings;

                if (!gameFound) {
                    res.status(404).json({ error: "Found no game with ID" })
                    return;
                }

                if (!(gameFound instanceof PvPGame)) return;

                const isHost = gameFound.token == token;

                if (isHost) {
                    gameFound.public.settings = settings;
                }

                res.json(gameFound.public);
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

                const hasAlreadyJoined = gameFound.players.filter(player => JSON.stringify(player) == JSON.stringify(user._id)).length > 0;

                if (hasAlreadyJoined) {
                    res.status(400).json({ error: 'Already joined' })
                    return;
                }

                gameFound.players.push(user._id);
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
                    game.started = true;
                    const isHost = game.token == token;

                    if (!isHost) {
                        res.status(400).json({ error: 'Not host' })
                        return;
                    }

                    /*
                    if (game.players.length < 2) {
                        res.status(400).json({ error: 'Not enough players' })
                        return;
                    }*/

                    game.public.rounds = [];

                    if (game.public.settings.challenges == "Everyone Same") {
                        game.public.rounds[0] = {
                            round_id: 0,
                            started: Date.now(),
                            location: await game_utils.getRandomPlace(),
                        }
                    } else {
                        game.public.rounds[0] = {};
                    }

                    game.public.started = true;

                    res.json({ status: "ok" });
                } else {
                    const currentRound = game.public.rounds.length;
                    const isHost = game.token == token;

                    console.log(round, currentRound)
                    if (round != currentRound) {
                        res.status(400).json({ error: 'Invalid round' })
                        return;
                    }

                    if (game.public.settings.challenges == "Everyone Same") {
                        res.json(game.public.rounds[0].location);
                    } else {
                        const currentRound = {
                            round_id: round,
                            started: Date.now(),
                            finished: null,
                            score: 0,
                            location: await game_utils.getRandomPlace(),
                            distance: null,
                            guess: null,
                            time_taken: null,
                        };

                        game.rounds[token] = {};
                        game.rounds[token][round] = currentRound;

                        res.json(currentRound.location);

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
                        location: await game_utils.getRandomPlace(),
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

            if (!guess) {
                res.status(400).json({ error: 'Missing guess' })
                return;
            }

            if (rnd && rnd.guess) {
                res.status(400).json({ error: 'Guess already made' })
                return;
            }

            const isPvP = pvp && gameFound != null && gameFound instanceof PvPGame;
            
            if (isPvP && gameFound != null) rnd = gameFound.rounds[token][round];

            const answer = rnd.location;

            rnd.guess = { ...{ address: (await game_utils.getGeoData(guess.lat, guess.lng)).display_name }, ...guess };
            rnd.finished = Date.now();
            rnd.time_taken = rnd.finished - rnd.started;
            rnd.distance = Math.round(game_utils.calculateDistance(answer.lat, answer.lng, guess.lat, guess.lng));

            rnd.score = Math.round(game_utils.calculateScore(rnd));

            User.findOneAndUpdate({ _id: user._id }, { xp: user.xp + rnd.score }).exec();

            res.json({ data: rnd });
            return;
        default:
            res.status(400).json({ error: 'Invalid' })
            return;
    }
}