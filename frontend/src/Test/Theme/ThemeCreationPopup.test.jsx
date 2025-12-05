import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// Component under test
import ThemeCreationPopup from "../../components/Theme/ThemeCreationPopup.jsx";

// Mock i18n hook so we don’t need the whole provider
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key, 
    }),
}));

// Mock movie services
vi.mock("../../services/movieService.jsx", () => ({
    getMovieCount: vi.fn(),
    getMoviePoster: vi.fn(),
    searchMovies: vi.fn(),
}));

// Mock theme services
vi.mock("../../services/themeService.jsx", () => ({
    addTheme: vi.fn(),
    getThemes: vi.fn(),
}));

// Mock child components (we only care about ThemeCreationPopup logic)
vi.mock("../../components/Theme/ThemeMovieSearcher.jsx", () => ({
    default: ({
        foundMovies,
        handleAddMovies,
        movieCount,
        pageCount,
        setPageCount,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortDirection,
        setSortDirection,
        movieFilter,
        setMovieFilter,
        seriesFilter,
        setSeriesFilter,
        shortsFilter,
        setShortsFilter,
        hideUnrated,
        setHideUnrated,
    }) => (
        <div data-testid="movie-searcher">
            <div data-testid="movie-count-display">Movies found: {movieCount}</div>
            {/* Trigger a normal text search */}
            <button data-testid="trigger-search" onClick={() => setSearchQuery("star wars")}>
                Trigger Search
            </button>

            {/* Trigger a tconst/IMDb link search */}
            <button data-testid="trigger-tconst-search" onClick={() =>
                    setSearchQuery("https://www.imdb.com/title/tt1234567/")}>
                Trigger Tconst Search
            </button>

            {/* Trigger page change to page 2 */}
            <button data-testid="go-to-page-2" onClick={() => setPageCount(2)}>
                Go To Page 2
            </button>

            {/* Add a movie into the theme (uses handleAddMovies from parent) */}
            <button data-testid="add-movie-to-theme" onClick={() =>
                    handleAddMovies({tConst: "tt0000001",title: "Test Movie",moviePosterURL: null,})}>
                Add Movie To Theme
            </button>
        </div>
    ),
}));

// We use this mock to inspect how many movies are in the theme
vi.mock("../../components/Theme/ThemeCreator.jsx", () => ({
    default: ({ movies, handleRemoveMovie, setTitle, rules, setRules, handleSubmit }) => (
        <div data-testid="theme-creator">
            <div data-testid="current-movie-count">Movies in theme: {movies.length}</div>

            {/* Set a valid title for submit tests */}
            <button data-testid="set-title" onClick={() => setTitle("My Awesome Theme")}>
                Set Title
            </button>

            {/* Remove a known movie by tConst */}
            <button data-testid="remove-movie" onClick={() => handleRemoveMovie("tt0000001")}>
                Remove Movie tt0000001
            </button>
        </div>
    ),
}));

// Import mocked functions 
import {
    getMovieCount,
    getMoviePoster,
    searchMovies,
} from "../../services/movieService.jsx";
import { addTheme } from "../../services/themeService.jsx";

// Common mock data
const MOCK_MOVIES_PAGE = [
    { tConst: "tt0000001", title: "Test Movie 1", moviePosterURL: null },
    { tConst: "tt0000002", title: "Test Movie 2", moviePosterURL: "http://poster2" },
];

const MOVIE_LIMIT = 6;

// Render helper
function renderPopup(extraProps = {}) {
    const setSelected = vi.fn();
    const utils = render(<ThemeCreationPopup setSelected={setSelected} {...extraProps} />);
    return { setSelected, ...utils };
}

// Reset before each test
beforeEach(() => {
    vi.clearAllMocks();

    searchMovies.mockResolvedValue(MOCK_MOVIES_PAGE);
    getMovieCount.mockResolvedValue(12); // e.g. 2 pages with limit 6
    getMoviePoster.mockResolvedValue("http://poster-from-service");

    // Ensure username is present for submit
    sessionStorage.setItem("username", "TestUser");
});

// Cleanup after tests
afterEach(() => {
    cleanup();
});

    // Ensure basic layout and submit button renders
    it("renders base layout and submit button", () => {
        // Arrange
        renderPopup();

        // Act
        const submitButton = screen.getByText("submit");

        // Assert
        expect(submitButton).toBeInTheDocument();
        expect(screen.getByTestId("movie-searcher")).toBeInTheDocument();
        expect(screen.getByTestId("theme-creator")).toBeInTheDocument();
    });

    // Ensure no movie search is performed on initial render with empty searchQuery
    it("does not call search services on initial render with empty searchQuery", () => {
        // Arrange
        renderPopup();

        // Act / Assert
        expect(getMovieCount).not.toHaveBeenCalled();
        expect(searchMovies).not.toHaveBeenCalled();
    });

    // Ensure normal text search uses getMovieCount and searchMovies with page 1 + MOVIE_LIMIT
    it("performs a normal search using getMovieCount and searchMovies", async () => {
        // Arrange
        renderPopup();

        // Act
        fireEvent.click(screen.getByTestId("trigger-search"));

        // Assert
        await waitFor(() => {
            expect(getMovieCount).toHaveBeenCalledWith("star wars");
            expect(searchMovies).toHaveBeenCalled();
        });

        // We only assert that at least one call matches our expected pagination
        const calls = searchMovies.mock.calls;
        const hasExpectedCall = calls.some(
            (args) =>
                args[0] === "star wars" && // searchQuery
                args[1] === 1 && // page
                args[2] === MOVIE_LIMIT // limit
        );
        expect(hasExpectedCall).toBe(true);
    });

    // Ensure tconst/IMDb link search bypasses getMovieCount and calls searchMovies with tconst, page 1, limit 1
    it("performs a tconst search when searchQuery contains an IMDb link", async () => {
        // Arrange
        searchMovies.mockResolvedValue([{ tConst: "tt1234567", title: "Direct Movie" }]);
        renderPopup();

        // Act
        fireEvent.click(screen.getByTestId("trigger-tconst-search"));

        // Assert
        await waitFor(() => {expect(searchMovies).toHaveBeenCalled();});

        expect(getMovieCount).not.toHaveBeenCalled();

        const calls = searchMovies.mock.calls;
        const hasTconstCall = calls.some(
            (args) =>
                args[0] === "tt1234567" && // tconst extracted
                args[1] === 1 && // page
                args[2] === 1 // limit 1 for direct tconst search
        );
        expect(hasTconstCall).toBe(true);
    });

    // Ensure changing page calls searchMovies with new page number for normal search
    it("loads a different page when pageCount changes", async () => {
        // Arrange
        renderPopup();

        // Act 1: trigger a normal search so searchQuery is set
        fireEvent.click(screen.getByTestId("trigger-search"));

        await waitFor(() => {expect(getMovieCount).toHaveBeenCalledWith("star wars");});

        // Act 2: go to page 2
        fireEvent.click(screen.getByTestId("go-to-page-2"));

        // Assert
        await waitFor(() => {
            const calls = searchMovies.mock.calls;
            const hasPage2Call = calls.some(
                (args) =>
                    args[0] === "star wars" && // query
                    args[1] === 2 && // pageCount
                    args[2] === MOVIE_LIMIT
            );
            expect(hasPage2Call).toBe(true);
        });
    });

    // Ensure missing posters trigger getMoviePoster calls
    it("fetches missing posters for movies without poster URLs", async () => {
        // Arrange
        searchMovies.mockResolvedValue([
            { tConst: "tt0000001", title: "Needs Poster", moviePosterURL: null },
        ]);
        getMoviePoster.mockResolvedValue("http://poster-from-service");
        renderPopup();

        // Act
        fireEvent.click(screen.getByTestId("trigger-search"));

        // Assert
        await waitFor(() => {expect(getMoviePoster).toHaveBeenCalledWith("tt0000001");});});

    // Ensure adding and removing movies updates the ThemeCreator movies prop
    it("adds and removes movies from the theme", async () => {
        // Arrange
        renderPopup();

        // Initially 0 movies
        expect(screen.getByTestId("current-movie-count")).toHaveTextContent(
            "Movies in theme: 0"
        );

        // Act: Add movie
        fireEvent.click(screen.getByTestId("add-movie-to-theme"));

        // Assert: now 1 movie
        await waitFor(() => {
            expect(screen.getByTestId("current-movie-count")).toHaveTextContent(
                "Movies in theme: 1"
            );
        });

        // Act: Remove movie
        fireEvent.click(screen.getByTestId("remove-movie"));

        // Assert: back to 0
        await waitFor(() => {
            expect(screen.getByTestId("current-movie-count")).toHaveTextContent(
                "Movies in theme: 0"
            );
        });
    });

    // Ensure submit validation shows alert when title is missing
    it("shows an alert when submitting without a title", async () => {
        // Arrange
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
        renderPopup();

        // Act: click submit directly, with empty title and no movies
        fireEvent.click(screen.getByText("submit"));

        // Assert
        expect(alertSpy).toHaveBeenCalledWith("Please enter theme title");
        expect(addTheme).not.toHaveBeenCalled();
    });

    // Ensure submit validation shows alert when no movies are selected
    it("shows an alert when submitting without any movies", async () => {
        // Arrange
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
        renderPopup();

        // Act: set a title but do not add any movies
        fireEvent.click(screen.getByTestId("set-title"));
        fireEvent.click(screen.getByText("submit"));

        // Assert
        expect(alertSpy).toHaveBeenCalledWith("Please add at least one movie");
        expect(addTheme).not.toHaveBeenCalled();
    });

    // Ensure successful submit calls addTheme and setSelected
    it("submits successfully with valid title and at least one movie", async () => {
        // Arrange
        const setSelectedMock = vi.fn();
        const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
        addTheme.mockResolvedValue("ok");

        render(
            <ThemeCreationPopup setSelected={setSelectedMock} />
        );

        // Act: set title, add movie, then submit
        fireEvent.click(screen.getByTestId("set-title"));
        fireEvent.click(screen.getByTestId("add-movie-to-theme"));
        fireEvent.click(screen.getByText("submit"));

        // Assert
        await waitFor(() => {
            expect(addTheme).toHaveBeenCalled();
        });

        const [titleArg, usernameArg, tconstArrayArg, rulesArg] =
            addTheme.mock.calls[0];

        expect(titleArg).toBe("My Awesome Theme");
        expect(usernameArg).toBe("TestUser");
        expect(tconstArrayArg).toEqual(["tt0000001"]); // from our mock added movie
        expect(rulesArg).toEqual([]); // initial rules is [], and rules || "" => []

        expect(setSelectedMock).toHaveBeenCalledWith("themes");
        expect(alertSpy).not.toHaveBeenCalledWith(
            expect.stringContaining("failed to create theme")
        );
    });