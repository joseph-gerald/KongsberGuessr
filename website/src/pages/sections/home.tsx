import icons from "@/components/icons";

export default function Home() {
    return (
        <>
            <img src="https://i.redd.it/zvv33s6vkmp21.jpg" className="h-screen w-screen blur absolute" />
            <div className="snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
                <div className="absolute shadow-2xl backdrop-blur-md bg-black/20 p-4 rounded">
                    <h1 className="font-bold accent-to-primary-text clash-display text-4xl md:text-6xl lg:text-8xl">
                        KongsbergGuessr
                    </h1>
                </div>
                <div className="bottom-4 absolute flex items-center justify-center flex-col">
                    <div className="flex items-center justify-center p-3.5 rounded-xl text-lg m-3" style={{backgroundColor: "#0A2418", color: "#75C09D"}}>
                        <b className="uppercase">Scroll Down</b>
                    </div>
                    <icons.ArrowDown />
                </div>
            </div>
        </>
    );
}
