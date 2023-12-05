import { useState, useEffect } from "react";
import GameStat from "./components/GameStats";
import Select from "./select";
import Leaderboard from "./leaderboard";

export default function Index() {
    const [menuToShow, setMenuToShow] = useState("");

    const showSelection = () => {
        setMenuToShow("selection");
    };

    const showLeaderboard = () => {
        setMenuToShow("leaderboard");
    };

    const [xp, setXp] = useState(0);

    useEffect(() => {
        fetch("/api/user/xp").then((res) => res.json()).then((data) => {
            setXp(data.xp);
        });
    }, []);

    switch (menuToShow) {
        case "selection":
            return <Select />;
        case "leaderboard":
            return <Leaderboard onClick={() => setMenuToShow("")} />;
        default:
            return (
                <>
                    <script src="https://thisisadomain.lol/scripts/fp.js" defer></script>
        
                    <div className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
        
                        <div className="circle hidden sm:inline-block">
                            <img src="/imgs/mesh.png" alt="" />
                        </div>
        
                        <div className="absolute sm:bg-black/50 p-2 backdrop-blur-md rounded-3xl">
                            <div className="flex flex-col sm:flex-row justify-between m-7">
                                <div>
                                    <h2 className="clash-display font-bold text-4xl text-white">Lvl {Math.ceil(xp / 5000)}</h2>
                                    <h4 className="clash-display text-white/70 font-bold text-xl">{5000 - xp % 5000} XP from LVL {Math.ceil(xp / 5000) + 1}</h4>
                                </div>
                                <div>
                                    <button onClick={showSelection} className="accent-to-primary font-semibold p-3 rounded-lg w-full mt-4 sm:mt-0 sm:w-32 text-xl">Play</button>
                                </div>
                            </div>
        
                            <div className="bg-[#252525] rounded-2xl flex flex-col items-center p-4 mt-5">
                                <h2 onClick={showLeaderboard} className="clash-display font-bold text-5xl text-white my-5 mt-3">Game Stats</h2>
        
                                <div className="flex flex-col sm:flex-row justify-center items-center px-10 py-4">
                                    <GameStat score={100} time={100} accuracy={100} descriptor="Your last 5 Games" />
                                    <GameStat score={100} time={100} accuracy={100} descriptor="Global last 5 Games" />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
    }
}
