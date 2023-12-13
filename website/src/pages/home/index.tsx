import { useState, useEffect } from "react";
import GameStat from "./components/GameStats";
import Select from "./select";
import Leaderboard from "./leaderboard";
import game_utils from "../../../utils/game_utils";

export default function Index() {
    const [menuToShow, setMenuToShow] = useState("");

    const stat = {
        score: 0,
        time: 0,
        accuracy: 0,
    }

    const [personal, setPersonal] = useState(stat);
    const [global, setGlobal] = useState(stat);

    const showSelection = () => {
        setMenuToShow("selection");
    };

    const showLeaderboard = () => {
        setMenuToShow("leaderboard");
    };

    const [xp, setXp] = useState(0);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        fetch("/api/user/stats").then((res) => res.json()).then((data) => {
            setPersonal(data.personal);
            setGlobal(data.global);
        });
        fetch("/api/user/xp").then((res) => res.json()).then((data) => {
            setXp(data.xp);
            setUsername(data.username);
        });
    }, []);

    return (
        <>
            {
                menuToShow === "selection" ?
                    <>
                        <Select />
                    </>
                    : menuToShow === "leaderboard" ?
                        <>
                            <Leaderboard onClick={() => setMenuToShow("")} />
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
                                        <i className="absolute bottom-4 text-white/70 text-sm">*accuracy is the distance from max score, e.g 500m off = 50% and 2km off = -100%</i>
                                    </div>
                                </div>
                            </div>
                        </>
            }
            <footer className="absolute bottom-0 text-white p-1 px-2 bg-black/50 w-full">
                <a href="https://github.com/joseph-gerald/KongsberGuessr/releases" target="_blank">You are on <b className="accent-to-primary-text">build {game_utils.build}</b></a>
                <div className="float-right">logged in as <b className="accent-to-primary-text">{username ?? ".........."}</b></div>
            </footer>
        </>
    )
}
