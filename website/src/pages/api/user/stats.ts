import { NextApiRequest, NextApiResponse } from 'next'
import client from '../_db';
import User from '../../../../models/User';
import Guess from '../../../../models/Guess';
import tracking_utils from '../../../../utils/tracking_utils';

client.db("KongsberGuessr").collection("guesses");

export default async function validate(req: NextApiRequest, res: NextApiResponse) {
    const data = await tracking_utils.validateData(req, res, false);
    if (typeof data == "string") return;

    // get last 5 guesses of player and calculate average accuracy, score and time

    const { user } = data;

    const guesses = await Guess.find({ user: user._id }).sort({ createdAt: -1 }).limit(5);

    let accuracy = guesses.reduce((acc: number, guess: any) => acc + guess.distance, 0) / guesses.length;
    const score = guesses.reduce((acc: number, guess: any) => acc + guess.score, 0) / guesses.length;
    const time = Math.round(guesses.reduce((acc: number, guess: any) => acc + guess.time_taken, 0) / guesses.length / 1000);
    
    // get all players and calculate average accuracy, score and time

    const allPlayers = await User.find({}).sort({ createdAt: -1 });
    const globalData = [];

    for (const player of allPlayers) {
        if (player._id.toString() == user._id.toString()) continue;
        const guesses = await Guess.find({ user: player._id }).sort({ createdAt: -1 }).limit(5);

        const accuracy = guesses.reduce((acc: number, guess: any) => acc + guess.distance, 0) / guesses.length;
        const score = guesses.reduce((acc: number, guess: any) => acc + guess.score, 0) / guesses.length;
        const time = guesses.reduce((acc: number, guess: any) => acc + guess.time_taken, 0) / guesses.length;

        if (isNaN(accuracy) || isNaN(score) || isNaN(time)) continue;

        globalData.push({
            accuracy,
            score,
            time
        });
    }

    let globalAccuracy = globalData.reduce((acc: number, data: any) => acc + data.accuracy, 0) / globalData.length;
    const globalScore =  globalData.reduce((acc: number, data: any) => acc + data.score, 0) / globalData.length;
    const globalTime =  Math.round(globalData.reduce((acc: number, data: any) => acc + data.time, 0) / globalData.length / 1000);

    accuracy = Math.ceil((1000 - accuracy) / 10);
    globalAccuracy = Math.ceil((1000 - globalAccuracy) / 10);

    const personal = {
        accuracy,
        score,
        time
    }

    const global = {
        accuracy: globalAccuracy,
        score: globalScore,
        time: globalTime
    }

    res.status(200).json({ personal, global });
}