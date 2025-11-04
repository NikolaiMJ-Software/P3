import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import * as matchers from "@testing-library/jest-dom/matchers"; 
import WheelOfFortunePage from "../pages/WheelOfFortunePage";

expect.extend(matchers);

//mock fetch
global.fetch = vi.fn();

//mock use navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, 
  };
});

// create canvas information in regards to the wheel
const make2dContext = () => {
  // minimal 2D ctx with all methods/properties used by the wheel
  const ctx = {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    clip: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    fillText: vi.fn(),
    measureText: (text) => ({ width: String(text).length * 8 }),
    // properties assigned in code:
    lineWidth: 0,
    strokeStyle: "",
    fillStyle: "",
    font: "",
    textAlign: "",
    textBaseline: "",
  };
  return ctx;
};

//create canvas for the wheel
const mockCanvas = () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation((type) => {
    if (type === "2d") return make2dContext();
    return null;
  });
  // JSDOM doesn't compute layout; give predictable rects
  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockImplementation(function () {
    const size = parseInt(this.style?.width || "516", 10) || 516;
    return { left: 0, top: 0, width: size, height: size, right: size, bottom: size, x: 0, y: 0, toJSON: () => {} };
  });
  // devicePixelRatio
  Object.defineProperty(window, "devicePixelRatio", { value: 1, configurable: true });
};

const mockRAFInstantFinish = () => {
  // Make spins end in a single frame by calling the callback with a "future" timestamp
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
    const handle = Math.floor(Math.random() * 1e6);
    // call with a timestamp sufficiently ahead of "start"
    cb(performance.now() + 4000);
    return handle;
  });
};

describe("Testing Wheel of Fortune", () =>{
    beforeEach(()=>{
        cleanup();
        fetch.mockReset();
        mockNavigate.mockReset();
        mockCanvas();
        mockRAFInstantFinish();
    });

    afterEach(() => {
    vi.restoreAllMocks();
    });

    it("Test rendering of the page", () =>{
        render(
            <MemoryRouter>
                <WheelOfFortunePage />
            </MemoryRouter>
        );

        //assert
        expect(screen.getByText("One entry per line")).toBeInTheDocument();
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveValue("Pirates\nThe Squad\nGruppe 6");
        expect(screen.getByRole("button", { name: /spin/i })).toBeEnabled();
    })

    it("Test if spin button is disabled with 0 entries and re enabled when adding entries", () => {
        //arrange
        render(
        <MemoryRouter>
            <WheelOfFortunePage />
        </MemoryRouter>
        );
    
        const textarea = screen.getByRole("textbox");
        const spinButton = screen.getByRole("button", { name: /spin/i });

    
        // clear all entries
        //act
        fireEvent.change(textarea, { target: { value: "" } });
        //assert
        expect(spinButton).toBeDisabled();

        // insert one entry
        //act
        fireEvent.change(textarea, { target: { value: "Cringe" } });
        //assert
        expect(spinButton).toBeEnabled();
    });


    it("removes the winning entry from the textarea when clicking Remove", () => {
        //arrange
        render(
        <MemoryRouter>
            <WheelOfFortunePage />
        </MemoryRouter>
        );

        const canvas = document.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        //Act
        // make the event land on pirates
        fireEvent.click(canvas, { clientX: rect.right - 5, clientY: cy });

        // Spin to select pirates
        fireEvent.click(screen.getByRole("button", { name: /spin/i }));
        expect(screen.getByText("Pirates")).toBeInTheDocument();

        // Remove pirates
        fireEvent.click(screen.getByRole("button", { name: /remove/i }));

        //Assert
        // Checking if Pirates is removed in the textarea and the rest of the values exist
        const textarea = screen.getByRole("textbox");
        expect(textarea).not.toHaveValue(expect.stringContaining("Pirates"));
        expect(textarea.value.trim()).toBe("The Squad\nGruppe 6");
    });

});
