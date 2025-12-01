import { useState } from "react";
import logo from "../../assets/logo.png"
import MovieCard, {ThemeMovieCard} from "./MovieCard.jsx";

export default function DrinkingRuleCreator({rules, setRules}) {
    const [ruleInput, setRuleInput] = useState("");

    const addRule = () => {
        if (ruleInput.trim() === "") return;
        setRules ([...rules, ruleInput.trim()]);
        setRuleInput("");
    };

    const removeRule = (indexToRemove) => {
        setRules(rules.filter((_, index) => index !== indexToRemove));
    };

    const saferules = Array.isArray(rules) ? rules : [];
    return(
        <>
            <p className={""}>Drinking rules:</p>
            <div className={"flex flex-row items-center gap-2 w-full max-w-[600px]"}>
                <input type={"text"} value={ruleInput} onChange={(event) => setRuleInput(event.target.value)} onKeyDown={(event) => {if (event.key === "Enter"){event.preventDefault(); addRule();}}} className={"border-2 rounded-2xl flex-grow text-center"} placeholder={"Write drinking rule..."}/>
                <button className={"btn-primary px-3 py-1"} onClick={addRule}>Add</button>
            </div>
            <div className="overflow-y-auto overflow-x-hidden max-h-[100px] max-w-[500px]">
                {saferules.map((rule, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-center justify-between border-b border-text-secondary py-1 px-2 w-120"
                    >
                        <p className="flex-grow text-center truncate">{rule}</p>
                        <button
                            onClick={() => removeRule(index)}
                            className="text-text-error font-bold px-2 hover:text-red-700 m-1"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </>
    )

}