import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import client from '../_db';
import User from '../../../../models/User';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("users");

export default async function login(req: NextApiRequest, res: NextApiResponse) {
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

    const foundUser = await User.findOne({ username });

    if (!foundUser) {
        res.status(400).json({ error: 'Found no user with username' })
        return
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
        res.status(401).json({ error: 'Password is incorrect' })
        return
    }

    res.json({ message: "User logged in successfully" });
}