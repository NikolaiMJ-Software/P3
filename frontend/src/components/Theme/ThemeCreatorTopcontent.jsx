import logo from "../../assets/logo.png";

//simple component to abstract the top part of the theme Creator away
export default function ThemeCreatorTopcontent({handleClose}){
    return(
        <>
            <h2 className={"text-2xl font-semibold mb-4 text-center items-center"}>Create new theme</h2>
            <img src={logo} alt="logo" className="absolute top-3 left-3 w-15 h-15 object-contain"/>
            <button onClick={handleClose} className={" absolute top-3 right-3 text-5xl"}>X</button>
        </>
    )
}