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
    let score = Math.round(guesses.reduce((acc: number, guess: any) => acc + guess.score, 0) / guesses.length);
    let time = Math.round(guesses.reduce((acc: number, guess: any) => acc + guess.time_taken, 0) / guesses.length / 1000);

    // get all players and calculate average accuracy, score and time

    const allGuesses = await Guess.find({}).sort({ createdAt: -1 }).limit(5);
    const globalData = [];

    for (const guess of allGuesses) {
        if (guess.user.toString() == user._id.toString()) continue;

        const accuracy = guess.distance;
        const score = guess.score;
        const time = guess.time_taken / 1000;

        if (isNaN(accuracy) || isNaN(score) || isNaN(time)) continue;

        globalData.push({
            accuracy,
            score,
            time
        });
    }

    let globalAccuracy = globalData.reduce((acc: number, data: any) => acc + data.accuracy, 0) / globalData.length;
    const globalScore = Math.round(globalData.reduce((acc: number, data: any) => acc + data.score, 0) / globalData.length);
    const globalTime = Math.round(globalData.reduce((acc: number, data: any) => acc + data.time, 0) / globalData.length);

    accuracy = Math.ceil((1000 - accuracy) / 10);
    globalAccuracy = Math.ceil((1000 - globalAccuracy) / 10);

    const personal = {
        accuracy: accuracy || -1,
        score: score || -1,
        time: time || -1
    }

    const global = {
        accuracy: globalAccuracy || -1,
        score: globalScore || -1,
        time: globalTime || -1
    }

    res.status(200).json({ personal, global });
}