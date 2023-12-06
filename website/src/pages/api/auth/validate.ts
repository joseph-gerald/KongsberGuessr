import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt';
import client from '../_db';
import User from '../../../../models/User';
import Session from '../../../../models/Session';
import crypto_utils from '../../../../utils/crypto_utils';
import Fingerprint from '../../../../models/Fingerprint';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("users");

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    if (typeof req.body !== 'object' || req.headers['content-type'] != "application/json") {
        res.status(400).json({ error: 'Expected a JSON body' })
        return
    }

    let { token, ip_address } = req.body;

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

    if (!user) {
        res.status(400).json({ error: 'Invalid token' })
        return;
    }

    if (tracking_utils.isSameIP(session.ip_address, ip_address)) {
        res.status(400).json({ error: 'New address' })
        return;
    }

    res.json({ success: true });
}