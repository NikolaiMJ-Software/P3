import logoPNG from '../assets/logo.png';
import pizzaPNG from '../assets/pizza.png'
import discordWEBP from '../assets/discord.webp'
import userPNG from "../assets/User.png"
import {useNavigate} from "react-router-dom";
export default function Header(){
    const navigate = useNavigate();

    return (
        <header className="absolute flex justify-between top-0 inset-x-0 p-5">
            <NavButton
                icon={logoPNG}
                onClick={() => {navigate("/")}}
            />

            <h1 className="relative top-5 left-0 right-0  text-center text-2xl">F-Kult</h1>

            <div className="flex">
                <NavButton
                    label="Pizza"
                    icon={pizzaPNG}
                    onClick={() => {window.location.href = "https://f-kult-pizza-bestiller.vercel.app/"}}
                />

                <NavButton
                    label="Discord"
                    icon={discordWEBP}
                    onClick={() => {console.log("discord!")}}
                />

                <NavButton
                    label="User"
                    icon={userPNG}
                    onClick={() => {console.log("User!")}}
                />
            </div>
        </header>
    )
}

function NavButton({ style, icon, label, onClick }) {
    return (
        <div className="flex-col pr-1">
            <button className="flex hover:bg-gray-300 cursor-pointer rounded-4xl border size-16 items-center justify-center" onClick={onClick} title={label}>
                <img className="size-12" src={icon} alt={label}/>
            </button>
            <p className="text-center align-top">{label}</p>
        </div>

    );
}