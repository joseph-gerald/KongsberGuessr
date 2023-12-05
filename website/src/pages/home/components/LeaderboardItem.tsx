import React from 'react';

export default function LeaderboardItem({ username, xp, rank }: { username: string, xp: number, rank: number }) {
    const emojis = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
    return (
        <>
            <div className="flex flex-col items-center m-2">
                <h2 className="text-white text-2xl font-bold">{username}</h2>
                <div className="flex flex-col justify-center items-center gap-5 pt-4">
                    <h1 className='text-6xl'>
                        {
                            emojis[rank]
                        }
                    </h1>
                    <b className='text-white/60'>
                        {xp} points
                    </b>
                </div>
            </div>
        </>
    );
};