import { NextApiRequest, NextApiResponse } from 'next'
import client from '../_db';
import User from '../../../../models/User';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("users");

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    const data = await tracking_utils.validateData(req, res, false);
    if (typeof data == "string") return;

    res.json(
        await User.aggregate([
            { $sort: { xp: -1 } },
            { $limit: 4 },
            { $project: { _id: 0, username: 1, xp: 1 } }
        ])
    )
}