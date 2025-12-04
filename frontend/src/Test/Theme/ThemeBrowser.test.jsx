import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import baseI18n from "../../i18n.js";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

// Component under test
import ThemeBrowser from "../../components/Theme/ThemeBrowser.jsx";

// Mock services
vi.mock("../../services/themeService.jsx", () => ({
    getThemes: vi.fn(),
    getNewThemes: vi.fn(),
    getOldThemes: vi.fn(),
    addTheme: vi.fn(),
    deleteTheme: vi.fn(),
}));

vi.mock("../../services/eventService.jsx", () => ({
    getEvents: vi.fn(),
    getFutureEvents: vi.fn(),
}));

// Mock child components
vi.mock("../../components/Theme/Themebrowser/ThemeToggleButtons.jsx", () => ({
    default: ({ onSelect }) => (
        <button data-testid="toggle" onClick={() => onSelect("new")}>Toggle</button>
    ),
}));

vi.mock("../../components/Theme/Themebrowser/ThemeCollection.jsx", () => ({
    __esModule: true,
    default: ({ themes, onEdit, onDelete }) => (
        <div data-testid="theme-collection">
            {themes?.map((t) => (
                <div key={t.themeId}>
                    <span>{t.name}</span>
                    <button data-testid={`edit-${t.themeId}`} onClick={() => onEdit?.(t)}>Edit</button>
                    <button data-testid={`delete-${t.themeId}`} onClick={() => onDelete?.(t.themeId)}>Delete</button>
                </div>
            ))}
        </div>
    ),
    UpcomingThemeCollection: ({ events }) => (
        <div data-testid="upcoming">{events?.length ?? 0} events</div>
    ),
}));

vi.mock("../../components/Theme/ThemeCreationPopup.jsx", () => ({
    default: () => <div data-testid="popup">POPUP</div>,
}));

vi.mock("../../components/Theme/EditTheme.jsx", () => ({
    default: ({ theme, onClose }) => (
        <div data-testid="edit-screen">
            Editing: {theme?.name}
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

// Import mocked functions
import { getThemes, deleteTheme } from "../../services/themeService.jsx";
import { getFutureEvents } from "../../services/eventService.jsx";

// Mock data
const MOCK_THEMES = [
    { themeId: 1, name: "Theme A" },
    { themeId: 2, name: "Theme B" },
];

const MOCK_EVENTS = [
    { eventId: 10, themeId: 1, eventDate: "2030-01-01" },
];

// Render helper
async function renderBrowser() {
    const i18n = baseI18n.cloneInstance();
    await i18n.changeLanguage("da");
    i18n.addResource("da", "translation", "youSure", "Are you sure?");

    return render(
        <I18nextProvider i18n={i18n}>
            <MemoryRouter>
                <ThemeBrowser />
            </MemoryRouter>
        </I18nextProvider>
    );
}

// Setup mocks before tests
beforeEach(() => {
    getThemes.mockImplementation((type) => {
        if (["all", "your", "new", "old"].includes(type)) return Promise.resolve(MOCK_THEMES);
        return Promise.resolve([]);
    });

    getFutureEvents.mockResolvedValue(MOCK_EVENTS);
});

// Cleanup after tests
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe("ThemeBrowser Tests (AAA style)", () => {

    // Ensure themes load and render correctly
    it("loads and displays themes", async () => {
        // Arrange
        await renderBrowser();

        // Act
        const themeA = await screen.findByText("Theme A");
        const themeB = screen.getByText("Theme B");

        // Assert
        expect(themeA).toBeInTheDocument();
        expect(themeB).toBeInTheDocument();
    });

    // Ensure upcoming events count updates after async fetch
    it("shows upcoming events", async () => {
        // Arrange
        await renderBrowser();

        // Act
        const upcoming = await screen.findByTestId("upcoming");

        // Assert
        await waitFor(() => {
            expect(upcoming).toHaveTextContent("1 events");
        });
    });

    // Ensure clicking toggle loads "new" themes
    it("toggle button loads 'new' themes", async () => {
        // Arrange
        await renderBrowser();
        await screen.findByText("Theme A");

        // Act
        fireEvent.click(screen.getByTestId("toggle"));

        // Assert
        expect(getThemes).toHaveBeenCalledWith("new");
    });

    // Ensure theme deletion occurs when user confirms
    it("deletes a theme when confirmed", async () => {
        // Arrange
        vi.spyOn(window, "confirm").mockReturnValue(true);
        deleteTheme.mockResolvedValue("ok");
        await renderBrowser();
        await screen.findByText("Theme A");

        // Act
        fireEvent.click(screen.getByTestId("delete-1"));

        // Assert
        expect(deleteTheme).toHaveBeenCalledWith(1);
    });

    // Ensure no deletion occurs if user cancels confirm dialog
    it("does NOT delete when user cancels", async () => {
        // Arrange
        vi.spyOn(window, "confirm").mockReturnValue(false);
        await renderBrowser();
        await screen.findByText("Theme A");

        // Act
        fireEvent.click(screen.getByTestId("delete-1"));

        // Assert
        expect(deleteTheme).not.toHaveBeenCalled();
    });

    // Ensure clicking edit enters edit mode
    it("switches to edit mode", async () => {
        // Arrange
        await renderBrowser();

        // Act
        fireEvent.click(await screen.findByTestId("edit-1"));

        // Assert
        expect(await screen.findByTestId("edit-screen")).toBeInTheDocument();
        expect(screen.getByText("Editing: Theme A")).toBeInTheDocument();
    });

    // Ensure closing edit mode returns to browse mode
    it("closes edit mode", async () => {
        // Arrange
        await renderBrowser();
        fireEvent.click(await screen.findByTestId("edit-1"));

        // Act
        fireEvent.click(screen.getByText("Close"));

        // Assert
        await waitFor(() =>
            expect(screen.queryByTestId("edit-screen")).not.toBeInTheDocument()
        );
    });
});