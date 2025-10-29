import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import LoginPage from "../pages/LoginPage";
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

describe("testing of LoginPage", () => {
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
        <LoginPage />
      </MemoryRouter>
    );

    // ASSERT
    expect(screen.getByText("Insert F-Klub Username:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("stores username and navigates on success", async () => {
    // ARRANGE
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "",
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Username");
    const button = screen.getByText("Confirm");

    // ACT
    fireEvent.change(input, { target: { value: "tester" } });
    fireEvent.click(button);

    // ASSERT
    await waitFor(() => {
      expect(sessionStorage.getItem("username")).toBe("tester");
      expect(mockNavigate).toHaveBeenCalledWith("/tester");
    });
  });

  it("displays error on failed login", async () => {
    // ARRANGE
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "Invalid username",
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Username");
    const button = screen.getByText("Confirm");

    // ACT
    fireEvent.change(input, { target: { value: "wrong" } });
    fireEvent.click(button);

    // ASSERT
    await waitFor(() => {
      expect(screen.getByText("Invalid username")).toBeInTheDocument();
    });
  });
});
