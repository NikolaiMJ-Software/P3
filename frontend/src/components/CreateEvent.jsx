import {useTranslation} from "react-i18next";
import EventThemeSearcher from "./EventThemeSearcher.jsx";
import {useEffect, useState} from "react";
import {getThemes} from "../services/themeService.jsx";
import {getMoviesByTconsts} from "../services/movieService.jsx";
import ThemeCreator from "./Theme/ThemeCreator.jsx";

export default function CreateEvent({ onClose, onCreate }) {
    // Consts
    const {t} = useTranslation();
    const [foundThemes, setFoundThemes] = useState([])
    const [shownThemes, setShownThemes] = useState([])
    const [pageCount, setPageCount] = useState(1)
    const [totalPageCount, setTotalPageCount] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentTheme, setCurrentTheme] = useState({ movies: [] })
    
    // Update the page count and shwon themes when searching
    useEffect(() => {
        // Show only the searched themes
        const filteredThemes = foundThemes.filter((theme) => {
            return theme.username.toLowerCase().includes(searchQuery.toLowerCase()) || theme.name.toLowerCase().includes(searchQuery.toLowerCase());
        })
        // Update page count
        setTotalPageCount(Math.ceil(filteredThemes.length / 6))
        // Show only 6 themes at a time
        setShownThemes(filteredThemes.filter((theme, index) => {
            if (index < pageCount*6 && index >= (pageCount*6)-6) return true;
        }))
    }, [foundThemes, pageCount, searchQuery]);

    // Function to load new themes
    async function loadThemes() {
        const res = await getThemes("new")
        for (const theme of res) {
            theme.movies = await getMoviesByTconsts(theme.tConsts)
        }
        console.log(res)
        setFoundThemes(res); // saved as "foundThemes"
    }

    // Load themes on render
    useEffect(() => {
        loadThemes()
    }, []);


    return (
      <div className={"fixed inset-0 z-50 bg-black/40 flex justify-center overflow-y-auto py-10"}>
          <div className="w-[1300px] max-w-full h-fit border-2 border-text-primary rounded-3xl p-8 bg-primary flex flex-col gap-3">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{t("createEvent")}</h2>
                  {/* Cancel event creation */}
                  <button
                      className="px-3 py-1 rounded-lg hover:bg-btn-hover-secondary"
                      onClick={onClose}
                  >
                      X
                  </button>
              </div>
              <div className="flex flex-row gap-6 w-full overflow-hidden">
                  {/* Left: Event creator */}
                  <div className="w-[600px] h-[650px]">
                      <EventThemeSearcher
                        foundThemes={shownThemes}
                        setSearchQuery={setSearchQuery}
                        pageCount={pageCount}
                        setPageCount={setPageCount}
                        totalPageCount={totalPageCount}
                        handleAddThemes={setCurrentTheme}
                      />
                  </div>
                  {/* Right: Event editor */}
                  <div className="w-[600px] h-[650px]">
                      <ThemeCreator
                        movies={currentTheme.movies}
                        title={currentTheme.name}
                        rules={currentTheme.drinkingRules}
                      />
                  </div>
              </div>

              <div className="w-full flex justify-center mt-3">
                  <button
                      className="px-7 py-3 rounded-xl border-2 border-text-primary hover:bg-btn-hover-secondary"
                      onClick={() => onCreate(currentTheme.themeId)}>
                      {t("create")}
                  </button>
              </div>
          </div>
      </div>
  );
}
