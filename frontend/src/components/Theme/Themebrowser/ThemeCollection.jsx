import ThemeCard, {ThemeCreationCard} from "../ThemeCard.jsx";

export default function ThemeCollection({isCreator, onClick, themes}){
    const safeThemes = Array.isArray(themes) ? themes : [];

    return(
        <>
            <div className={"flex gap-5 p-4 overflow-x-auto"}>
                {/* individual cards */}
                {isCreator && <ThemeCreationCard onClick={onClick}/>}
                {safeThemes.map(theme =>  {
                    return <ThemeCard
                        drinkingRules={theme.drinkingRules}
                        name={theme.username}
                        title={theme.name}
                        tConsts={theme.tConsts}
                        timestamp={theme.timestamp}
                        >
                    </ThemeCard>
                })}

            </div>
        </>
    )
}

export function UpcomingThemeCollection({events}){
    const safeEvents = Array.isArray(events) ? events : [];
    return(
        <>
            <div className={"flex gap-5 p-4 overflow-x-auto"}>
                {/* individual cards */}
                {safeEvents.map(event =>  {
                    return <ThemeCard
                        drinkingRules={event.drinkingRules}
                        name={event.username}
                        title={event.name}
                        tConsts={event.tConsts}
                    >
                    </ThemeCard>
                })}
                <ThemeCard drinkingRules={["Take a sip when they say Arrr", "Take a sip when they say matey"]} title={"Pirates Night"} name={"Kabuum"} tConsts={["tt0325980", "tt0383574"]}></ThemeCard>
                <ThemeCard drinkingRules={["Take a sip when they say Arrr", "Take a sip when they say matey"]} title={"Pirates Night"} name={"Kabuum"} tConsts={["tt0325980", "tt0383574"]}></ThemeCard>
                <ThemeCard drinkingRules={["Take a sip when they say Arrr", "Take a sip when they say matey"]} title={"Pirates Night"} name={"Kabuum"} tConsts={["tt0325980", "tt0383574"]}></ThemeCard>
            </div>
        </>
    )
}