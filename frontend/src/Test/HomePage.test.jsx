import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import HomePage from "../pages/HomePage";
import * as matchers from "@testing-library/jest-dom/matchers"; 
expect.extend(matchers);

// --- ARRANGE helpers ---
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate, 
  };
});

global.fetch = vi.fn();

describe("Testing of HomePage", ()=>{
    beforeEach(() => {
        sessionStorage.clear();
        fetch.mockReset();
        mockNavigate.mockReset();
        cleanup();
      });

    it("renders the form elements correctly", () => {
        // ARRANGE
        render(
        <MemoryRouter>
            <HomePage />
        </MemoryRouter>
        );
    
        // ASSERT
                expect(screen.getByRole("button", { name: /Themes/i })).toBeEnabled();
    });


});