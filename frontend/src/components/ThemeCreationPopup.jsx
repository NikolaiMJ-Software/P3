import { useState } from "react";
import logo from "../assets/logo.png"

export default function ThemeCreationPopup({isOpen, onClose, onSubmit, userId}) {
    const [title, setTitle] = useState("");
    const [movies, setMovies] = useState([]);
    const [rules, setRules] = useState("");

    const handleSubmit = () => {
        if(!title){
            alert("Please enter theme title");
            return;
        }
        if(movies.length === 0) {
            alert("Please add at least one movie");
            return;
        }
        onSubmit({
            title,
            movies,
            rules: rules.trim() || null,
            userId,
        });

        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle("");
        setMovies([]);
        setRules("");
    }
    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) {
        return null;
    }
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="relative bg-white rounded-2xl p-6 shadow-lg w-[1000px]">

                <h2 className={"text-2xl font-semibold mb-4 text-center items-center"}>Create new theme</h2>
                <img src={logo}
                     alt="logo"
                     className="absolute top-3 left-3 w-15 h-15 object-contain"/>
                <button onClick={handleClose} className={" absolute top-3 right-3 text-5xl"}>X</button>

                {/* inputs */}

                <input type={"text"} placeholder={"Enter theme title"}/>

                <input type={"text"} placeholder={"Search Movie"}/>
                <MovieSuggestion movieName={"pirates"} year={"2004"}></MovieSuggestion>
                <button
                    onClick={onSubmit}
                    className={"absolute bottom-4 left-1/2 transform -translate-x-1/2 font-semibold px-8 py-3 rounded-xl border-2 border-black"}>Confirm
                </button>
            </div>
        </div>
    )
}

export function MovieSuggestion({movieName, year}) {
    return(
        <div>
            <p className="">{movieName}</p>
            <p>{year}</p>
        </div>
    )
}