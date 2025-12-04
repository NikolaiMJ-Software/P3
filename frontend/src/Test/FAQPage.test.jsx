import React from "react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { I18nextProvider } from "react-i18next";
import baseI18n from "../i18n";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import FAQPage from "../pages/FAQPage.jsx";

expect.extend(matchers);


describe("FAQ page tests", () => {
  let i18n;

  beforeEach(async () => {
    i18n = baseI18n.cloneInstance();
    // Default lang danish
    await i18n.changeLanguage("da");
  });

  function renderFAQPage(initialPath = "/faq") {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    );
  }

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the main title and key section headings in Danish", async () => {
    renderFAQPage();

    // Main page title "F-Kult" (same in both lang)
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: /F-Kult/i })
      ).toBeInTheDocument();
    });

    // Danish titles:
    expect(
      screen.getByRole("heading", { level: 2, name: /Udvalg/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: /Tid og sted/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: /Regler/i })
    ).toBeInTheDocument();
  });

  it("renders rules on Danish", async () => {
    renderFAQPage();

    const firstRule = i18n.t("sections.rules.general.0", { ns: "faq" });
    const secondRule = i18n.t("sections.rules.general.1", { ns: "faq" });

    await waitFor(() => {
      expect(screen.getByText(firstRule)).toBeInTheDocument();
    });

    expect(screen.getByText(secondRule)).toBeInTheDocument();
  });

  it("renders cheers rules and Danny DeVito link", async () => {
    renderFAQPage();

    // One of the 'cheers' items from the array
    const cheersItem = i18n.t("sections.rules.cheers.0", { ns: "faq" }); // "Selvreference ..." in da
    await waitFor(() => {
      expect(screen.getByText(cheersItem)).toBeInTheDocument();
    });

    // Danny DeVito link
    const dannyLink = screen.getByRole("link", { name: /Danny DeVito/i });
    expect(dannyLink).toBeInTheDocument();
    expect(dannyLink).toHaveAttribute("href","https://en.wikipedia.org/wiki/Danny_DeVito"
    );
  });

  it("renders links via <Trans> (Øl-matrice, Fiskeroulette, Poster, Discord)", async () => {
    renderFAQPage();

    // Øl-matrice & Fiskeroulette
    const beerLink = await screen.findByRole("link", { name: /Øl-matrice/i });
    expect(beerLink).toHaveAttribute("href",i18n.t("links.olmatrice", { ns: "faq" })
    );

    const fishLink = screen.getByRole("link", { name: /Fiskeroulette/i });
    expect(fishLink).toHaveAttribute("href",i18n.t("links.fisk", { ns: "faq" })
    );

    // Plakatarkiv & Discord
    const posterLink = screen.getByRole("link", { name: /Plakatarkiv/i });
    expect(posterLink).toHaveAttribute("href",i18n.t("links.poster", { ns: "faq" }));

    const discordLink = screen.getAllByRole("link", { name: /Discord/i })[0];
    expect(discordLink).toHaveAttribute("href",i18n.t("links.discord", { ns: "faq" })
    );
  });

  it("renders English content when language is switched to 'en'", async () => {
    await i18n.changeLanguage("en");
    renderFAQPage();

    // English headings:
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 2, name: /Committee/i })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { level: 2, name: /Time and place/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 2, name: /Rules/i })
    ).toBeInTheDocument();

    // Rules again, but now in English
    const firstRuleEn = i18n.t("sections.rules.general.0", { ns: "faq" });
    expect(screen.getByText(firstRuleEn)).toBeInTheDocument();
  });

  it("render image test with translated alt text and caption", async () => {
  renderFAQPage();

  const storyTitle = i18n.t("sections.story.title", { ns: "faq" });
  const captionText = i18n.t("sections.story.caption", { ns: "faq" });

  //check by alt text
  const img = await screen.findByAltText(storyTitle);
  expect(img).toBeInTheDocument();

  // Caption match the translation
  expect(screen.getByText(captionText)).toBeInTheDocument();
});

});
