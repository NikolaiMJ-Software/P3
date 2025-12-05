import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
expect.extend(matchers);

// Component under test
import EditTheme from "../../components/Theme/EditTheme.jsx";

// Mock translation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

// Mock Movie Services
vi.mock("../../services/movieService.jsx", () => ({
    getMoviesByTconsts: vi.fn(),
    getMovieCount: vi.fn(),
    searchMovies: vi.fn(),
    getMoviePoster: vi.fn(),
}));

// Mock Theme Service
vi.mock("../../services/themeService.jsx", () => ({
    updateTheme: vi.fn(),
}));

// Mock child: ThemeMovieSearcher
vi.mock("../../components/Theme/ThemeMovieSearcher.jsx", () => ({
    default: ({
        foundMovies,
        handleAddMovies,
        movieCount,
        setSearchQuery,
        setPageCount,
    }) => (
        <div data-testid="movie-searcher">
            <div data-testid="movie-count-display">{movieCount}</div>

            <button data-testid="search-normal" onClick={() => setSearchQuery("star wars")}>
                Search Normal
            </button>

            <button data-testid="search-tconst" onClick={() => setSearchQuery("https://imdb.com/title/tt1234567")}>
                Search Tconst
            </button>

            <button data-testid="go-page-2" onClick={() => setPageCount(2)}>
                Page 2
            </button>

            <button
                data-testid="add-movie"
                onClick={() => handleAddMovies({ tConst: "tt0000001", title: "Movie 1", moviePosterURL: null })}
            >
                Add Movie
            </button>
        </div>
    ),
}));

// Mock child: ThemeCreator
vi.mock("../../components/Theme/ThemeCreator.jsx", () => ({
    default: ({ movies = [], handleRemoveMovie, setTitle }) => (
        <div data-testid="theme-creator">
            <div data-testid="movie-count">{movies.length}</div>

            <button data-testid="remove-movie" onClick={() => handleRemoveMovie("tt0000001")}>
                Remove Movie
            </button>

            <button data-testid="set-title" onClick={() => setTitle("Updated Title")}>
                Set Title
            </button>
        </div>
    ),
}));

// Import mocked functions
import {
    getMoviesByTconsts,
    getMovieCount,
    searchMovies,
    getMoviePoster,
} from "../../services/movieService.jsx";

import { updateTheme } from "../../services/themeService.jsx";

const MOCK_THEME = {
    themeId: 1,
    name: "Original Theme",
    drinkingRules: ["Rule A"],
    tConsts: ["tt1111111"],
};

beforeEach(() => {
    vi.clearAllMocks();

    getMoviesByTconsts.mockResolvedValue([
        { title: "Initial Movie", moviePosterURL: null },
    ]);

    getMovieCount.mockResolvedValue(12);
    searchMovies.mockResolvedValue([
        { tConst: "ttX", title: "Some Movie", moviePosterURL: null },
    ]);

    getMoviePoster.mockResolvedValue("http://poster-url");
});

afterEach(() => cleanup());

// Ensure it loads initial movie data
it("loads initial movies via getMoviesByTconsts", async () => {
    // Arrange
    render(<EditTheme theme={{ ...MOCK_THEME, name: "" }} onClose={vi.fn()} />);

    // Act
    await waitFor(() => {
        expect(getMoviesByTconsts).toHaveBeenCalledWith(MOCK_THEME.tConsts);
    });

    // Assert
    expect(screen.getByTestId("movie-count")).toHaveTextContent("1");
});

// Ensure normal search is triggered
it("performs a normal search", async () => {
    // Arrange
    render(<EditTheme theme={MOCK_THEME} onClose={vi.fn()} />);

    // Act
    fireEvent.click(screen.getByTestId("search-normal"));

    // Assert
    await waitFor(() => {
        expect(getMovieCount).toHaveBeenCalledWith("star wars");
        expect(searchMovies).toHaveBeenCalled();
    });
});

// Ensure tconst search is triggered
it("performs a tconst direct search", async () => {
    // Arrange
    render(<EditTheme theme={MOCK_THEME} onClose={vi.fn()} />);

    // Act
    fireEvent.click(screen.getByTestId("search-tconst"));

    // Assert
    await waitFor(() => {
        expect(searchMovies).toHaveBeenCalled();
    });

    const tconstCall = searchMovies.mock.calls.some(
        (args) => args[0] === "tt1234567" && args[1] === 1 && args[2] === 1
    );

    expect(tconstCall).toBe(true);
});

// Ensure page switching works
it("loads page 2 when switching pages", async () => {
    // Arrange
    render(<EditTheme theme={MOCK_THEME} onClose={vi.fn()} />);
    fireEvent.click(screen.getByTestId("search-normal"));
    await waitFor(() => expect(getMovieCount).toHaveBeenCalled());

    // Act
    fireEvent.click(screen.getByTestId("go-page-2"));

    // Assert
    await waitFor(() => {
        const hasPage2Call = searchMovies.mock.calls.some(
            (args) => args[1] === 2
        );
        expect(hasPage2Call).toBe(true);
    });
});

// Ensure adding/removing movies updates UI
it("adds and removes movies", async () => {
    // Arrange
    render(<EditTheme theme={MOCK_THEME} onClose={vi.fn()} />);
    await waitFor(() =>
        expect(screen.getByTestId("movie-count")).toHaveTextContent("1")
    );

    // Act
    fireEvent.click(screen.getByTestId("add-movie"));
    fireEvent.click(screen.getByTestId("remove-movie"));

    // Assert
    await waitFor(() =>
        expect(screen.getByTestId("movie-count")).toHaveTextContent("1")
    );
});

// Validate: missing title
it("shows alert when title is missing", async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    getMoviesByTconsts.mockReset();
    getMoviesByTconsts.mockResolvedValueOnce([{ title: "Movie", moviePosterURL: null }]);
    render(<EditTheme theme={{ ...MOCK_THEME, name: "" }} onClose={vi.fn()} />);
    await waitFor(() =>
        expect(screen.getByTestId("movie-count")).toHaveTextContent("1"),
        { timeout: 2000 }
    );
    await Promise.resolve();
    await Promise.resolve();

    // Act
    fireEvent.click(screen.getByText("update"));

    // Assert
    expect(alertSpy).toHaveBeenCalledWith("Please enter a theme title");
});

// Validate: missing movies
it("shows alert when no movies exist", async () => {
    // Arrange
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    getMoviesByTconsts.mockResolvedValueOnce([]);
    render(<EditTheme theme={{ ...MOCK_THEME, tConsts: [] }} onClose={vi.fn()} />);

    // Act
    fireEvent.click(screen.getByText("update"));

    // Assert
    expect(alertSpy).toHaveBeenCalledWith("Please add at least one movie");
});

// Successful update
it("updates theme successfully", async () => {
    // Arrange
    const onClose = vi.fn();
    updateTheme.mockResolvedValue("ok");
    getMoviesByTconsts.mockReset();
    getMoviesByTconsts.mockResolvedValueOnce([{ title: "Movie", moviePosterURL: null }]);

    render(<EditTheme theme={MOCK_THEME} onClose={onClose} />);

    await waitFor(() =>
        expect(screen.getByTestId("movie-count")).toHaveTextContent("1")
    );

    // Act
    fireEvent.click(screen.getByTestId("set-title"));
    fireEvent.click(screen.getByText("update"));

    // Assert
    await waitFor(() => expect(updateTheme).toHaveBeenCalled());
    const [themeId, newTitle] = updateTheme.mock.calls[0];
    expect(themeId).toBe(1);
    expect(newTitle).toBe("Updated Title");
    expect(onClose).toHaveBeenCalled();
});
