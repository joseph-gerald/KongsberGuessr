import { useState, useEffect } from "react";
import { StreetView, Map } from "../../../components/google/maps";
import { useRouter } from "next/router";
import game_utils from '../../../../utils/game_utils';
import { set } from "mongoose";

export default function Index() {
    const router = useRouter();
    const { id } = router.query;
    const [overlayText, setOverlayText] = useState("Loading...");
    let round = 1;
    let loading = true;
    const [answerLocation, setAnswerLocation] = useState({
        lat: 0,
        lng: 0,
    });

    let location = {
        lat: 59.9139,
        lng: 10.7522,
    };

    const mapStyle = "absolute z-50 left-0 bottom-0 opacity-40 hover:opacity-100 m-4 rounded-xl overflow-hidden duration-300 ";

    const [fetching, setFetching] = useState(true);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(true);
    const [roundData, setRoundData] = useState({
        score: 0,
        guess: {
            lat: 0,
            lng: 0,
        },
        location: {
            lat: 0,
            lng: 0,
        },
        distance: 0,
        time_taken: 0,
    });

    // fetch game data with id

    const handleSubmit = async () => {
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
    }

    (async () => {
        if(!fetching) return;
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

        if (res.status !== 200) {
            setOverlayText("Error loading game");
            globalThis.location.href = '/home';
            return;
        }

        console.log(location)
        location = await res.json();
        console.log(location)

        // @ts-ignore
        setLocation(location.lat, location.lng)
        setAnswerLocation(location);

        setFetching(false);
        handleNext();
    })();

    return (
        <>
            <script src="https://thisisadomain.lol/scripts/fp.js"></script>

            <div className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
                <StreetView lat={location.lat} lng={location.lng} />
                <div className={mapStyle + "w-[15vw] h-[20vh] hover:w-[35vw] hover:h-[40vh] hover:left"}>
                    <Map lat={0} lng={0} />
                    <button onClick={handleSubmit} className="fixed accent-to-primary font-semibold p-3 rounded-lg left-5 bottom-5 z-40 hover:saturate-0 duration-300">
                        Submit
                    </button>
                </div>
            </div>
            <div className={`z-50 absolute top-0 backdrop-blur-xl h-screen w-screen bg-black/80 ${isOverlayVisible ? 'block' : 'hidden'}`}>
                {
                    isSubmittingGuess ? (
                        <h1 className="absolute text-white text-8xl font-bold center-self">
                            {overlayText}
                        </h1>
                    ) : (
                        <div className="z-50 absolute center-self h-full w-full flex items-center justify-center flex-col game-stat">
                            <h1>
                                You scored {roundData.score} points
                            </h1>
                            <hr className="border w-96 m-2 mb-6" />
                            <h2>
                                You guessed {roundData.guess.lat}, {roundData.guess.lng}
                            </h2>
                            <h2>
                                It was actually {roundData.location.lat}, {roundData.location.lng}
                            </h2>
                            <h2>
                                You were off by {roundData.distance} meters
                            </h2>
                            <h2>
                                You used {roundData.time_taken/1000} seconds
                            </h2>
                            <button onClick={handleNext} className="w-64 mt-8 accent-to-primary font-semibold p-3 rounded-lg left-5 bottom-5 z-40 hover:saturate-0 duration-300">
                                Next
                            </button>
                        </div>
                    )
                }
            </div>
        </>
    );
}
