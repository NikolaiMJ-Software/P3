export default function NextTheme({ dateLabel, date, title = "", posters = [] }) {
  const label =
    dateLabel ??
    (() => {
      if (!date) return "";
      const d = new Date(date);
      if (isNaN(d)) return "";
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      return `${dd}/${mm}`;
    })();

  return (
    <div className="rounded-2xl border px-4 py-4 bg-white [container-type:inline-size]">
      {/* header/date */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">Next Theme</span>
        <span className="text-sm font-medium text-text-secondary">{label}</span>
      </div>

      {/* title */}
      <div className="mt-4 w-full rounded-md border px-3 py-2">
        <p className="text-lg font-bold text-center truncate" title={title}>
          {title}
        </p>
      </div>

      {/* posters */}
      <div
        className="mt-4 overflow-x-auto pb-2 pr-2"
        style={{ scrollbarGutter: "stable both-edges" }}
      >
        <div className="flex w-full gap-3 px-2 snap-x snap-mandatory">
          {posters.length > 0 ? (
            posters.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="
                  shrink-0 snap-start aspect-[2/3]
                  w-[46%]
                  min-w-[8rem] max-w-[14rem]
                  @[420px]:w-[38%]
                  @[560px]:w-[31%]
                  @[720px]:w-[24%]
                "
              >
                <img
                  src={src}
                  alt={`Poster ${i + 1}`}
                  className="w-full h-full rounded-md object-cover border bg-text-secondary"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <div className="text-sm text-text-secondary py-6 text-center w-full">
              No posters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



