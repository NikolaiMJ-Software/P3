
export default function ThemeToggleButtons({selected, onSelect}){
    const buttons = [
        {key: "your", label: "Your themes"},
        {key: "new", label: "New themes"},
        {key: "old", label: "Old themes"},
    ];

    return(
        <div className={"flex gap-4"}>
            {buttons.map(btn => (
                <button key={btn.key} className={`px-6 py-3 rounded-2xl transition-colors ${selected === btn.key ? "bg-blue-500 text-white" :"bg-white hover:bg-gray-300"}`}
                onClick={() => onSelect(btn.key)}>{btn.label}</button>
            ))}
        </div>
    );
}