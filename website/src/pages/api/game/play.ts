import { NextApiRequest, NextApiResponse } from 'next'
import crypto_utils from '../../../../utils/crypto_utils';
import Session from '../../../../models/Session';
import client from '../_db';

client.db("KongsberGuessr").collection("users");

class Game {
    token: string;

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

    let game = games[token];
    let mode = req.body.mode;

    if (mode) {
        switch (mode) {
            case "solo":
                game = games[token] = new Game(token);
                res.send({ id: crypto_utils.sha1(crypto_utils.generateToken()).slice(0, 8) });
                return;
            default:
                res.status(400).json({ error: 'Invalid mode' })
                return;
        }
    }

    if (!game) {
        res.status(404).json({ error: 'Not Found' })
        return;
    }

}