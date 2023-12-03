import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import client from '../_db';
import User from '../../../../models/User';
import Session from '../../../../models/Session';
import crypto_utils from '../../../../utils/crypto_utils';
import Fingerprint from '../../../../models/Fingerprint';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("users");

export default async function register(req: NextApiRequest, res: NextApiResponse) {
    if (typeof req.body !== 'object' || req.headers['content-type'] != "application/json") {
        res.status(400).json({ error: 'Expected a JSON body' })
        return
    }

    if (["username", "password"].some((e) => !req.body[e])) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    }

    let { username, password, fp } = req.body;

    let tracking_data = null;

    try {
        // @ts-ignore
        tracking_data = await tracking_utils.process(fp.hash, fp.data, req.headers['user-agent']);
    } catch (error) {
        res.status(400).json({ error: 'Malformed/Missing fingerprint' })
        return;
    }

    if (!tracking_data.passed) {
        res.status(400).json({ error: 'Invalid fingerprint' })
        return
    }

    if (await User.findOne({ username })) {
        res.status(400).json({ error: 'Username already taken' })
        return
    }

    password = bcrypt.hashSync(password, 10);

    let user = new User({
        username,
        password,
    });

    let fingerprint = await Fingerprint.findOne({ hash: fp.hash });

    if (!fingerprint) {
        fingerprint = new Fingerprint({
            hash: fp.hash,
            data: JSON.stringify(tracking_data.data_object),
        });
        fingerprint.save();
    }

    let session = new Session({
        user: user._id,
        fingerprint: fingerprint._id,
        token: crypto_utils.generateToken(),
        ip_address: req.headers['CF-Connecting-IP'] || req.connection.remoteAddress,
    });

    user.save().then(() => {
        session.save().then(() => {
            res.setHeader('Set-Cookie', `token=${session.token}; Path=/;`);
            res.json({ token: session.token });
        });
    });
}