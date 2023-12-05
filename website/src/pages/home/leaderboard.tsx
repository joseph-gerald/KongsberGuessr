import { useRouter } from "next/router";
import LeaderboardItem from "./components/LeaderboardItem";
import { useState, useEffect } from "react";

export default function Leaderboard({onClick}: {onClick: any}) {
    const buttonStyle = "font-semibold p-12 rounded-2xl w-full flex items-center flex-col text-white gap-8 text-2xl w-full lg:w-48";
    const svgSize = "80";

    const router = useRouter();
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        fetch("/api/user/leaderboard").then((res) => res.json()).then((data) => {
            setLeaderboardData(data[0]);
        });
    }, []);
    // LeaderboardItem | username, xp, logo
    return (
        <>
            <script src="https://thisisadomain.lol/scripts/fp.js" defer></script>

            <div onClick={onClick} className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
                <div className="circle hidden sm:inline-block">
                    <img src="/imgs/mesh.png" alt="" />
                </div>

                <div className="absolute sm:bg-black/50 backdrop-blur-md rounded-3xl px-3.5 py-[26px]">
                    <div className="flex justify-between m-7">
                        <div className="flex items-center flex-col">
                            <h2 className="clash-display font-bold text-6xl text-white/70 mb-6">Top Players</h2>
                            <h2 className="clash-display text-xl text-white/70 mb-6">Top 4 KongsberGuessrs</h2>
                            <div className="flex flex-col sm:flex-row gap-10 w-full justify-center">
                                {leaderboardData.length == 0 ? 
                                    <h1 className="clash-display font-bold text-7xl text-white/70 mx-[127px] my-12">
                                        Loading...
                                    </h1>
                                :leaderboardData.map((user: any, index) => (
                                    <LeaderboardItem
                                        username={user.username}
                                        xp={user.xp}
                                        rank={index}
                                        key={index}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
