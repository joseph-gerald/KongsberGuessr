import { NextApiRequest, NextApiResponse } from 'next'
import crypto_utils from '../../../../utils/crypto_utils';
import Session from '../../../../models/Session';
import client from '../_db';
import game_utils from '../../../../utils/game_utils';
import Fingerprint from '../../../../models/Fingerprint';
import User from '../../../../models/User';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("users");

class Game {
    token: string;
    rounds: any[] = [];
    id: string = crypto_utils.sha1(crypto_utils.generateToken()).slice(0, 8);
    constructor(token: string) {
        this.token = token;
    }
}

let games: { [id: string]: Game; } = {};

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    if (typeof req.body !== 'object' || req.headers['content-type'] != "application/json") {
        res.status(400).json({ error: 'Expected a JSON body' })
        return
    }

    if (typeof req.body !== 'object' || req.headers['content-type'] != "application/json") {
        res.status(400).json({ error: 'Expected a JSON body' })
        return
    }

    let token = req.cookies.token;

    if (!token) {
        res.status(400).json({ error: 'Missing token' })
        return;
    }

    const session = await Session.findOne({ token: token });

    if (!session) {
        res.status(400).json({ error: 'Invalid token' })
        return;
    }

    const user = await User.findOne({ _id: session.user })
    const fingerprint = await Fingerprint.findOne({ _id: session.fingerprint })
    const fp_data = JSON.parse(fingerprint.data);

    const useragent = req.headers['user-agent'];
    const ip_address = req.headers['cf-connecting-ip'] || req.socket.remoteAddress;

    const useragent_mismatch = fp_data.USERAGENT != useragent;
    const ip_mismatch = tracking_utils.isMismatchingIP(session.ip_address, ip_address);

    if (useragent_mismatch || ip_mismatch) {
        res.status(401).json({ error: 'Invalid' })
        return;
    }



    let game = games[token];
    let mode = req.body.mode;
    let round = req.body.round;
    let action = req.body.action;
    const id = req.body.id;

    if (mode) {
        switch (mode) {
            case "solo":
                game = games[token] = new Game(token);
                res.send({ id: game.id });
                return;
            default:
                res.status(400).json({ error: 'Invalid mode' })
                return;
        }
    }

    if (!game) {
        res.status(400).json({ error: 'Invalid game' })
        return;
    }

    if (id != game.id) { // token logged by lebell
        res.status(400).json({ error: 'Another Game Started' })
        return;
    }

    const rnd = game.rounds[round];

    switch (action) {
        case "start":
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