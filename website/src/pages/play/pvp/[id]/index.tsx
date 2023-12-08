import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Setting from "./components/Setting";
import Player from "./components/Player";
import { set } from "mongoose";
import { stat } from "fs";

export default function Index() {
    const router = useRouter();
    const [roomCode, setRoomCode] = useState('');
    const [state, setState] = useState("start");
    const [id, setId] = useState("...");
    const [info, setInfo] = useState("");
    const [infoColour, setInfoColour] = useState("text-red-600");
    const [players, setPlayers] = useState([] as any[]);

    const [roundTimeLimit, setRoundTimeLimit] = useState(1);
    const [rounds, setRounds] = useState(1);
    const [challenges, setChallenges] = useState("Everyone Different");
    const [started, setStarted] = useState(false);

    const [waitingTexts, setWaitingTexts] = useState(["Waiting for host to ", "start"] as string[]);

    const [isHost, setIsHost] = useState(false);

    // <Setting name="Gamemode" type="list" data={{modes: ["Regular", "Elimination", "Tournament"]}}></Setting>

    const sectionStyle = "w-full flex flex-col items-center";

    async function startCreation() {
        const res = await fetch('/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: "create",
                id,
                pvp: true,
            })
        });

        if (res.status != 200) router.push("/home");

        setId((await res.json()).id);
        setState("create");
        setIsHost(true);
    }

    async function joinRoom() {
        const res = await fetch('/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: "join",
                id: roomCode,
                pvp: true,
            })
        });

        if (res.status != 200) {
            setInfoColour("text-red-600");
            setInfo((await res.json()).error)
            return;
        }

        setId(roomCode);
        setInfoColour("text-green-600");
        setInfo("Joining room...")
        setState("waiting");
    }

    async function startGame() {
        const res = await fetch('/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: "start",
                id,
            })
        });

        if (res.status != 200) {
            setInfoColour("text-red-600");
            setInfo((await res.json()).error)
            return;
        }

        setState("waiting");
    }

    async function updateRoom() {
        if ((state == "create" || state == "waiting") && !started) {
            const settings = {
                roundTimeLimit,
                rounds,
                challenges
            }

            const res = await fetch('/api/game/play', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: "update",
                    pvp: true,
                    id,
                    settings: (isHost ? settings : null)
                })
            });

            if (res.status != 200) {
                alert("ERROR: " + (await res.json()).error + "\nGoing to Home");
                router.push("/home");
                return;
            }

            const data = await res.json();

            setPlayers(data.players);

            if (data.started) {
                setStarted(true);
                setWaitingTexts(["", "Starting..."]);

                router.push(`/play/pvp/${id}/play`);
            }

            if (!isHost) {
                if (data.settings) {
                    setRoundTimeLimit(data.settings.roundTimeLimit);
                    setRounds(data.settings.rounds);
                    setChallenges(data.settings.challenges);
                }
            }

            await new Promise(r => setTimeout(r, 1000));
        }
    }

    updateRoom();

    const buttonStyle = "accent-to-primary-text hover:hue-rotate-15 hover:scale-105 duration-300 font-bold p-3 rounded-lg w-full text-3xl";

    switch (state) {
        case "start":
            return (
                <>
                    <title>Room Actions</title>
                    <script src="https://thisisadomain.lol/scripts/fp.js" defer></script>
                    <img src="https://i.redd.it/zvv33s6vkmp21.jpg" className="h-screen w-screen blur absolute" />
                    <div className={`absolute top-0 backdrop-blur-xl h-screen w-screen bg-black/80`}>
                        <h2 className="absolute left-1/2 -translate-x-1/2 top-10 text-4xl text-white/80">
                            Choose <b className="accent-to-primary-text">action</b>
                        </h2>
                        <div className="font-bold center-self absolute text-white items-center flex flex-col justify-center">
                            <button
                                onClick={() => startCreation()}
                                className={buttonStyle}>
                                Create a room
                            </button>
                            <h4 className="text-xl text-white/75 cursor-default select-none">
                                Or
                            </h4>
                            <button
                                onClick={() => setState("join")}
                                className={buttonStyle}>
                                Join a room
                            </button>
                        </div>
                    </div>
                </>
            );
        case "join":
            return (
                <>
                    <title>Join Room</title>
                    <script src="https://thisisadomain.lol/scripts/fp.js" defer></script>
                    <img src="https://i.redd.it/zvv33s6vkmp21.jpg" className="h-screen w-screen blur absolute" />
                    <div className={`absolute top-0 backdrop-blur-xl h-screen w-screen bg-black/80`}>
                        <h2 className="absolute left-1/2 -translate-x-1/2 top-10 text-4xl text-white/80">
                            Enter room <b className="accent-to-primary-text">code</b>
                        </h2>
                        <h2 className={`absolute font-bold left-1/2 -translate-x-1/2 top-24 text-2xl ${infoColour}`}>
                            {info}
                        </h2>
                        <div className="font-bold center-self absolute text-white items-center flex flex-col justify-center">
                            <input
                                maxLength={3}
                                placeholder="Enter your code"
                                className="p-2 text-xl text-center bg-blue-500/5 rounded-md border border-blue-800/40 outline-none focus:border-blue-600 duration-200"
                                type="text"
                                onChange={(e) => setRoomCode(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        joinRoom();
                                    }
                                }}
                            />

                            <button
                                onClick={joinRoom}
                                className="accent-to-primary hover:hue-rotate-15 duration-200 mt-4 font-bold p-3 rounded-lg w-full text-xl">
                                Enter Room
                            </button>
                        </div>
                    </div>
                </>
            );
        case "create":
            return (
                <>
                    <title>Create Room</title>
                    <script src="https://thisisadomain.lol/scripts/fp.js" defer></script>
                    <img src="https://i.redd.it/zvv33s6vkmp21.jpg" className="h-screen w-screen blur absolute" />
                    <div className={`absolute top-0 backdrop-blur-xl h-screen w-screen bg-black/80`}>
                        <h2 className="absolute left-1/2 -translate-x-1/2 top-10 text-4xl text-white/80">
                            Your room code is <b className="accent-to-primary-text">{id}</b>
                        </h2>
                        <h2 className={`absolute font-bold left-1/2 -translate-x-1/2 top-24 text-2xl ${infoColour}`}>
                            {info}
                        </h2>
                        <div className="font-bold center-self absolute text-white items-center flex flex-col justify-center">
                            <div className="w-full flex flex-col items-center gap-10">
                                <div className={sectionStyle}>
                                    <h4 className="text-3xl text-white/80">Settings</h4>
                                    <div className="w-full flex flex-col settings my-4 gap-4">
                                        <Setting name="Round Time Limit" type="range" data={{ min: 1, max: 5, prefix: "", suffix: " minutes" }} state={setRoundTimeLimit}></Setting>
                                        <Setting name="Rounds" type="range" data={{ min: 1, max: 5, prefix: "", suffix: " rounds" }} state={setRounds}></Setting>
                                        <Setting name="Challenges" type="boolean" data={{ true: "Everyone Same", false: "Everyone Different" }} state={setChallenges}></Setting>
                                    </div>
                                </div>

                                <div className={sectionStyle}>
                                    <h4 className="text-3xl text-white/80">Players</h4>
                                    <div className="mt-4 w-96 w-hidden overflow-auto flex justify-center items-center flex-wrap gap-5">
                                        {
                                            players.map((player, index) => {
                                                return (
                                                    <Player key={index} name={player.username} lvl={Math.floor(player.xp / 5000)} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <button onClick={startGame} className="accent-to-primary hover:hue-rotate-15 duration-200 mt-4 font-bold p-3 rounded-lg w-full text-xl">
                                    Start Game
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            );
        case "waiting":
            return (
                <>
                    <title>Waiting Room</title>
                    <script src="https://thisisadomain.lol/scripts/fp.js" defer></script>
                    <img src="https://i.redd.it/zvv33s6vkmp21.jpg" className="h-screen w-screen blur absolute" />
                    <div className={`absolute top-0 backdrop-blur-xl h-screen w-screen bg-black/80`}>
                        <h2 className="absolute left-1/2 -translate-x-1/2 top-10 text-4xl text-white/80">
                            {waitingTexts[0]}<b className="accent-to-primary-text">{waitingTexts[1]}</b>
                        </h2>
                        <div className="font-bold center-self absolute text-white items-center flex flex-col justify-center">
                            <div className="w-full flex flex-col items-center gap-10">
                                <div className={sectionStyle}>
                                    <h4 className="text-3xl text-white/80">Game Settings</h4>
                                    <div className="mt-4 w-96 w-hidden overflow-hidden flex justify-center items-center flex-wrap gap-5">
                                        {
                                            [roundTimeLimit, rounds, challenges].map((setting, index) => {
                                                return (
                                                    <>
                                                        <h3 className="text-xl accent-to-primary-text">{["Round Time Limit", "Rounds", "Challenges"][index]}</h3>
                                                        <h4 className="text-xl text-white/60">{setting}</h4>
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>

                                <div className={sectionStyle}>
                                    <h4 className="text-3xl text-white/80">Players</h4>
                                    <div className="mt-4 w-96 w-hidden overflow-auto flex justify-center items-center flex-wrap gap-5">
                                        {
                                            players.map((player, index) => {
                                                return (
                                                    <Player key={index} name={player.username} lvl={Math.floor(player.xp / 5000)} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
    }
}
