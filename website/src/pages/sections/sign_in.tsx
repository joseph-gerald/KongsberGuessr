import { useState } from "react";

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('Sign in to start playing');
    const [messageColor, setMessageColor] = useState('text-white text-opacity-50');

    const handleRegister = async () => {
        handleResponse(await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // @ts-ignore
            body: JSON.stringify({ username, password, fp }),
        }));
    };

    const handleLogin = async () => {
        handleResponse(await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // @ts-ignore
            body: JSON.stringify({ username, password, fp }),
        }));
    };

    const handleResponse = async (response: Response) => {
        
        switch (response.status) {
            case 200:
                setMessage('Logging you in...');
                setMessageColor('text-green-600');
                break;
            case 401:
                setMessage('Wrong password');
                setMessageColor('text-red-600');
                break;
            case 400:
                setMessage((await response.json()).error);
                setMessageColor('text-red-600');
                break;
        }
    }

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
                    <p className={`text-center ${messageColor}`}>{message}</p>
                    <div className="flex flex-col my-14 gap-2">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={fieldStyle}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={fieldStyle}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <button onClick={handleRegister} className={"accent-to-primary " + buttonStyle}>Register</button>
                        <button onClick={handleLogin} className={"bg-[#1F1F1F] text-[#A8A8A8] " + buttonStyle}>Sign In</button>
                    </div>
                </div>
            </div>
        </>
    );
}
