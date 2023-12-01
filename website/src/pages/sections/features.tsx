import icons from "@/components/icons";
import Feature from "@/components/feature";

export default function Features() {
    return (
        <>
            <div className="snap-y snap-proximity p-8 mt-4 lg:mt-0 lg:p-0 lg:h-screen w-screen flex items-center justify-center flex-col relative gap-12">
                <h1 className="font-semibold clash-display text-4xl md:text-6xl lg:text-8xl" style={{ color: "#C3D7EF" }}>
                    Why Us?
                </h1>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                    <Feature
                        title="Competitive"
                        desc="KongsberGuessr is the #1 geography game in Kongsberg. We have features that have never been seen on any other Kongsberg Geo Guessing game. Some features include: Existing and being totally free!"
                        img="/imgs/medal.png"
                    ></Feature>
                    <Feature
                        title="Pricing"
                        desc="KongsberGuessr comes at at the perfect price of FREE! We will be free forever and the code for this is open source so you can host this project for yourself when this goes down! But donations are appreciated  ;)"
                        img="/imgs/price.png"
                    ></Feature>
                    <Feature
                        title="Fun"
                        desc="KongsberGuessr is most probably the funnest geography game when it comes to Kongsberg. We not only aim to be a fun platform but also to learn as we have educational features aid your learning adventure!"
                        img="/imgs/game.png"
                    ></Feature>
                </div>
            </div>
        </>
    );
}
