import Placeholder from "../assets/placeholder.png";
import { Trans, useTranslation } from "react-i18next";

export default function FAQPage() {
  const { t } = useTranslation(["faq", "common"]);
  const ns = "faq";
  const toArray = (val) => (Array.isArray(val) ? val : []);

  return (
    <main className="px-4 sm:px-6 flex justify-center items-center">
      <div className="max-w-3xl border rounded-2xl px-12 py-10 w-full">
        <h1 className="text-3xl font-semibold">{t("title", { ns })}</h1>
        <hr className="my-4" />

        <p className="mt-4">{t("sections.story.p1", { ns })}</p>
        <p className="mt-4">{t("sections.story.p2", { ns })}</p>

        {/* Øl-matrice + Fiskeroulette */}
        <p className="mt-4">
          <Trans
            ns={ns}
            i18nKey="sections.story.p3"
            components={{
              root: <span />,
              ol: (
                <a
                  href={t("links.olmatrice", { ns })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                />
              ),
              fi: (
                <a
                  href={t("links.fisk", { ns })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                />
              )
            }}
          />
        </p>

        {/* Plakatarkiv + Discord */}
        <p className="mt-4">
          <Trans
            ns={ns}
            i18nKey="sections.story.p4"
            components={{
              root: <span />,
              po: (
                <a
                  href={t("links.poster", { ns })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                />
              ),
              di: (
                <a
                  href={t("links.discord", { ns })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                />
              )
            }}
          />
        </p>

        <hr className="my-4" />

        <h2 className="text-3xl font-semibold">{t("sections.committee.title", { ns })}</h2>
        <hr className="my-4" />
        <p className="mt-4">{t("sections.committee.p1", { ns })}</p>
        <ul className="mt-3 list-disc pl-6 space-y-2 leading-relaxed">
          <li>
            <a
              href={t("links.topholt", { ns })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600"
            >
              {t("sections.committee.contact.topholt", { ns })}
            </a>
          </li>
        </ul>

        <hr className="my-4" />

        <h2 className="text-3xl font-semibold">{t("sections.timePlace.title", { ns })}</h2>
        <hr className="my-4" />
        <p className="mt-4">{t("sections.timePlace.p1", { ns })}</p>
        <p className="mt-4">{t("sections.timePlace.p2", { ns })}</p>
        <p className="mt-4">{t("sections.timePlace.p3", { ns })}</p>

        <hr className="my-4" />

        <h2 className="text-3xl font-semibold">{t("sections.rules.title", { ns })}</h2>
        <hr className="my-4" />
        <p className="mt-4">{t("sections.rules.intro", { ns })}</p>

        <h3 className="mt-6 text-xl font-medium">{t("sections.rules.generalTitle", { ns })}</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2 leading-relaxed">
          {toArray(t("sections.rules.general", { ns, returnObjects: true })).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h3 className="mt-8 text-xl font-medium">{t("sections.rules.cheersTitle", { ns })}</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2 leading-relaxed">
          {toArray(t("sections.rules.cheers", { ns, returnObjects: true })).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Danny_DeVito"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600"
            >
              {t("sections.rules.cheersDannyLabel", { ns, defaultValue: "Danny DeVito" })}
            </a>
          </li>
        </ul>

        <hr className="my-4" />

        <h2 className="text-3xl font-semibold">{t("sections.story.title", { ns })}</h2>
        <hr className="my-4" />
        <p className="mt-4">{t("sections.story.dev1", { ns })}</p>
        <p className="mt-4">{t("sections.story.dev2", { ns })}</p>
        <p className="mt-4">{t("sections.story.dev3", { ns })}</p>

        {/* Credits links */}
        <p className="mt-4">
          <Trans
            ns={ns}
            i18nKey="sections.story.credits"
            components={{
              root: <span />,
              to: (
                <a
                  href={t("links.topholt", { ns })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                />
              ),
              kr: (
                <a
                  href={t("links.kresten", { ns })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600"
                />
              )
            }}
          />
        </p>

        <div className="mt-6">
          <img
            src={Placeholder}
            alt={t("sections.story.title", { ns })}
            className="mx-auto rounded-xl shadow-md w-3/4"
          />
          <p className="mt-2 text-center text-sm text-gray-500">{t("sections.story.caption", { ns })}</p>
        </div>
      </div>
    </main>
  );
}

