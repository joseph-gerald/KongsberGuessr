import { NextApiRequest, NextApiResponse } from 'next'
import client from '../_db';
import User from '../../../../models/User';
import Session from '../../../../models/Session';
import tracking_utils from '../../../../utils/tracking_utils';
import Fingerprint from '../../../../models/Fingerprint';

client.db("KongsberGuessr").collection("users");

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    if (typeof req.body !== 'object' || req.headers['content-type'] != "application/json") {
        res.status(400).json({ error: 'Expected a JSON body' })
        return
    }

    let { token, ip_address, useragent } = req.body;
    
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

    if (!user) {
        res.status(400).json({ error: 'Invalid token' })
        return;
    }

    const fp_data = JSON.parse(fingerprint.data);
    
    if (fp_data.USERAGENT != useragent) {
        res.status(400).json({ error: 'Useragent mismatch' })
        return;
    }

    if (tracking_utils.isMismatchingIP(session.ip_address, ip_address)) {
        res.status(400).json({ error: 'New address' })
        return;
    }

    res.json({ success: true });
}