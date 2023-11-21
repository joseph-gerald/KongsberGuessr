export default function SignIn() {
    const buttonStyle = "font-semibold p-3 rounded-lg";
    const fieldStyle = "account-field rounded bg-[#171717]/50 p-3 border-[#292929] border h-12 rounded-md text-white";
    return (
        <>
            <div className="bg-black/80 sm:bg-[#212121] snap-y snap-proximity h-screen w-screen flex items-center justify-center relative">

                <div className="circle hidden sm:inline-block">
                    <img src="/imgs/mesh.png" alt="" />
                </div>

                <div className="absolute sm:bg-black/50 p-10 backdrop-blur-md rounded-3xl">
                    <h2 className="text-4xl lg:text-4xl p-3 font-bold text-white text-center">Welcome</h2>

                    <div className="flex flex-col my-14 gap-2">
                        <input type="text" placeholder="Username" id="account-username" className={fieldStyle} />
                        <input type="password" placeholder="Password" id="account-password" className={fieldStyle} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <button className={"accent-to-primary "+buttonStyle}>Register</button>
                        <button className={"bg-[#1F1F1F] text-[#A8A8A8] "+buttonStyle}>Sign In</button>
                    </div>
                </div>
            </div>
        </>
    );
}
