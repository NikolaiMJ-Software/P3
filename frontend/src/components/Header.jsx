import logoPNG from '../assets/logo.png';
import pizzaWEBP from '../assets/pizza.webp'
import discordWEBP from '../assets/discord.webp'
import userPNG from "../assets/User.png"
import {useNavigate} from "react-router-dom";
export default function Header(){
    const navigate = useNavigate();

    return (
        <header className="pb-10 flex justify-between top-0 inset-x-0">
            <NavButton
                icon={logoPNG}
                onClick={() => {navigate("/changeThisLaterWhenLoginIsStored")}}
            />

            <h1 className="relative top-2 left-0 right-0 text-center text-3xl bold">F-Kult</h1>

            <div className="flex">
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

                <NavButton
                    label="User"
                    icon={userPNG}
                    onClick={() => {console.log("User!")}}
                />
            </div>

        </header>
    )
}

function NavButton({ icon, label, onClick }) {
    if (icon === logoPNG){
        return (
            <div className="flex-col">
                <button className="flex hover:bg-gray-300 cursor-pointer rounded-4xl size-20 items-center justify-center" onClick={onClick} title={label}>
                    <img src={icon} alt={label}/>
                </button>
                <p className="text-center align-top">{label}</p>
            </div>

        );
    }

    return (
        <div className="flex-col pr-1">
            <button className="flex hover:bg-gray-300 cursor-pointer rounded-4xl border size-12 items-center justify-center" onClick={onClick} title={label}>
                <img className="w-9 h-9" src={icon} alt={label}/>
            </button>
            <p className="text-center align-top text-sm">{label}</p>
        </div>

    );
}