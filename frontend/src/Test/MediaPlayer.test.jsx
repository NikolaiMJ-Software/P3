import React from "react";
import * as matchers from '@testing-library/jest-dom/matchers';
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import baseI18n from "../i18n";
import MediaPlayer from "../components/SoundSamples/MediaPlayer.jsx";
import { getSoundsampleFile } from "../services/soundSampleService.jsx";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

expect.extend(matchers);

vi.mock("../services/soundSampleService.jsx", () => ({
    getSoundsampleFile: vi.fn(),
}));

// Mock window.twttr globalt
const mockTwttr = {
    widgets: {
        createTweet: vi.fn(),
    },
};

describe("Media player tests - simplified", () => {
    let i18n;
    
    beforeEach(async () => {
        i18n = baseI18n.cloneInstance();
        await i18n.changeLanguage("da");
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    function renderMediaPlayer(SS) {
        return render(
            <I18nextProvider i18n={i18n}>
                <MediaPlayer {...SS} />
            </I18nextProvider>
        );
    }

    it("should return null when sound sample is null", () => {
        const { container } = renderMediaPlayer({ soundSample: null });
        expect(container.firstChild).toBeNull();
    });

    it("should render YouTube embed for YouTube links", async () => {
        const link = "https://www.youtube.com/watch?v=lrb7ZLmvzQQ";
        renderMediaPlayer({ soundSample: link });
        
        await waitFor(() => {
            const iframe = screen.getByTitle("YouTube sample");
            expect(iframe.getAttribute('src')).toEqual("https://www.youtube.com/embed/lrb7ZLmvzQQ");
        });
    });

    it("should render YouTube Shorts embed", async () => {
        const link = "https://youtube.com/shorts/lMzrGL0taNg?si=yUSiYS0OzAnO99KK";
        renderMediaPlayer({ soundSample: link });
        
        await waitFor(() => {
            const iframe = screen.getByTitle("YouTube sample");
            expect(iframe.getAttribute('src')).toEqual("https://www.youtube.com/embed/lMzrGL0taNg?si=yUSiYS0OzAnO99KK");
        });
    });

    it("should render youtu.be short links", async () => {
        const link = "https://youtu.be/abcd";
        
        renderMediaPlayer({ soundSample: link });
        
        await waitFor(() => {
            const iframe = screen.getByTitle("YouTube sample");
            expect(iframe.getAttribute('src')).toEqual("https://www.youtube.com/embed/abcd");
        });
    });

    it("should show error for invalid YouTube links", async () => {
        const link = "https://www.youtube.com/";
        renderMediaPlayer({ soundSample: link });
        
        await waitFor(() => {
            expect(screen.getByText(`YouTube ${i18n.t("link not supported")}`)).toBeInTheDocument();
        });
    });

    it("should render Instagram embed", async () => {
        const link = "https://www.instagram.com/reel/DQ_YcZijnZV/?igsh=MWN2MW9vcjg3M3hnbw==";
        renderMediaPlayer({ soundSample: link });
        
        await waitFor(() => {
            const iframe = screen.getByTitle("Instagram sample");
            expect(iframe).toHaveAttribute("src", "https://www.instagram.com/reel/DQ_YcZijnZV/embed");
        });
    });

    it("should render Facebook embed", async () => {
        const link = "https://www.facebook.com/reel/804228681997738";
        renderMediaPlayer({ soundSample: link });
        
        const url = new URL(link);
        const encoded = encodeURIComponent(url.toString());

        await waitFor(() => {
            const iframe = screen.getByTitle("Facebook sample");
            expect(iframe).toHaveAttribute("src", `https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=0&width=560&height=400`);
        });
    });

    it("should render X/Twitter embed", async () => {
        const link = "https://x.com/uni_to_inu_/status/1992522825912258610?t=6dFvxGEgwopr3VWhH4CVlg&s=19";
        renderMediaPlayer({ soundSample: link });
        
        await waitFor(() => {
            const container = document.querySelector('div[style*="max-width"]');            
            expect(container).toBeInTheDocument();
            expect(container).toHaveAttribute('data-media-max-width', '400');
            expect(container.style.maxWidth).toBe('100%');
        });
    });

    it("should render TikTok embed", async () => {
        const link = "https://www.tiktok.com/@ns.montage.auto.m/video/7577788549035068694?is_from_webapp=1&sender_device=pc";
        renderMediaPlayer({ soundSample: link });
        
        await waitFor(() => {
            const blockquote = screen.getByText(`${i18n.t("loading")} TikTok...`);
            expect(blockquote).toBeInTheDocument();
        });
    });

    it("should show error for unsupported links", async () => {
        const link = "https://not-a-supotede-link.com";
        renderMediaPlayer({ soundSample: link });
        
        await waitFor(() => {
            expect(screen.getByText(`${i18n.t("Link")} ${i18n.t("not found")}: ${link}`)).toBeInTheDocument();
        });
    });

    it("should reder load and render video files (e.g. mp4)", async () => {
        const fileName = "video.mp4";
        getSoundsampleFile.mockResolvedValue(fileName);
        renderMediaPlayer({ soundSample: fileName });

        await waitFor(() => {
            const video = screen.getByRole("generic").querySelector("video");
            expect(video).toBeInTheDocument();
            expect(video).toHaveAttribute("src", fileName);
        });
    });

    it("should load and render audio files (e.g. mp3)", async () => {
        const fileName = "audio.mp3";
        getSoundsampleFile.mockResolvedValue(fileName);
        renderMediaPlayer({ soundSample: fileName });
        
        await waitFor(() => {
            const audio = screen.getByRole("generic").querySelector("audio");
            expect(audio).toBeInTheDocument();
            expect(audio).toHaveAttribute("src", fileName);
        });
    });

    it("should show error when file fails to load", async () => {
        const fileName = "missing.mp3";
        getSoundsampleFile.mockRejectedValue(new Error("File not found"));
        renderMediaPlayer({ soundSample: fileName });
        
        await waitFor(() => {
            expect(screen.getByText(`${i18n.t("noFile")}${fileName}`)).toBeInTheDocument();
        });
    });

    it("should show unsupported file type message (from e.g. pdf)", async () => {
        const fileName = "document.pdf";
        getSoundsampleFile.mockResolvedValue(fileName);
        renderMediaPlayer({ soundSample: fileName });
        
        await waitFor(() => {
            expect(screen.getByText(`${i18n.t("supportFile")}`)).toBeInTheDocument();
        });
    });
});