import logoPNG from '../assets/logo.png';
import pizzaWEBP from '../assets/pizza.webp'
import discordWEBP from '../assets/discord.webp'
import userPNG from "../assets/User.png"
import englishPNG from "../assets/english.png"
import danishPNG from "../assets/danish.png"
import {useNavigate, useParams} from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Header(){
    const navigate = useNavigate();
    const {username} = useParams();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);


    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "da");

    useEffect(() => {
        localStorage.setItem("lang", lang);
        document.documentElement.setAttribute("lang", lang);
        window.dispatchEvent(new CustomEvent("lang-change", { detail: lang }));

    }, [lang]);

    const toggleLang = () => {
        setLang(prev => (prev === "da" ? "en" : "da"));
        //test log
        //console.log(lang);
    };


    const logout = () =>{
        sessionStorage.removeItem("username");
        navigate("/login");
    };


    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="pb-10 flex justify-between top-0 inset-x-0">
            <NavButton
                icon={logoPNG}
                onClick={() => {navigate(`/${username}`)}}
            />

            <h1 className="relative top-2 left-0 right-0 text-center text-3xl bold">F-Kult</h1>

            <div className="flex">
                <NavButton
                label={lang === "da" ? "English" : "Dansk"}
                icon={lang === "da" ? englishPNG : danishPNG}
                onClick={toggleLang}
                />

                <NavButton
                    label="Pizza"
                    icon={pizzaWEBP}
                    onClick={() => {window.location.href = "https://f-kult-pizza-bestiller.vercel.app/"}}
                />

                <NavButton
                    label="Discord"
                    icon={discordWEBP}
                    onClick={() => {window.location.href = "https://discord.gg/zV3GEZyY6z"}}
                />

                <div className="relative flex-col pr-1" ref={menuRef}>
                     <button
                        className="flex transition-colors hover:bg-gray-300 cursor-pointer rounded-4xl border size-12 items-center justify-center"
                        onClick={()=> setOpen(prev => !prev)}
                        title={username}
                        >
                        <img className="w-9 h-9" src={userPNG} alt="User menu"/>
                     </button>
                     <p className="text-center align-top text-sm">{username}</p>

                     {open && (
                        <div className="absolute right-0 top-14 w-36 bg-white border rounded-xl shadow-lg z-50">
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200 rounded-t-xl"
                                onClick={()=>{
                                    setOpen(false);
                                    navigate(`/admin/${username}`);
                                }}
                                >
                                Admin
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-red-500 rounded-b-xl"
                                onClick={logout}
                                >
                                Logout
                            </button>
                        </div>
                     )}
                </div>
            </div>
        </header>
    )
}

function NavButton({ icon, label, onClick }) {
    if (icon === logoPNG){
        return (
            <button className="flex transition-colors hover:bg-gray-300 cursor-pointer rounded-4xl size-20 items-center justify-center" onClick={onClick} title={label}>
                <img src={icon} alt={label}/>
            </button>

        );
    }

    return (
        <div className="flex-col pr-1">
            <button className="flex transition-colors hover:bg-gray-300 cursor-pointer rounded-4xl border size-12 items-center justify-center" onClick={onClick} title={label}>
                <img className="w-9 h-9" src={icon} alt={label}/>
            </button>
            <p className="text-center align-top text-sm ">{label}</p>
        </div>

    );
}