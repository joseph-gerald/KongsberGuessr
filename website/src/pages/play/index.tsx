import { useEffect } from "react";

export default function Game() {
    const buttonStyle = "font-semibold p-12 rounded-2xl w-full flex items-center flex-col text-white gap-8 text-2xl w-full lg:w-48";
    const svgSize = "80";
    return (
        <>
            <script src="https://thisisadomain.lol/scripts/fp.js"></script>

            <div className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
                Game
            </div>
        </>
    );
}
