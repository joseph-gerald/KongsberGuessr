import React from 'react';

export default function GameStat({ score, time, accuracy, descriptor }: { score: number, time: number, accuracy: number, descriptor: string }) {
    return (
        <>
            <div className="flex flex-col items-center">
                <b className="text-white/60">{descriptor}</b>
                <div className="flex justify-center items-center gap-5 p-10 pt-4">
                    <div className="flex flex-col text-white items-center">
                        <b>Score</b>
                        <b>{score}</b>
                    </div>
                    <div className="flex flex-col text-white items-center">
                        <b>Time</b>
                        <b>{time}s</b>
                    </div>
                    <div title={`${(1 - accuracy * 0.01).toFixed(1)} km off`} className="flex flex-col text-white items-center">
                        <b>Accuracy</b>
                        <b>{accuracy}%</b>
                    </div>
                </div>
            </div>
        </>
    );
};