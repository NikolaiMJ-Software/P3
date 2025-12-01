import {useTranslation} from "react-i18next";

export default function CreateEvent({ onClose }) {
  const {t} = useTranslation();

  return (
      <div className={"fixed inset-0 z-50 bg-black/40 flex justify-center overflow-y-auto py-10"}>
          <div className="w-[1300px] max-w-full h-fit border-2 border-text-primary rounded-3xl p-8 bg-white flex flex-col gap-3">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{t("createEvent")}</h2>
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
                  </div>
                  {/* Right: Event editor */}
                  <div className="w-[600px] h-[650px]">
                  </div>
              </div>

              <div className="w-full flex justify-center mt-3">
                  <button
                      className="px-7 py-3 rounded-xl border-2 border-text-primary hover:bg-btn-hover-secondary"
                  >
                      {t("create")}
                  </button>
              </div>
          </div>
      </div>
  );
}
