import ThemeCard, {EventStartup, EventThemeCard, ThemeCreationCard} from "../ThemeCard.jsx";

export default function ThemeCollection({isCreator, onClick, themes}){
    const safeThemes = Array.isArray(themes) ? themes : [];

    return(
        <>
            <div className={"flex gap-5 p-4 overflow-x-auto"}>
                {/* individual cards */}
                {safeThemes.map(theme =>  {
                    console.log(`theme username: ${theme.username}`)
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
                    if (event.name === null){
                        return <EventStartup name={event.username} timestamp={event.timestamp}></EventStartup>
                    }
                    return <EventThemeCard
                        name={event.username}
                        tConsts={event.tConsts}
                        title={event.name}
                        drinkingRules={event.drinkingRules}
                        timestamp={event.timestamp}
                        isSeries={event.isSeries}>
                    </EventThemeCard>
                })}
                <EventThemeCard drinkingRules={["Take a sip when they say Arrr", "Take a sip when they say matey"]} title={"Pirates Night"} name={"Kabuum"} tConsts={["tt0325980", "tt0383574"]} timestamp={"2025-09-11T16:00:00"}></EventThemeCard>
                <EventStartup name={"Kabuum"} timestamp={"2026-01-11T16:00:00"}></EventStartup>
            </div>
        </>
    )
}