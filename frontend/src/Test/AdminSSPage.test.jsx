import React from "react";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { I18nextProvider } from "react-i18next";
import baseI18n from "../i18n";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import AdminSSPage from "../pages/AdminSSPage.jsx";
import { deleteSoundSample, getSoundSamples } from "../services/soundSampleService.jsx";
import { isAdmin } from "../services/adminService.jsx";

expect.extend(matchers);

vi.mock("../services/soundSampleService", () => ({
    deleteSoundSample: vi.fn(),
    getSoundSamples: vi.fn(),
}));

vi.mock("../services/adminService", () => ({
    isAdmin: vi.fn(),
}));

// Mock MediaPlayer
vi.mock("../components/SoundSamples/MediaPlayer.jsx", () => ({
    default: ({ soundSample }) => (
        <div data-testid="media-player">
            Playing: {soundSample}
        </div>
    ),
}));

describe("admin sound sample page test", () => {
    let i18n;
    
    beforeEach(async () => {
        i18n = baseI18n.cloneInstance();
        await i18n.changeLanguage("da");
        isAdmin.mockResolvedValue(1);
    });

    function renderBrowserWithData(data, username = "admin") {
        getSoundSamples.mockResolvedValue(data);
        
        render( 
            <I18nextProvider i18n={i18n}> 
                <MemoryRouter initialEntries={[`/admin/${username}`]}> 
                    <Routes> 
                        <Route 
                            path="/admin/:username" 
                            element={<AdminSSPage />} 
                        />
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

    it("Test rendering of the page with sound samples", async () => {     
        const dummyData = [
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "A" }
        ];
        renderBrowserWithData(dummyData);
        
        await waitFor(() => {
            expect(screen.getByText(/Bob Larsen/i)).toBeInTheDocument();
        });
        
        const startTimerBtn = await screen.findByText("Start");
        const stopTimerBtn = await screen.findByText("Stop");
        const restartTimerBtn = await screen.findByText(i18n.t("restart"));
        const timerInput = await screen.findByLabelText("Timer (mm:ss)");
        const nextBtn = await screen.findByText(`${i18n.t("next")} →`);
        const prevBtn = await screen.findByText(`← ${i18n.t("prev")}`);

        expect(startTimerBtn).toBeInTheDocument();
        expect(stopTimerBtn).toBeInTheDocument();
        expect(restartTimerBtn).toBeInTheDocument();
        expect(timerInput).toBeInTheDocument();
        expect(nextBtn).toBeInTheDocument();
        expect(prevBtn).toBeInTheDocument();
    });

    it("Test timer", async () => {
        renderBrowserWithData([]);
        const startTimerBtn = await screen.findByText("Start");
        const stopTimerBtn = await screen.findByText("Stop");
        const restartTimerBtn = await screen.findByText(i18n.t("restart"));
        const timerInput = await screen.findByLabelText("Timer (mm:ss)");
    
        // Deafault 30 min
        expect(timerInput).toHaveValue('30:00');

        fireEvent.change(timerInput, { target: { value: '01:30' } });
        fireEvent.blur(timerInput); 
        expect(timerInput).toHaveValue('01:30');

        fireEvent.click(startTimerBtn);
        
        // Wait 1 sec
        await new Promise(resolve => setTimeout(resolve, 1900));

        fireEvent.click(stopTimerBtn);
        await waitFor(() => {
            expect(timerInput).toHaveValue('01:29');
        }, { timeout: 3000 });

        fireEvent.click(restartTimerBtn);
        expect(timerInput).toHaveValue('01:30');
    });

    it("Test rendering with no sound samples", async () => {
        renderBrowserWithData([]);

        await waitFor(() => {
            expect(screen.getByText(/No Sound Samples Available/i)).toBeInTheDocument();
        });
    });

    it("'Next' and 'Prev' btn shown next/prev SS", async () => {
        const dummyData = [
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "A" },
            { username: "other2", usersFullName: "Pringles Nielsen", soundSample: "B" },
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "C" },
            { username: "other1", usersFullName: "mr. Jacobsen", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);
        const nextBtn = await screen.findByText(`${i18n.t("next")} →`);
        const prevBtn = await screen.findByText(`← ${i18n.t("prev")}`);
        
        await waitFor(() => {
            expect(screen.getByText(`Playing: ${dummyData[0].soundSample}`)).toBeInTheDocument();
        });

        fireEvent.click(nextBtn);

        await waitFor(() => {
            expect(screen.getByText(`Playing: ${dummyData[1].soundSample}`)).toBeInTheDocument();
        });

        fireEvent.click(prevBtn);

        await waitFor(() => {
            expect(screen.getByText(`Playing: ${dummyData[0].soundSample}`)).toBeInTheDocument();
        });
    });

    it("Delete the third watch in buffer", async () => {
        const dummyData = [
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "A" },
            { username: "other2", usersFullName: "Pringles Nielsen", soundSample: "B" },
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "C" },
            { username: "other1", usersFullName: "mr. Jacobsen", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);
        const nextBtn = await screen.findByText(`${i18n.t("next")} →`);
        const prevBtn = await screen.findByText(`← ${i18n.t("prev")}`);
        
        await waitFor(() => {
            expect(screen.getByText(`Playing: ${dummyData[0].soundSample}`)).toBeInTheDocument();
        });
        
        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);

        await waitFor(() => {
            expect(nextBtn).toBeDisabled();
            expect(screen.getByText(`Playing: ${dummyData[3].soundSample}`)).toBeInTheDocument();
        });

        fireEvent.click(prevBtn);
        
        await waitFor(() => {
            expect(screen.getByText(`Playing: ${dummyData[2].soundSample}`)).toBeInTheDocument();
        });

        fireEvent.click(prevBtn);

        await waitFor(() => {
            expect(prevBtn).toBeDisabled();
            expect(screen.getByText(`Playing: ${dummyData[1].soundSample}`)).toBeInTheDocument();
        });
    });

    it("Delete buffer", async () => {
        const dummyData = [
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "A" },
            { username: "other2", usersFullName: "Pringles Nielsen", soundSample: "B" },
            { username: "Bob", usersFullName: "Bob Larsen", soundSample: "C" },
            { username: "other1", usersFullName: "mr. Jacobsen", soundSample: "D" }
        ];
        renderBrowserWithData(dummyData);
        const nextBtn = await screen.findByText(`${i18n.t("next")} →`);
        const prevBtn = await screen.findByText(`← ${i18n.t("prev")}`);
        const stopTimerBtn = await screen.findByText("Stop");

        await waitFor(() => {
            expect(screen.getByText(`Playing: ${dummyData[0].soundSample}`)).toBeInTheDocument();
        });
        
        fireEvent.click(nextBtn);
        fireEvent.click(nextBtn);

        await waitFor(() => {
            expect(screen.getByText(`Playing: ${dummyData[2].soundSample}`)).toBeInTheDocument();
        });

        fireEvent.click(stopTimerBtn);

        await waitFor(() => {
            expect(prevBtn).toBeDisabled();
            expect(deleteSoundSample).toHaveBeenCalled();
        });
    });
});