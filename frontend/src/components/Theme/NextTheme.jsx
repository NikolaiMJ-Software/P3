import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getNextEvent } from "../../services/eventService.jsx";
import { getMoviesByTconsts } from "../../services/movieService.jsx";
import logoPNG from '../../assets/logo.png';

export default function NextTheme() {
  const {t} = useTranslation();

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadEvent = async () => {
      try{
        const next = await getNextEvent();

        if(!next){
          setEvent(null);
          setLoading(false);
          return;
        }

        setEvent(next);

        const moviesData = await getMoviesByTconsts(next.tConsts || []);
        setMovies(moviesData || []);

      } catch (err) {
        console.error("Error loading next event: ", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    
      loadEvent();
    }, []
  );

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d)) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
  };


  if (loading) {
    return (
      <div className="rounded-2xl border px-4 py-4 bg-white">
        <p className="text-center text-sm text-text-secondary">
          {t("loading")}...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="rounded-2xl border px-4 py-4 bg-white">
        <p className="text-center text-sm text-text-secondary">
          {t("noUpcomingEvent")}
        </p>
      </div>
    );
  }

  if(event.name === null){
    return (
      <div className="rounded-2xl border px-4 py-4 bg-white [container-type:inline-size]">
        {/* header/date */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">{t('nextTheme')}</span>
          <span className="text-sm font-medium text-text-secondary">{formatDate(event.timestamp)}</span>
        </div>

        {/* title */}
        <div className="mt-4 w-full rounded-md border px-3 py-2">
          <p className="text-lg font-bold text-center truncate" title="start date">
            F-Kult Start
          </p>
        </div>

        {/* movies */}
        <div
          className="mt-4 overflow-x-auto pb-2 pr-2"
        >
          <div className="flex w-full gap-3 px-2 snap-x snap-mandatory">
                {/* poster */}
                <div
                  className="aspect-[2/3] max-h-[18rem] w-full overflow-hidden rounded-md 
                            flex items-center justify-center bg-white"
                >
                  <img
                    src={logoPNG}
                    alt="logo for f-kult"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border px-4 py-4 bg-white [container-type:inline-size]">
      {/* header/date */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">{t('nextTheme')}</span>
        <span className="text-sm font-medium text-text-secondary">{formatDate(event.timestamp)}</span>
      </div>

      {/* title */}
      <div className="mt-4 w-full rounded-md border px-3 py-2">
        <p className="text-lg font-bold text-center truncate" title={event.name}>
          {event.name}
        </p>
      </div>

      {/* movies */}
      <div
        className="mt-4 overflow-x-auto pb-2 pr-2"
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        <div className="flex w-full gap-3 px-2 snap-x snap-mandatory">
          {movies.length > 0 ? (
            movies.map((movie, i) => (
              <div
                key={movie.id ?? `${movie.tConst}-${i}`}
                className="
                  shrink-0 snap-start aspect-[2/3]
                  w-[46%]
                  min-w-[8rem] max-w-[14rem]
                  @[420px]:w-[38%]
                  @[560px]:w-[31%]
                  @[720px]:w-[24%]
                "
              >
                {/* movie name */}
                <p className="text-sm font-medium text-center truncate w-full">
                  {movie.title}
                </p>
                {/* rating */}
                <p className="text-xs text-center text-text-secondary mb-1">
                    {movie.rating ? (
                        <>
                            {movie.rating}/10 <span>⭐</span>
                        </>
                    ) : (
                        <>No rating available</>
                    )}
                </p>

                {/* poster */}
                <div className="aspect-[2/3] w-full max-h-[18rem] overflow-hidden rounded-md shadow-sm border bg-text-secondary/10">
                  <img
                    src={movie.moviePosterURL}
                    alt={`Poster ${i + 1}`}
                    className="w-full h-full rounded-md object-cover border bg-text-secondary"
                    loading="lazy"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-text-secondary py-6 text-center w-full">
              No posters
            </div>
          )}
        </div>
      </div>
      {/* scroll hint overlay */}
      {movies.length > 2 && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 flex items-center justify-end pr-1">
          <span className="text-xl text-text-secondary">›</span>
        </div>
      )}
    </div>
  );
}



