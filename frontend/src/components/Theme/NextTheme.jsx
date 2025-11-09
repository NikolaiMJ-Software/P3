export default function NextTheme({dateLabel,date,title = "",posters = [],}) {
  const label = dateLabel ??(() => {
      if (!date) return "";
      const d = new Date(date);
      if (isNaN(d)) return "";
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      return `${dd}/${mm}`;
    })();

  return (
    <div className="rounded-2xl border px-4 py-4 bg-white">
      {/* header/date */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Next Theme</span>
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>

      {/* title */}
      <div className="mt-4 w-full rounded-md border px-3 py-2">
        <p className="text-lg font-bold text-center truncate" title={title}>
          {title}
        </p>
      </div>
        {/* posters */}
        <div
        className="mt-4 overflow-x-auto pb-2"
        style={{ scrollbarGutter: "stable both-edges" }}
        >
        <div className="flex w-max mx-auto gap-4 px-2 snap-x snap-mandatory">
            {posters.length > 0 ? (
            posters.map((src, i) => (
                <img
                key={`${src}-${i}`}
                src={src}
                alt={`Poster ${i + 1}`}
                className="h-48 w-32 md:h-64 md:w-44 rounded-md object-cover flex-none border bg-gray-50 snap-start"
                loading="lazy"
                />
            ))
            ) : (
            <div className="text-sm text-gray-500 py-6 text-center w-full">
                No posters
            </div>
            )}
        </div>
        </div>
    </div>
  );
}

