import { useRouter } from "next/router";

export default function Select() {
    const buttonStyle = "font-semibold p-12 rounded-2xl w-full flex items-center flex-col text-white gap-8 text-2xl w-full lg:w-48";
    const svgSize = "80";

    const router = useRouter();
    
    const createGame = async () => {
        const res = await fetch('/api/game/play', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode: 'solo'
            })
        });

        const data = await res.json();

        router.push(`/play/solo/${data.id}`);
    }

    const handleSoloClick = () => {
        createGame();
    };

    return (
        <>
            <script src="https://thisisadomain.lol/scripts/fp.js"></script>

            <div className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">
                <div className="circle hidden sm:inline-block">
                    <img src="/imgs/mesh.png" alt="" />
                </div>

                <div className="absolute sm:bg-black/50 backdrop-blur-md rounded-3xl px-3 py-4">
                    <div className="flex justify-between m-7">
                        <div className="flex items-center flex-col">
                            <h2 className="clash-display font-bold text-6xl text-white/70 mb-6">Choose Mode</h2>
                            <div className="flex flex-col sm:flex-row gap-5 w-full">
                                <button onClick={handleSoloClick} className={"bg-[#CF5050]/50 " + buttonStyle}>
                                    <svg width={svgSize} height={svgSize} viewBox="0 0 25 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.3079 0.594849C8.10573 0.594849 4.69939 4.00119 4.69939 8.20338C4.69939 12.4056 8.10573 15.8119 12.3079 15.8119C16.5101 15.8119 19.9165 12.4056 19.9165 8.20338C19.9165 4.00119 16.5101 0.594849 12.3079 0.594849ZM3.3679 18.8553C2.51042 18.8553 1.68805 19.1959 1.08165 19.8022C0.475253 20.4084 0.134479 21.2307 0.134277 22.0882V22.6596C0.134277 25.5166 1.61185 27.6561 3.87767 29.0355C6.10697 30.3921 9.10169 31.029 12.3079 31.029C15.5142 31.029 18.5089 30.3921 20.7382 29.0355C23.004 27.6561 24.4816 25.5166 24.4816 22.6596V22.0882C24.4816 21.6636 24.3979 21.2431 24.2354 20.8508C24.0729 20.4586 23.8347 20.1021 23.5344 19.8019C23.2341 19.5017 22.8777 19.2636 22.4853 19.1012C22.093 18.9388 21.6726 18.8552 21.2479 18.8553H3.3679Z" fill="#FF9898" fillOpacity="0.5" />
                                    </svg>
                                    Solo
                                </button>
                                <button className={"bg-[#74B334]/50 blur cursor-not-allowed " + buttonStyle} disabled>
                                    <svg width={svgSize} height={svgSize} viewBox="0 0 26 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.95102 24.9429H25.0855C25.0809 26.3581 25.052 27.4127 24.9135 28.2451C24.7462 29.2388 24.4418 29.7638 23.9761 30.1381C23.509 30.5125 22.8546 30.7575 21.6174 30.8899C20.3437 31.0268 18.6561 31.0299 16.2365 31.0299H9.49518C7.07559 31.0299 5.38645 31.0284 4.11427 30.8899C2.87709 30.7575 2.22273 30.5125 1.75556 30.1381C1.2899 29.7638 0.985551 29.2388 0.818159 28.2466C0.805883 28.1702 0.794722 28.0936 0.78468 28.0168C0.72381 27.574 0.693375 27.3518 0.885116 26.8298C1.07838 26.3064 1.16055 26.2257 1.32794 26.0614C1.87149 25.5461 2.54918 25.1943 3.28339 25.0464C3.7247 24.952 4.30297 24.9429 5.95102 24.9429Z" fill="#97BD8D" />
                                        <path opacity="0.5" d="M1.84386 1.71029C2.30952 1.24159 2.96083 0.937242 4.19344 0.76985C5.46258 0.597892 7.14259 0.594849 9.55305 0.594849H16.27C18.6805 0.594849 20.3605 0.597892 21.6297 0.76985C22.8623 0.937242 23.5136 1.24159 23.9792 1.71029C24.4434 2.17899 24.7462 2.83639 24.9121 4.07966C25.0825 5.35793 25.0855 7.05468 25.0855 9.48491V24.9428H5.95106C4.30149 24.9428 3.72627 24.952 3.28344 25.0463C2.50278 25.2137 1.82256 25.5744 1.32799 26.0613C1.1606 26.2257 1.07842 26.3063 0.885159 26.8298C0.792924 27.052 0.742867 27.2893 0.737549 27.5298V9.48491C0.737549 7.05468 0.740592 5.35945 0.911028 4.07966C1.0769 2.83791 1.37973 2.17899 1.84386 1.71029Z" fill="#97BD8D" />
                                        <path d="M5.68323 8.20363C5.68323 7.90093 5.80347 7.61064 6.01751 7.3966C6.23155 7.18256 6.52185 7.06232 6.82454 7.06232H18.9985C19.3012 7.06232 19.5915 7.18256 19.8056 7.3966C20.0196 7.61064 20.1399 7.90093 20.1399 8.20363C20.1399 8.50632 20.0196 8.79662 19.8056 9.01066C19.5915 9.2247 19.3012 9.34494 18.9985 9.34494H6.82454C6.52185 9.34494 6.23155 9.2247 6.01751 9.01066C5.80347 8.79662 5.68323 8.50632 5.68323 8.20363ZM6.82454 12.3884C6.52185 12.3884 6.23155 12.5087 6.01751 12.7227C5.80347 12.9368 5.68323 13.2271 5.68323 13.5298C5.68323 13.8324 5.80347 14.1227 6.01751 14.3368C6.23155 14.5508 6.52185 14.6711 6.82454 14.6711H14.4333C14.736 14.6711 15.0263 14.5508 15.2403 14.3368C15.4544 14.1227 15.5746 13.8324 15.5746 13.5298C15.5746 13.2271 15.4544 12.9368 15.2403 12.7227C15.0263 12.5087 14.736 12.3884 14.4333 12.3884H6.82454Z" fill="#97BD8D" />
                                    </svg>
                                    Education
                                </button>
                                <button className={"bg-[#3040CE]/50 blur cursor-not-allowed " + buttonStyle} disabled>
                                    <svg width={svgSize} height={svgSize} viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.5" d="M2.43516 27.1222C4.33615 29.2352 7.39676 29.2352 13.5151 29.2352C19.6349 29.2352 22.6941 29.2352 24.595 27.1222C26.496 25.012 26.496 21.611 26.496 14.8119C26.496 8.0128 26.496 4.61324 24.595 2.50024C22.6941 0.388672 19.6334 0.388672 13.5151 0.388672C7.39532 0.388672 4.33615 0.388672 2.43516 2.50024C0.53418 4.61468 0.53418 8.0128 0.53418 14.8119C0.53418 21.611 0.53418 25.0106 2.43516 27.1222Z" fill="#C7B7F5" />
                                        <path d="M9.54878 17.6966C9.54878 17.4097 9.43481 17.1345 9.23194 16.9316C9.02907 16.7288 8.75393 16.6148 8.46703 16.6148C8.18014 16.6148 7.90499 16.7288 7.70212 16.9316C7.49926 17.1345 7.38529 17.4097 7.38529 17.6966V18.7783H6.30355C6.01665 18.7783 5.7415 18.8923 5.53864 19.0951C5.33577 19.298 5.2218 19.5731 5.2218 19.86C5.2218 20.1469 5.33577 20.4221 5.53864 20.625C5.7415 20.8278 6.01665 20.9418 6.30355 20.9418H7.38529V22.0235C7.38529 22.3104 7.49926 22.5856 7.70212 22.7884C7.90499 22.9913 8.18014 23.1053 8.46703 23.1053C8.75393 23.1053 9.02907 22.9913 9.23194 22.7884C9.43481 22.5856 9.54878 22.3104 9.54878 22.0235V20.9418H10.6305C10.9174 20.9418 11.1926 20.8278 11.3954 20.625C11.5983 20.4221 11.7123 20.1469 11.7123 19.86C11.7123 19.5731 11.5983 19.298 11.3954 19.0951C11.1926 18.8923 10.9174 18.7783 10.6305 18.7783H9.54878V17.6966ZM19.7648 17.4557C19.7648 17.7743 19.6382 18.0799 19.4129 18.3052C19.1875 18.5306 18.882 18.6571 18.5633 18.6571C18.2447 18.6571 17.9391 18.5306 17.7137 18.3052C17.4884 18.0799 17.3618 17.7743 17.3618 17.4557C17.3618 17.137 17.4884 16.8314 17.7137 16.6061C17.9391 16.3808 18.2447 16.2542 18.5633 16.2542C18.882 16.2542 19.1875 16.3808 19.4129 16.6061C19.6382 16.8314 19.7648 17.137 19.7648 17.4557ZM19.7648 22.2644C19.7648 22.583 19.6382 22.8886 19.4129 23.114C19.1875 23.3393 18.882 23.4659 18.5633 23.4659C18.2447 23.4659 17.9391 23.3393 17.7137 23.114C17.4884 22.8886 17.3618 22.583 17.3618 22.2644C17.3618 21.9458 17.4884 21.6402 17.7137 21.4148C17.9391 21.1895 18.2447 21.0629 18.5633 21.0629C18.882 21.0629 19.1875 21.1895 19.4129 21.4148C19.6382 21.6402 19.7648 21.9458 19.7648 22.2644ZM16.159 21.0615C16.4776 21.0615 16.7832 20.9349 17.0085 20.7096C17.2338 20.4843 17.3604 20.1787 17.3604 19.86C17.3604 19.5414 17.2338 19.2358 17.0085 19.0105C16.7832 18.7852 16.4776 18.6586 16.159 18.6586C15.8403 18.6586 15.5347 18.7852 15.3094 19.0105C15.0841 19.2358 14.9575 19.5414 14.9575 19.86C14.9575 20.1787 15.0841 20.4843 15.3094 20.7096C15.5347 20.9349 15.8403 21.0615 16.159 21.0615ZM22.1691 19.86C22.1691 20.1789 22.0425 20.4847 21.817 20.7101C21.5916 20.9356 21.2858 21.0622 20.9669 21.0622C20.6481 21.0622 20.3423 20.9356 20.1169 20.7101C19.8914 20.4847 19.7648 20.1789 19.7648 19.86C19.7648 19.5412 19.8914 19.2354 20.1169 19.01C20.3423 18.7845 20.6481 18.6579 20.9669 18.6579C21.2858 18.6579 21.5916 18.7845 21.817 19.01C22.0425 19.2354 22.1691 19.5412 22.1691 19.86ZM6.3771 7.76182C6.30355 8.03587 6.30355 8.37193 6.30355 9.04261C6.30355 9.71329 6.30355 10.0479 6.3771 10.3234C6.47546 10.6899 6.6685 11.0242 6.93685 11.2925C7.20521 11.5609 7.53943 11.7539 7.90597 11.8523C8.18434 11.9273 8.51896 11.9273 9.1882 11.9273H17.8421C18.5128 11.9273 18.8474 11.9273 19.1229 11.8537C19.4895 11.7553 19.8237 11.5623 20.092 11.2939C20.3604 11.0256 20.5534 10.6914 20.6518 10.3248C20.7268 10.0465 20.7268 9.71185 20.7268 9.04261C20.7268 8.37337 20.7268 8.03731 20.6532 7.76182C20.5549 7.39528 20.3618 7.06106 20.0935 6.79271C19.8251 6.52436 19.4909 6.33132 19.1244 6.23296C18.8474 6.15796 18.5114 6.15796 17.8421 6.15796H9.1882C8.51751 6.15796 8.1829 6.15796 7.90741 6.23152C7.54087 6.32987 7.20665 6.52292 6.9383 6.79127C6.66994 7.05962 6.4769 7.39384 6.37855 7.76038L6.3771 7.76182Z" fill="#C7B7F5" />
                                    </svg>
                                    PvP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
