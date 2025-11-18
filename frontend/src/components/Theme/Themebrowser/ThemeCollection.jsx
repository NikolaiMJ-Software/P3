import ThemeCard, {EventStartup, EventThemeCard, ThemeCreationCard} from "../ThemeCard.jsx";

export default function ThemeCollection({isCreator, onClick, themes, showActions, onDelete}){
    const safeThemes = Array.isArray(themes) ? themes : [];

    return(
        <>
            <div className={"flex gap-5 p-4 overflow-x-auto"}>
                {/* individual cards */}
                {isCreator && <ThemeCreationCard onClick={onClick}></ThemeCreationCard>}
                {safeThemes.map(theme =>  {
                    console.log("theme object:", theme);
                    console.log(`theme username: ${theme.username}`)
                    return <ThemeCard
                        key={theme.themeId || theme.id || `${theme.username}-${theme.name}`}
                        drinkingRules={theme.drinkingRules}
                        name={theme.username}
                        title={theme.name}
                        tConsts={theme.tConsts}
                        timestamp={theme.timestamp}
                        showActions={showActions}
                        onDelete={() => onDelete && onDelete(theme.themeId)}
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
                        return <EventStartup key={`startup-${event.id}`} name={event.username} timestamp={event.timestamp}></EventStartup>
                    }
                    return <EventThemeCard
                        name={event.username}
                        key={`event-${event.id}`}
                        tConsts={event.tConsts}
                        title={event.name}
                        drinkingRules={event.drinkingRules}
                        timestamp={event.eventDate}
                        isSeries={event.isSeries}
                        >
                    </EventThemeCard>
                })}
                <EventThemeCard key="hardcodedpirate-1" drinkingRules={["Take a sip when they say Arrr", "Take a sip when they say matey"]} title={"Pirates Night"} name={"Kabuum"} tConsts={["tt0325980", "tt0383574"]} timestamp={"2025-09-11T16:00:00"}></EventThemeCard>
                <EventStartup key="hardcoded-startup" name={"Kabuum"} timestamp={"2026-01-11T16:00:00"}></EventStartup>
            </div>
        </>
    )
}