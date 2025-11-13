import {useTranslation} from "react-i18next";

export default function ThemeToggleButtons({selected, onSelect}){
    const {t} = useTranslation();
    const buttons = [
        {key: "your", label: t("your themes")},
        {key: "new", label: t("new themes")},
        {key: "old", label: t("old themes")},
    ];

    return(
        <div className={"flex gap-4"}>
            {buttons.map(btn => (
                <button key={btn.key} className={`btn-primary ${selected === btn.key ? "" : "btn-secondary"}`}
                onClick={() => onSelect(btn.key)}>{btn.label}</button>
            ))}
        </div>
    );
}