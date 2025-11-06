import { useState } from "react";
import logo from "../../assets/logo.png"
import MovieCard, {ThemeMovieCard} from "./MovieCard.jsx";

export default function DrinkingRuleCreator() {
    const [ruleInput, setRuleInput] = useState("");
    const [rules, setRules] = useState([]);

    const addRule = () => {
        if (ruleInput.trim() === "") return;
        setRules ([...rules, ruleInput.trim()]);
        setRuleInput("");
    };

    const removeRule = (indexToRemove) => {
        setRules(rules.filter((_, index) => index !== indexToRemove));
    };

    return(
        <>
            <p className={""}>Drinking rules:</p>
            <div className={"flex flex-row"}>
                <input type={"text"} value={ruleInput} onChange={(event) => setRuleInput(event.target.value)} onKeyDown={(event) => {if (event.key === "Enter"){event.preventDefault(); addRule();}}} className={"border-2 rounded-2xl w-100 text-center"} placeholder={"Write drinking rule..."}/>
                <button className={"border-2 rounded-2xl p-1 hover:cursor-pointer hover:bg-gray-300"} onClick={addRule}>Add</button>
            </div>
            <div className="overflow-y-auto overflow-x-hidden max-h-[100px] max-w-[500px]">
                {rules.map((rule, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-center justify-between border-b border-gray-200 py-1 px-2 w-120"
                    >
                        <p className="flex-grow text-center truncate">{rule}</p>
                        <button
                            onClick={() => removeRule(index)}
                            className="text-red-500 font-bold px-2 hover:text-red-700 m-1"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </>
    )

}