import React from "react";
import { MemoryRouter } from "react-router-dom";
import * as matchers from "@testing-library/jest-dom/matchers"; 
import { I18nextProvider } from "react-i18next";
import baseI18n from "../i18n";
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import SubmitSSPage from "../components/SubmitSSPage";

expect.extend(matchers);

//mock use navigate
vi.mock("../services/soundSampleService", () => ({
  addSoundSample: vi.fn().mockResolvedValue("uploadMsg"),
  deleteSoundSample: vi.fn(),
  getSoundSamples: vi.fn(),
  getSoundsampleFile: vi.fn(),
}));

vi.mock("../services/adminService.jsx", () => ({
  getIdByUser: vi.fn().mockResolvedValue("12"),
}));

describe("submit sound sample page Test", () => {
    let i18n;

    beforeEach(async () => {
        i18n = baseI18n.cloneInstance();
        await i18n.changeLanguage("da");
        render(
          <I18nextProvider i18n={i18n}>
            <MemoryRouter>
                <SubmitSSPage />
            </MemoryRouter>
          </I18nextProvider>
        );
    });
    
    afterEach(() => {
        cleanup();
    });

    it("Test rendering of the page", async () =>{
        const fileLabel = await screen.findByText(i18n.t("browse"));
        const submitButton = await screen.findByRole("button", { name: i18n.t("submit") });
        const textbox = await screen.findByPlaceholderText(i18n.t("insertLink"));

        expect(fileLabel).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(textbox).toBeInTheDocument();
    });

    it("Upload a link", async () => {
        const input = await screen.findByPlaceholderText(i18n.t("insertLink"));
        const submitBtn = await screen.findByRole("button", { name: i18n.t("submit") });
        
        expect(screen.queryByText("uploadMsg")).not.toBeInTheDocument();
        
        fireEvent.change(input, { target: { value: "https://www.example.com/test.mp3" } });
        fireEvent.click(submitBtn);
        
        expect(await screen.findByText("uploadMsg")).toBeInTheDocument();
    });

    it("Upload a file", async () => {
        const filebtn = await screen.findByText("Vælge fil");
        const submitBtn = screen.getByRole("button", { name: "Indsend" });
        const file = new File(["dummy data"], "sound.mp3", { type: "audio/mpeg" });

        expect(screen.queryByText("uploadMsg")).not.toBeInTheDocument();
        
        fireEvent.change(filebtn, { target: { files: [file] } });
        fireEvent.click(submitBtn);

        expect(await screen.findByText("uploadMsg")).toBeInTheDocument();
    });

    it("Upload a link and a file", async () => {
        const submitBtn = await screen.findByRole("button", { name: i18n.t("submit") });
        const input = await screen.findByPlaceholderText(i18n.t("insertLink"));
        const filebtn = await screen.findByText("Vælge fil");
        const file = new File(["dummy data"], "sound.mp3", { type: "audio/mpeg" });
        
        expect(screen.queryByText("uploadMsg")).not.toBeInTheDocument();
        
        fireEvent.change(input, { target: { value: "https://www.example.com/test.mp3" } });
        fireEvent.change(filebtn, { target: { files: [file] } });
        fireEvent.click(submitBtn);

        expect(await screen.findByText("uploadMsg")).toBeInTheDocument();
    });

    it("Upload nothing", async () => {
        const submitBtn = await screen.findByRole("button", { name: i18n.t("submit") });

        expect(screen.queryByText("uploadMsg")).not.toBeInTheDocument();

        fireEvent.click(submitBtn);
        
        expect(await screen.findByText("uploadMsg")).toBeInTheDocument();
    });
});
