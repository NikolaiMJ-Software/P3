import logoPNG from '../assets/logo.png';

export default function Header(){
    // F-Kult logo to go to homepage
    let logo = <button>
        <img src={logoPNG} />
    </button>
    // F-Kult
    // Pizza, Discord, User widgets
    return logo;
}