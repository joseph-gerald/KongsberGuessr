import { NextApiRequest, NextApiResponse } from 'next'
import client from '../_db';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("users");

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    const data = await tracking_utils.validateData(req, res, false);
    if (typeof data == "string") return;
    const { user } = data;

    res.json({ xp: user.xp, username: user.username });
}