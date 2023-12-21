import { useState, useEffect } from "react";
import { StreetView, EducationMap } from "../../../components/google/maps";
import { useRouter } from "next/router";
import game_utils from '../../../../utils/game_utils';

export default function Index() {
    function calculateTimeDifference(time: number) {
        if (time > Date.now()) return "00:00";

        const difference = Date.now() - time;

        const totalSeconds = Math.floor(difference / 1000);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const router = useRouter();
    const { id } = router.query;
    const [overlayText, setOverlayText] = useState("Fetching Challenge...");
    const [overlayDescription, setOverlayDescription] = useState("");

    const returnHome = () => {
        router.push("/home");
    };

    const [startLocation, setStartLocation] = useState({
        lat: 0,
        lng: 0,
        address: "",
    });

    const [endLocation, endStartLocation] = useState({
        lat: 0,
        lng: 0,
        address: "",
    });

    let data = {
        start: {
            lat: 59.9139,
            lng: 10.7522,
            address: ""
        },
        end: {
            lat: 59.9139,
            lng: 10.7522,
            address: ""
        }
    };

    const [distance_traveled, setDistanceTraveled] = useState(0);
    let last_distance = 0;

    const mapStyle = "absolute z-50 left-0 bottom-0 hover:opacity-100 rounded-xl overflow-hidden duration-300 ";

    const [round, setRound] = useState(1);
    const [distance, setDistance] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(true);

    const [timeUsedString, setTimeUsedString] = useState("");
    const [roundStartTime, setRoundStartTime] = useState(0);

    const [mapConditional, setMapConditional] = useState("sm:w-[calc(15vw+5vh)] sm:h-[calc(5vw+10vh)] sm:hover:w-[35vw] sm:hover:h-[calc(15vw+20vh)] hover:left opacity-80 m-4");
    const [mapToggleText, setMapToggleText] = useState("Show Map");

    const [roundData, setRoundData] = useState({
        time_taken: 0,
        original_distance: 0,
        points: 0
    });

    // fetch game data with id

    const handleSubmit = async () => {
        setMapToggleText("View Score")

        setOverlayText("Submitting Guess...");
        setIsOverlayVisible(true);

        const res = await fetch(game_utils.origin + '/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                round: round,
                action: "arrived",
                id,
                distance_traveled,
                // @ts-ignore
                location: getLocation()
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
        if (typeof getPlayerLocation == "undefined" || typeof setLocationAndZoom == "undefined") {
            return;
        }
        // @ts-ignore
        const location = getPlayerLocation(startLocation.lat + startLocation.lng);

        if (!location || location == "error") {
            return;
        }

        const distance = Math.round(game_utils.calculateDistance(location.lat, location.lng, endLocation.lat, endLocation.lng));
        setDistance(distance);

        setDistanceTraveled(distance_traveled + Math.abs(distance - last_distance));

        // @ts-ignore
        setPlayerLocation(location.lat, location.lng)

        setTimeUsedString(calculateTimeDifference(roundStartTime));

        // @ts-ignore
        if (distance != last_distance) setLocationAndZoom(location.lat, location.lng, 16);

        last_distance = distance;

        if (distance < 10 && !isOverlayVisible) {
            handleSubmit();
            return;
        }

        setTimeout(updateDistance, 100);
    }

    const handleToggleMap = () => {
        if (mapToggleText == "View Score") {
            setMapConditional("")
            setMapToggleText("Show Map");
            return;
        }

        const showMap = mapToggleText == "Show Map";
        setMapConditional(showMap ? "m-0 w-full h-full opacity-100" : "opacity-40 m-4")
        setMapToggleText(showMap ? "Hide Map" : "Show Map");
    }

    async function fetchGame() {

        setDistanceTraveled(0);

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
                setOverlayDescription("You scored a total of " + (await res.json()).total + " points");
                setGameOver(true)
                return;
            default:
                setOverlayText("ERROR " + res.status);
                returnHome();
                return;
        }

        data = await res.json();

        setRoundStartTime(Date.now());
        setTimeUsedString("00:00");

        setStartLocation({
            lat: data.start.lat,
            lng: data.start.lng,
            address: data.start.address,
        })

        endStartLocation({
            lat: data.end.lat,
            lng: data.end.lng,
            address: data.end.address,
        })

        // @ts-ignore
        setLocation(data.start.lat, data.start.lng)
        // @ts-ignore
        setChallenge(data.start, data.end);
        // @ts-ignore
        setStreetViewMarker(data.end.lat, data.end.lng);

        setFetching(false);

        setIsOverlayVisible(false);
        setIsSubmittingGuess(true);
    }

    useEffect(() => {
        fetchGame();
    }, [fetching])

    useEffect(() => {
        updateDistance();
    }, [startLocation]);

    return (
        <>
            <title>Solo</title>
            <h1 className="text-white absolute z-50 text-xl m-2 p-1 drop-shadow-2xl bg-black/40 backdrop-blur-md">
                <b className="accent-to-primary-text">Starting on</b> {startLocation.address} / <b className="accent-to-primary-text">Navigate to</b> {endLocation.address}
            </h1>
            <h1 className="text-white absolute z-50 top-10 text-xl m-2 p-1 drop-shadow-2xl bg-black/40 backdrop-blur-md">
                {timeUsedString} used / {distance}m from target
            </h1>
            <h1 className="text-white absolute z-50 top-20 text-2xl font-bold m-2 p-1.5 drop-shadow-2xl bg-black/40 backdrop-blur-md">
                round {round}/{game_utils.max_rounds}
            </h1>
            <div className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
                <StreetView lat={data.start.lat} lng={data.start.lng} />
                <div className={mapStyle + mapConditional}>
                    <EducationMap lat={0} lng={0} />
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
                                You scored {roundData.points.toLocaleString()} points
                            </h1>
                            <hr className="border w-96 m-2 mb-6" />
                            <h2>
                                You went from {startLocation.address}
                            </h2>
                            <h2>
                                To {endLocation.address}
                            </h2>
                            <h2>
                                You traveled {Math.round(distance_traveled)} meters
                            </h2>
                            <h2>
                                You took {calculateTimeDifference(Date.now() - roundData.time_taken)} to complete the round
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
