import React from "react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import * as matchers from "@testing-library/jest-dom/matchers"; 
import { I18nextProvider } from "react-i18next";
import baseI18n from "../i18n";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import SoundSampleBrowser from "../components/SoundSamples/SoundSampleBrowser.jsx";
import {deleteSoundSample, getSoundSamples} from "../services/soundSampleService.jsx";

expect.extend(matchers);

vi.mock("../services/soundSampleService", () => ({
    deleteSoundSample: vi.fn(),
    getSoundSamples: vi.fn(),
}));

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
}));

describe("submit sound sample page Test", () => {
    let i18n;
    
    beforeEach(async () => {
        i18n = baseI18n.cloneInstance();
        await i18n.changeLanguage("da");
    });

    function renderBrowserWithData(data, username = "Bob") {
        getSoundSamples.mockResolvedValue(data);
        
        render( 
            <I18nextProvider i18n={i18n}> 
                <MemoryRouter initialEntries={[`/user/${username}`]}> 
                    <Routes> 
                        <Route 
                            path="/user/:username" 
                            element={<SoundSampleBrowser />} 
                        />
                    </Routes> 
                </MemoryRouter> 
            </I18nextProvider> 
        ); 
    }
    
    afterEach(() => {
        cleanup();
    });

    it("Test rendering of the page", async () =>{
        const dummyData = [
            { username: "testUser", soundSample: "A" },
            { username: "other", soundSample: "B" }
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

    it("Not show users 'load more' btn, if the user has <=3 Sound samples", async () => {
        // 1 Sound sample
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "other1", soundSample: "B" }
        ];
        renderBrowserWithData(dummyData);
        
        const btn = await screen.findByTestId("loadMoreUsersSS");

        await waitFor(() => {
            expect(btn).toHaveClass("hidden");
            expect(btn).not.toHaveClass("block");
        });
    });

    it("Not show users 'load more' btn, if the user has <=3 Sound samples", async () => {
        // 3 Sound sample
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "Bob", soundSample: "B" },
            { username: "Bob", soundSample: "C" }
        ];
        renderBrowserWithData(dummyData);
        
        const btn = await screen.findByTestId("loadMoreUsersSS");

        await waitFor(() => {
            expect(btn).toHaveClass("hidden");
            expect(btn).not.toHaveClass("block");
        });
    });

    it("Showing users 'Load more btn, if user has >3 sound samples'", async () => {
        // 4 Sound sample
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "Bob", soundSample: "B" },
            { username: "Bob", soundSample: "C" },
            { username: "Bob", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);

        const btn = await screen.findByTestId("loadMoreUsersSS");

        await waitFor(() => {
            expect(btn).toHaveClass("block");
            expect(btn).not.toHaveClass("hidden");
        });
    });

    it("Not show all's 'load more' btn, if number of sound samples <=4", async () => {
        // 2 Sound sample
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "other1", soundSample: "B" }
        ];
        renderBrowserWithData(dummyData);

        const btn = await screen.findByTestId("loadMoreAllSS");
        
        await waitFor(() => {
            expect(btn).toHaveClass("hidden");
            expect(btn).not.toHaveClass("block");
        });
    });

    it("Not show all's 'load more' btn, if number of sound samples <=4", async () => {
        // 4 Sound sample
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "Bob", soundSample: "B" },
            { username: "Bob", soundSample: "C" },
            { username: "other1", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);
        
        const btn = await screen.findByTestId("loadMoreAllSS");
        
        await waitFor(() => {
            expect(btn).toHaveClass("hidden");
            expect(btn).not.toHaveClass("block");
        });
    });

    it("Showing all's 'load more' btn, if number of sound samples >4", async () => {
        // 5 Sound sample
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "Bob", soundSample: "B" },
            { username: "Bob", soundSample: "C" },
            { username: "Bob", soundSample: "D" },
            { username: "other1", soundSample: "E" }
        ];
        renderBrowserWithData(dummyData);
        
        const btn = await screen.findByTestId("loadMoreAllSS");

        await waitFor(() => {
            expect(btn).toHaveClass("block");
            expect(btn).not.toHaveClass("hidden");
        });
    });

    it("Reverse users sound samples", async () => {
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "Bob", soundSample: "B" },
            { username: "other1", soundSample: "C" },
            { username: "Bob", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);

        // Wait for DOM
        await waitFor(() => {
            expect(screen.queryAllByTestId(/usersSS-/i).length).toBeGreaterThan(0);
            expect(screen.queryAllByTestId(/usersSS-/i).some(
                c => c.textContent.trim().includes(`${i18n.t("loading")} ${i18n.t("file")}...`
            ))).toBe(false);
        });

        // Before
        const cardsBefore = screen.queryAllByTestId(/usersSS-/i).map(c => c.textContent.trim());
        
        // Click reverse btn
        const reverseBtn = await screen.findByTestId("revUsersSS");
        fireEvent.click(reverseBtn);

        await waitFor(() => {
            const cardsAfter = screen.queryAllByTestId(/usersSS-/i).map(c => c.textContent.trim());
            expect(cardsAfter).toEqual(cardsBefore.reverse());
        });
    });

    it("Reverse all sound sample", async () => {
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "other2", soundSample: "B" },
            { username: "Bob", soundSample: "C" },
            { username: "other1", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);

        // Wait for DOM
        await waitFor(() => {
            expect(screen.queryAllByTestId(/allSS-/i).length).toBeGreaterThan(0);
            expect(screen.queryAllByTestId(/allSS-/i).some(
                c => c.textContent.trim().includes(`${i18n.t("loading")} ${i18n.t("file")}...`
            ))).toBe(false);
        });
        
        // Before
        const cardsBefore = screen.queryAllByTestId(/allSS-/i).map(c => c.textContent.trim());
        
        // Click reverse btn
        const reverseBtn = await screen.findByTestId("revAllSS");
        fireEvent.click(reverseBtn);

        await waitFor(() => {
            const cardsAfter = screen.queryAllByTestId(/allSS-/i).map(c => c.textContent.trim());
            expect(cardsAfter).toEqual(cardsBefore.reverse());
        });
    });

    it("User delete a sound sample", async () => {
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "Bob", soundSample: "B" }
        ];
        renderBrowserWithData(dummyData);

        // Make sure delete deltes from getSoundSamples
        deleteSoundSample.mockImplementation(async (ss) => {
            getSoundSamples.mockResolvedValue(dummyData.filter(s => s.soundSample !== ss));
            return "Deleted";
        });

        const deleteBtn = await screen.findByAltText("Delete sound sample: A");

        await waitFor(() => {
            // Before
            const cardsBefore = screen.queryAllByTestId(/usersSS-/i).map(c => c.textContent.trim());
            
            // Click on sound smaple "A" delete btn
            fireEvent.click(deleteBtn);

            const cardsAfter = screen.queryAllByTestId(/usersSS-/i).map(c => c.textContent.trim());
            const expected = cardsBefore.filter(c => c !== "A");
            expect(cardsAfter).toEqual(expected);
        });
    });

    it("Should not crash when reversing empty users sound samples", async () => {
        const dummyData = [];
        renderBrowserWithData(dummyData, "Bob");

        const reverseBtn = await screen.findByTestId("revUsersSS");
        
        expect(reverseBtn).toHaveClass("invisible");
        expect(reverseBtn).not.toHaveClass("visibel");
        // This should not throw an error
        expect(() => {
            fireEvent.click(reverseBtn);
        }).not.toThrow();
    });

    it("Should not crash when reversing empty all sound samples", async () => {
        const dummyData = [];
        renderBrowserWithData(dummyData);

        const reverseBtn = await screen.findByTestId("revAllSS");
        
        expect(reverseBtn).toHaveClass("invisible");
        expect(reverseBtn).not.toHaveClass("visibel");
        // This should not throw an error
        expect(() => {
            fireEvent.click(reverseBtn);
        }).not.toThrow();
    });

    it("Should handle null sound samples array", async () => {
        renderBrowserWithData(null);

        const reverseBtn = await screen.findByTestId("revUsersSS");

        expect(reverseBtn).toHaveClass("invisible");
        expect(reverseBtn).not.toHaveClass("visibel");
        // This should not throw an error
        expect(() => {
            fireEvent.click(reverseBtn);
        }).not.toThrow();
    });

    it("Filter Sound sample by searching on username", async () => {
        const dummyData = [
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "A" },
            { username: "other2", usersFullName: "Pringles Nielsen", soundSample: "B" },
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "C" },
            { username: "other1", usersFullName: "mr. Jacobsen", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);
        
        // Wait for DOM
        await waitFor(() => {
            expect(screen.queryAllByTestId(/allSS-/i).length).toBeGreaterThan(0);
            expect(screen.queryAllByTestId(/allSS-/i).some(
                c => c.textContent.trim().includes(`${i18n.t("loading")} ${i18n.t("file")}...`
            ))).toBe(false);
        });

        // Input username in textbox
        const input = await screen.findByPlaceholderText(`${i18n.t("search for")} ${i18n.t("user")}...`);
        fireEvent.change(input, { target: { value: "Bob" } });

        // Click search btn
        const searchBtn = await screen.findByTestId("search");
        fireEvent.click(searchBtn);

        await waitFor(() => {
            const cardsAfter = screen.queryAllByTestId(/allSS-/i).map(c => c.textContent.trim());
            const expected = dummyData.filter(d => d.usersFullName.includes("Bob")).map(d => `${d.usersFullName}${i18n.t("noFile")}${d.soundSample}`);
            expect(cardsAfter).toEqual(expected);
        });
    });

    it("Filter Sound sample by searching on nothing", async () => {
        const dummyData = [
            { username: "Bob", soundSample: "A" },
            { username: "other2", soundSample: "B" },
            { username: "Bob", soundSample: "C" },
            { username: "other1", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);
        
        // Wait for DOM
        await waitFor(() => {
            expect(screen.queryAllByTestId(/allSS-/i).length).toBeGreaterThan(0)
            expect(screen.queryAllByTestId(/allSS-/i).some(
                c => c.textContent.trim().includes(`${i18n.t("loading")} ${i18n.t("file")}...`
            ))).toBe(false);
        });

        // Before
        const cardsBefore = screen.queryAllByTestId(/allSS-/i).map(c => c.textContent.trim());
        
        // Input username in textbox
        const input = await screen.findByPlaceholderText(`${i18n.t("search for")} ${i18n.t("user")}...`);
        fireEvent.change(input, { target: { value: "" } });

        // Click search btn
        const searchBtn = await screen.findByTestId("search");
        fireEvent.click(searchBtn);

        await waitFor(() => {
            // Expect all sound sample to show 
            const cardsAfter = screen.queryAllByTestId(/allSS-/i).map(c => c.textContent.trim());
            expect(cardsAfter).toEqual(cardsBefore.reverse());
        });
    });
});
