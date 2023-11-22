import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import client from '../_db';
import User from '../../../../models/User';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (typeof req.body !== 'object' || req.headers['content-type'] != "application/json") {
        res.status(400).json({ error: 'Expected a JSON body' })
        return
    }

    if (["username", "password"].some((e) => !req.body[e])) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    }

    let { username, password } = req.body;

    const db = await client.db("KongsberGuessr").collection("users");

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