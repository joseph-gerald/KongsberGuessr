import Home from "./sections/home";
import Features from "./sections/features";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Index() {
    const router = useRouter();
    let query = router.query
    const [curSection, setSection] = useState(query.section);

    const syncScroll = (section: any) => {
        const home = document.getElementById("home");
        const faq = document.getElementById("faqs");
        const features = document.getElementById("features");
        if (!home || !faq || !features) return;
        if (section === "home") {
            home.scrollIntoView({ behavior: "smooth" });
        }
        if (section === "faq") {
            faq.scrollIntoView({ behavior: "smooth" });
        }
        if (section === "features") {
            features.scrollIntoView({ behavior: "smooth" });
        }
        // setSection(section);
    };

    useEffect(() => {
        syncScroll(curSection);
    }, [curSection]);


    return (
        <>
            <div className="snap-y snap-proximity">
                <div className="snap-start">
                    <Home />
                </div>
                <div className="snap-start">
                    <Features />
                </div>
            </div>
        </>
    );
}
