import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import client from '../_db';
import User from '../../../../models/User';

export default async function register(req: NextApiRequest, res: NextApiResponse) {
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

    if (await User.findOne({ username })) {
        res.status(400).json({ error: 'Username already taken' })
        return
    }

    password = bcrypt.hashSync(password, 10);

    let user = new User({
        username,
        password,
    });


    user.save().then(() => {
        res.json({ message: "User created successfully" });
    });
}