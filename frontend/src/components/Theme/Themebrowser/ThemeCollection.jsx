import ThemeCard, {EventStartup, EventThemeCard, ThemeCreationCard} from "../ThemeCard.jsx";

/**
 * ThemeCollection
 * Renders a horizontal scrollable list of theme cards.
 * - Optionally shows a "create theme" card for creators.
 * - Can pass edit/delete actions down to ThemeCard.
 */
export default function ThemeCollection({isCreator, onClick, themes, showActions, onDelete, onEdit}){
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
                        onEdit={() => onEdit && onEdit(theme)}
                        >
                    </ThemeCard>
                })}

            </div>
        </>
    )
}

/**
 * UpcomingThemeCollection
 * Renders upcoming events as cards:
 * - If event.name is null: show EventStartup card
 * - Otherwise: show EventThemeCard with theme + rules + movies
 */
export function UpcomingThemeCollection({events}){
    const safeEvents = Array.isArray(events) ? events : [];
    return(
        <>
            <div className={"flex gap-5 p-4 overflow-x-auto"}>
                {/* individual cards */}
                {safeEvents.map(event =>  {
                    if(event){
                    if (event.name === null){
                        return <EventStartup key={`startup-${event.id}`} name={event.username} timestamp={event.timestamp}></EventStartup>
                    }
                    return <EventThemeCard
                        name={event.username}
                        key={`event-${event.timestamp}`}
                        tConsts={event.tConsts}
                        title={event.name}
                        drinkingRules={event.drinkingRules}
                        timestamp={event.timestamp}>
                    </EventThemeCard>
                }})}
            </div>
        </>
    )
}