import { NextApiRequest, NextApiResponse } from 'next'
import client from '../_db';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("users");

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    if (tracking_utils.isNotJSON(req)) {
        res.status(400).json({ error: 'Expected a JSON body' })
        return
    }

    let { token, ip_address, useragent } = req.body;
    
    const validation = await tracking_utils.validateBody(token, useragent, ip_address);

    if (typeof validation == "string") {
        res.status(400).json({ error: validation })
        return;
    }

    res.json({ success: true });
}