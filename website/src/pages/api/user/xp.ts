import { NextApiRequest, NextApiResponse } from 'next'
import crypto_utils from '../../../../utils/crypto_utils';
import Session from '../../../../models/Session';
import client from '../_db';
import game_utils from '../../../../utils/game_utils';
import Fingerprint from '../../../../models/Fingerprint';
import User from '../../../../models/User';

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
    const ip_address = req.headers['CF-Connecting-IP'] || req.connection.remoteAddress;

    const useragent_mismatch = fp_data.USERAGENT != useragent;
    const ip_mismatch = session.ip_address != ip_address;

    if (useragent_mismatch || ip_mismatch) {
        res.status(401).json({ error: 'Invalid' })
        return;
    }

    res.json({ xp: user.xp });
}