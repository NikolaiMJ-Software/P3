import React from "react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import * as matchers from "@testing-library/jest-dom/matchers"; 
import { I18nextProvider } from "react-i18next";
import baseI18n from "../i18n";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import AdminSSPage from "../pages/AdminSSPage.jsx";
import {deleteSoundSample, getSoundSamples} from "../services/soundSampleService.jsx";

expect.extend(matchers);

vi.mock("../services/soundSampleService", () => ({
    deleteSoundSample: vi.fn(),
    getSoundSamples: vi.fn(),
}));
/*
vi.mock("../components/SoundSamples/SoundSamplesCard.jsx", () => ({
    default: ({ soundSamples, witch }) => (
        <>
            {soundSamples.map((ss) => (
                <div data-testid={`${witch === "users" ? "usersSS" : "allSS"}-${ss.soundSample}`}>
                    {ss.soundSample}
                </div>
            ))}
        </>
    ),
}));*/

describe("admin sound sample page test", () => {
    let i18n;
    
    beforeEach(async () => {
        i18n = baseI18n.cloneInstance();
        await i18n.changeLanguage("da");
    });

    function renderBrowserWithData(data) {
        getSoundSamples.mockResolvedValue(data);
        
        render( 
            <I18nextProvider i18n={i18n}>
                <MemoryRouter>
                    <AdminSSPage/>
                </MemoryRouter>
            </I18nextProvider> 
        ); 
    }
    
    afterEach(() => {
        cleanup();
    });

    it("Test rendering of the page", async () =>{
        const dummyData = [
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "A" },
            { username: "other2", usersFullName: "Pringles Nielsen", soundSample: "B" },
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "C" },
            { username: "other1", usersFullName: "mr. Jacobsen", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);
        
        const filterBtnUsers = await screen.findByTestId("revUsersSS");
        const moreBtnUsers = await screen.findByTestId("loadMoreUsersSS");

        const filterBtnAll = await screen.findByTestId("revAllSS");
        const moreBtnAll = await screen.findByTestId("loadMoreAllSS");

        const searchField = await screen.findByPlaceholderText(i18n.t("search for") + " " + i18n.t("user") + "...");
        const searchBtn = await screen.findByTestId("search");

        await waitFor(() => {
            expect(filterBtnUsers).toBeInTheDocument();
            expect(filterBtnUsers).toHaveTextContent(i18n.t("latest"));
            expect(moreBtnUsers).toBeInTheDocument();
            expect(moreBtnUsers).toHaveTextContent(i18n.t("loadMore"));

            expect(filterBtnAll).toBeInTheDocument();
            expect(filterBtnAll).toHaveTextContent(i18n.t("oldest"));
            expect(moreBtnAll).toBeInTheDocument();
            expect(moreBtnAll).toHaveTextContent(i18n.t("loadMore"));

            expect(searchField).toBeInTheDocument();
            expect(searchBtn).toBeInTheDocument();
        });
    });
});