import { useState } from "react";
import logo from "../../assets/logo.png"
import MovieCard, {ThemeMovieCard} from "./MovieCard.jsx";
import { useTranslation } from "react-i18next";

/**
 * DrinkingRuleCreator
 * Lets the user add, edit, and remove drinking rules for a theme.
 * Rules are stored in the parent component via props (rules + setRules).
 */
export default function DrinkingRuleCreator({rules, setRules}) {
    const [ruleInput, setRuleInput] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const {t} = useTranslation();
    const addRule = () => {//adds a rule to the list of rules.
        if (ruleInput.trim() === "") return;
        setRules ([...rules, ruleInput.trim()]);//setRules is from a useState given in the props of the function parameters
        //... is a spread operator saying, copy all previous array elements in rules, and afterward put our rule
        setRuleInput("");//reset the textfield
    };

    const startEdit = (index, rule) => {
        setEditingIndex(index);
        setEditText(rule);
    };

    const finishEdit = (index) => {
        const updated = [...rules];
        updated[index] = editText.trim();
        setRules(updated);
        setEditingIndex(null);
    };

    const removeRule = (indexToRemove) => {
        setRules(rules.filter((_, index) => index !== indexToRemove));
    };
    //security ternary operator making sure we do have an array of rules else we would crash when we try to .map them
    const saferules = Array.isArray(rules) ? rules : [];
    return(
        <>
            {/* Section title */}
            <p className={"text-sm sm:text-base"}>{t("drinking rules:")}</p>
            {/* Rule input + add button */}
            <div className={"flex flex-row items-center gap-2 w-full max-w-[600px]"}>
                <input type={"text"} value={ruleInput} onChange={(event) => setRuleInput(event.target.value)} onKeyDown={(event) => {if (event.key === "Enter"){event.preventDefault(); addRule();}}} className={"bg-primary border-2 rounded-2xl flex-grow text-sm sm:text-base text-center"} placeholder={t("write drinking rule...")}/>
                <button className={"btn-primary px-3 py-1"} onClick={addRule}>{t("add")}</button>
            </div>
            {/* Rules list */}
            <div className="overflow-y-auto overflow-x-hidden max-h-[100px] max-w-[500px]">
                {saferules.map((rule, index) => (
                    <div
                        key={index}
                        className="bg-primary flex flex-row items-center justify-between border-b border-text-secondary py-1 px-2 max-w-full">
                        {/* Edit mode: show input, otherwise show text */}
                        {editingIndex === index ? (
                            <input
                                className="flex-grow text-center border"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onBlur={() => finishEdit(index)}
                                onKeyDown={(e) => e.key === "Enter" && finishEdit(index)}
                                autoFocus
                            />
                        ) : (
                            <p
                                className="flex-grow text-center truncate cursor-pointer"
                                onClick={() => startEdit(index, rule)}
                            >
                                {rule}
                            </p>
                        )}
                        {/* Remove rule button */}
                        <button
                            onClick={() => removeRule(index)}
                            className="text-text-error font-bold px-2 hover:text-red-700 m-1 cursor-pointer"
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        </>
    )

}