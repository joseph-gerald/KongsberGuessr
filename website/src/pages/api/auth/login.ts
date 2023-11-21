import { NextApiRequest, NextApiResponse } from 'next'

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (typeof req.body !== 'object' || req.headers['content-type'] != "application/json") {
        res.status(400).json({ error: 'Expected a JSON body' })
        return
    }

    if(["username","password"].some((e) => !req.body[e])) {
        res.status(400).json({ error: 'Missing required fields' })
        return
    }

    // TODO: Implement login logic tmrw
}