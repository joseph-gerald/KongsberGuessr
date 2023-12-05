import Home from "./sections/home";
import SignIn from "./sections/sign_in";
import Features from "./sections/features";
import { useEffect } from "react";

export default function Index() {
    let sectionIndex = 0;

    const syncScroll = () => {
        const sections = document.querySelectorAll('.section');
        const dots = document.querySelectorAll('.pagination-dot');
        let canScroll = true;

        function doScroll() {
            if (screen.width < 1024) return;
            sectionIndex = Math.min(Math.max(sectionIndex, 0), sections.length - 1);
            sections[sectionIndex].scrollIntoView({ behavior: 'smooth' });

            dots.forEach((dot, index) => {
                if (index !== sectionIndex) dot.classList.remove('active');
            });

            dots[sectionIndex].classList.add('active');
        }

        function scrollToNextSection(down: boolean) {
            if (canScroll) {
                sectionIndex += down ? 1 : -1;
                canScroll = false;

                setTimeout(() => canScroll = true, 750);
            }

            doScroll();
        }

        sections.forEach((region) => {
            region.addEventListener('wheel', (event: any) => {
                if (!canScroll) return;
                scrollToNextSection(event.wheelDeltaY < 0);
            });
        });
    }

    useEffect(() => {
        syncScroll();
    });

    return (
        <>
            <script src="https://thisisadomain.lol/scripts/fp.js" defer></script>
            <div className="snap-y snap-proximity">
                <div className="section">
                    <Home />
                </div>
                <div className="section">
                    <Features />
                </div>
                <div className="section">
                    <SignIn />
                </div>
            </div>
            <div className="pagination hidden lg:flex">
                {[0, 1, 2].map((i) => (
                    <div key={i} onClick={() => sectionIndex = i} className="pagination-dot cursor-pointer"></div>
                ))}
            </div>
        </>
    );
}
