import { useState, useEffect } from "react";
import { StreetView, Map } from "../../../components/google/maps";
import { useRouter } from "next/router";

export default function Index() {
    const router = useRouter();
    const { id } = router.query;

    console.log(id)

    const location = {
        lat: 59.9139,
        lng: 10.7522,
    };

    const mapStyle = "absolute z-50 left-0 bottom-0 opacity-40 hover:opacity-100 m-4 rounded-xl overflow-hidden duration-300 ";

    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [isSubmittingGuess, setIsSubmittingGuess] = useState(true);

    const handleSubmit = () => {
        setIsOverlayVisible(true);
        setTimeout(() => {
            setIsSubmittingGuess(false);
        }, 1000);
    };

    const handleNext = () => {
        setIsOverlayVisible(false);
        setIsSubmittingGuess(true);
    }

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
                            Submitting Guess...
                        </h1>
                    ) : (
                        <div className="z-50 absolute center-self h-full w-full flex items-center justify-center flex-col game-stat">
                            <h1>
                                You scored 3600 points
                            </h1>
                            <hr className="border w-96 m-2 mb-6" />
                            <h2>
                                You guessed coordinates
                            </h2>
                            <h2>
                                It was actually coordinates
                            </h2>
                            <h2>
                                You were off by 400 meters
                            </h2>
                            <h2>
                                You used 241 seconds
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
