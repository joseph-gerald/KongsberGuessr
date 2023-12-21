import { useState, useEffect } from "react";
import { StreetView, Map } from "../../../components/google/maps";
import { useRouter } from "next/router";
import game_utils from '../../../../utils/game_utils';

export default function Index() {
    const router = useRouter();
    const { id } = router.query;
    const [overlayText, setOverlayText] = useState("Fetching Challenge...");
    const [overlayDescription, setOverlayDescription] = useState("");

    const returnHome = () => {
        router.push("/home");
    };

    const [answerLocation, setAnswerLocation] = useState({
        lat: 0,
        lng: 0,
    });

    let location = {
        lat: 59.9139,
        lng: 10.7522,
    };

    const mapStyle = "absolute z-50 left-0 bottom-0 hover:opacity-100 rounded-xl overflow-hidden duration-300 ";

    const [round, setRound] = useState(1);
    const [distance, setDistance] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(true);
    
    const [mapConditional, setMapConditional] = useState("sm:w-[calc(15vw+5vh)] sm:h-[calc(5vw+10vh)] sm:hover:w-[35vw] sm:hover:h-[calc(15vw+20vh)] hover:left opacity-40 m-4");
    const [mapToggleText, setMapToggleText] = useState("Show Map");

    const [roundData, setRoundData] = useState({
        score: 0,
        guess: {
            lat: 0,
            lng: 0,
            address: "",
        },
        location: {
            lat: 0,
            lng: 0,
            address: "",
        },
        distance: 0,
        time_taken: 0,
    });

    // fetch game data with id

    const handleSubmit = async () => {
        setMapToggleText("View Score")
        
        setOverlayText("Submitting Guess...");
        setIsOverlayVisible(true);

        // @ts-ignore
        setAnswerMarker(answerLocation.lat, answerLocation.lng);

        const res = await fetch(game_utils.origin + '/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                round: round,
                action: "guess",
                id,
                // @ts-ignore
                guess: getLocation()
            })
        });

        const data = await res.json();

        setRoundData(data.data);
        setIsSubmittingGuess(false);
    };

    const handleNext = () => {
        setIsOverlayVisible(false);
        setIsSubmittingGuess(true);

        setRound(round + 1)
        setFetching(true);

        // @ts-ignore
        clearStuff();
        setOverlayText("Fetching Challenge...")
        setIsOverlayVisible(true);
        fetchGame();
    }

    const updateDistance = () => {
        // @ts-ignore
        if (typeof getPlayerLocation == "undefined") {
            return;
        }
        // @ts-ignore
        const guess = getPlayerLocation(answerLocation.lat + answerLocation.lng);

        if (!guess || guess == "error") {
            return;
        }

        const distance = Math.round(game_utils.calculateDistance(guess.lat, guess.lng, answerLocation.lat, answerLocation.lng));
        setDistance(distance);

        setTimeout(updateDistance, 100);
    }

    const handleToggleMap = () => {
        if(mapToggleText == "View Score") {
            setMapConditional("")
            setMapToggleText("Show Map");
            return;
        }

        const showMap = mapToggleText == "Show Map";
        setMapConditional(showMap ? "m-0 w-full h-full opacity-100" : "opacity-40 m-4")
        setMapToggleText(showMap ? "Hide Map" : "Show Map");
    }

    async function fetchGame() {
        // @ts-ignore
        if (typeof setLocation == "undefined") {
            setTimeout(fetchGame, 100);
            return;
        }
        if (!fetching) return;
        const res = await fetch(game_utils.origin + '/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                round: round,
                action: "start",
                id
            })
        });

        switch (res.status) {
            case 200:
                break;
            case 210:
                setOverlayText("Game Over");
                setOverlayDescription("You scored a total of " + (await res.json()).total.toLocaleString() + " points");
                setGameOver(true)
                return;
            default:
                setOverlayText("ERROR " + res.status);
                returnHome();
                return;
        }

        location = await res.json();

        // @ts-ignore
        setLocation(location.lat, location.lng)
        setAnswerLocation(location);

        setFetching(false);

        setIsOverlayVisible(false);
        setIsSubmittingGuess(true);
    }

    useEffect(() => {
        fetchGame();
    }, [fetching])

    useEffect(() => {
        updateDistance();
    }, [answerLocation]);

    return (
        <>
            <title>Solo</title>
            <h1 className="text-white absolute z-50 text-4xl font-bold m-2 p-2 drop-shadow-2xl bg-black/30 backdrop-blur-md">
                round {round}/{game_utils.max_rounds}
            </h1>
            <h1 className="text-white absolute top-16 z-50 text-xl m-2 p-1 drop-shadow-2xl bg-black/30 backdrop-blur-md">
                {distance}m from start
            </h1>
            <div className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
                <StreetView lat={location.lat} lng={location.lng} />
                <div className={mapStyle + mapConditional}>
                    <Map lat={0} lng={0} />
                    <button onClick={handleSubmit} className={"z-50 fixed accent-to-primary font-semibold p-3 rounded-lg left-5 bottom-5 hover:saturate-0 duration-300 sm:block " + (mapToggleText == "Hide Map" ? "block" : "hidden")}>
                        Submit
                    </button>
                    <button onClick={handleToggleMap} className={"z-50 fixed accent-to-primary font-semibold p-3 rounded-full left-1/2 -translate-x-1/2 bottom-5 duration-300 block sm:hidden " + (mapToggleText == "Hide Map" ? "saturate-50" : "") + (isOverlayVisible && mapToggleText != "View Score" ? "hidden" : "")}>
                        {mapToggleText}
                    </button>
                </div>
            </div>
            <div className={`z-40 absolute top-0 backdrop-blur-xl h-screen w-screen bg-black/80 ${isOverlayVisible ? 'block' : 'hidden'}`}>
                {
                    isSubmittingGuess ? (
                        <div className="font-bold center-self absolute text-white items-center flex flex-col justify-center">
                            <h1 className="text-4xl md:text-8xl">
                                {overlayText}
                            </h1>
                            <h4 className="text-4xl text-white/50">
                                {overlayDescription}
                            </h4>
                        </div>
                    ) : (
                        <div className="z-50 absolute center-self h-full w-full flex items-center justify-center flex-col game-stat text-sm sm:text-md md:text-xl">
                            <h1>
                                You scored {roundData.score.toLocaleString()} points
                            </h1>
                            <hr className="border w-96 m-2 mb-6" />
                            <h2>
                                You guessed {roundData.guess.address}
                            </h2>
                            <h2>
                                It was actually {roundData.location.address}
                            </h2>
                            <h2>
                                You were off by {roundData.distance} meters
                            </h2>
                            <h2>
                                You used {(roundData.time_taken / 1000).toFixed(2)} seconds
                            </h2>
                            <button onClick={handleNext} className="absolute w-64 mt-8 accent-to-primary font-semibold p-3 rounded-lg left-1/2 -translate-x-1/2 bottom-5 z-40 hover:saturate-0 duration-300">
                                Next
                            </button>
                        </div>
                    )
                }
                {
                    gameOver ? (
                        <button onClick={() => returnHome()} className="absolute w-64 left-1/2 -translate-x-1/2 absolute bottom-4 mt-8 accent-to-primary font-semibold p-3 rounded-lg left-1/2 -translate-x-1/2 bottom-5 z-40 hover:saturate-0 duration-300">
                            Home
                        </button>
                    ) : (
                        <>
                        </>
                    )
                }
            </div>
        </>
    );
}
