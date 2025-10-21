import logoPNG from '../assets/logo.png';
import pizzaPNG from '../assets/pizza.png'
import discordWEBP from '../assets/discord.webp'
import {useNavigate} from "react-router-dom";

export default function Header(){
    const navigate = useNavigate();

    return (
        <header className="Header">
            {/* F-Kult logo to go to homepage */}
            <LogoButton onClick={()=>navigate("/")}/>

            {/*  F-Kult */}
            <h1>F-Kult</h1>

            {/*  Pizza, Discord, User widgets */}
            <NavButton
                label="Pizza"
                icon={<img src={pizzaPNG}/>}
                onClick={() => {window.location.href = "https://f-kult-pizza-bestiller.vercel.app/"}}
            />

            <NavButton
                label="Discord"
                icon={<img src={discordWEBP}/>}
                onClick={() => {console.log("discord!")}}
            />

            <NavButton
                label="User"
                icon={<img src={discordWEBP}/>}
                onClick={() => {console.log("User!")}}
            />
        </header>
    )
}

function LogoButton({ onClick }) {
    return (
        <button onClick={onClick}>
            <img src={logoPNG} />
        </button>
    );
}

function NavButton({ icon, label, onClick }) {
    return (
        <div>
            <button onClick={onClick} title={label}>
                {icon}
            </button>
            {label}
        </div>

    );
}