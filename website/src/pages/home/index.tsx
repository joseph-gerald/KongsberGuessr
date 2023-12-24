import { useState, useEffect } from "react";
import GameStat from "./components/GameStats";
import Select from "./select";
import Leaderboard from "./leaderboard";
import game_utils from "../../../utils/game_utils";

export async function getServerSideProps(context: { req: any; }) {
    const origin = game_utils.origin;
 
    const payload = {
        method: "POST",
        headers: context.req.headers,
    };
 
    const fetchXp = fetch(origin + "/api/user/xp", payload).then((res) => res.text());
    const fetchStats = fetch(origin + "/api/user/stats", payload).then((res) => res.json());
    const fetchLeaderboard = fetch(origin + "/api/user/leaderboard", payload).then((res) => res.json());
 
    const [data, stats, leaderboard] = await Promise.all([fetchXp, fetchStats, fetchLeaderboard]);
 
    const { xp, username } = JSON.parse(data);
    const { personal, global } = stats;
 
    return {
        props: {
            xp,
            username,
 
            personal,
            global,
 
            leaderboard
        }
    };
 }
 

export default function Index({ xp, username, personal, global, leaderboard }: { xp: number, username: string, personal: any, global: any, leaderboard: any }) {
    const [menuToShow, setMenuToShow] = useState("");

    const showSelection = () => {
        setMenuToShow("selection");
    };

    const showLeaderboard = () => {
        setMenuToShow("leaderboard");
    };

    return (
        <>
            {
                menuToShow === "selection" ?
                    <>
                        <Select />
                    </>
                    : menuToShow === "leaderboard" ?
                        <>
                            <Leaderboard leaderboard={leaderboard} onClick={() => setMenuToShow("")} />
                        </>
                        :
                        <>
                            <div className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">

                                <div className="circle hidden sm:inline-block">
                                    <img src="/imgs/mesh.png" alt="" />
                                </div>

                                <div className="absolute sm:bg-black/50 p-2 backdrop-blur-md rounded-3xl">
                                    <div className="flex flex-col sm:flex-row justify-between m-7">
                                        <div>
                                            <h2 className="clash-display font-bold text-4xl text-white">Lvl {Math.floor(xp / 5000)}</h2>
                                            <h4 className="clash-display text-white/70 font-bold text-xl">{5000 - xp % 5000} XP from LVL {Math.floor(xp / 5000) + 1}</h4>
                                        </div>
                                        <div>
                                            <button onClick={showSelection} className="accent-to-primary font-semibold p-3 rounded-lg w-full mt-4 sm:mt-0 sm:w-32 text-xl">Play</button>
                                        </div>
                                    </div>

                                    <div className="bg-[#252525] rounded-2xl flex flex-col items-center p-4 mt-5">
                                        <h2 onClick={showLeaderboard} className="clash-display font-bold text-5xl text-white my-5 mt-3">Game Stats</h2>

                                        <div className="flex flex-col sm:flex-row justify-center items-center px-10 py-4">
                                            <GameStat score={personal.score} time={personal.time} accuracy={personal.accuracy} descriptor="Your last 5 Guesses" />
                                            <GameStat score={global.score} time={global.time} accuracy={global.accuracy} descriptor="Average last 5 Guesses" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
            }
            <footer className="fixed bottom-0 text-white p-1 pb-1.5 px-2 bg-black/50 w-full backdrop-blur-md">
                <a href="https://github.com/joseph-gerald/KongsberGuessr/releases" target="_blank">You are on <b className="accent-to-primary-text">{game_utils.build_string}</b></a>
                <div className="float-right">logged in as <b className="accent-to-primary-text">{username ?? ".........."}</b></div>
            </footer>
        </>
    )
}
