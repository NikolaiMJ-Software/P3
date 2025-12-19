import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";

// Component under test
import ThemeCreationPopup from "../../components/Theme/ThemeCreationPopup.jsx";
import { getMovieCount, searchMovies, getMoviePoster } from "../../services/movieService.jsx";

// Mock i18n
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k) => k }),
}));

// Mock movie service (this is what filters affect)
vi.mock("../../services/movieService.jsx", () => ({
  getMovieCount: vi.fn(),
  searchMovies: vi.fn(),
  getMoviePoster: vi.fn(),
}));

// Mock theme service (not used in these tests, but avoids runtime imports)
vi.mock("../../services/themeService.jsx", () => ({
  addTheme: vi.fn(),
  getThemes: vi.fn(),
}));

// Mock child components to trigger parent setters cleanly without testing child UI here
vi.mock("../../components/Theme/ThemeMovieSearcher.jsx", () => ({
  __esModule: true,
  default: (props) => (
    <div>
      <button data-testid="set-query" onClick={() => props.setSearchQuery("star wars")}>
        set query
      </button>

      <button
        data-testid="set-imdb"
        onClick={() => props.setSearchQuery("https://www.imdb.com/title/tt1234567/")}
      >
        set imdb
      </button>

      <button data-testid="toggle-hide-unrated" onClick={() => props.setHideUnrated(true)}>
        hide unrated
      </button>

      <button data-testid="set-sort-year" onClick={() => props.setSortBy("year")}>
        sort year
      </button>

      <button data-testid="set-page-2" onClick={() => props.setPageCount(2)}>
        page 2
      </button>

      <div data-testid="debug">
        page:{props.pageCount} sortBy:{props.sortBy} hideUnrated:{String(props.hideUnrated)}
      </div>
    </div>
  ),
}));

vi.mock("../../components/Theme/ThemeCreator.jsx", () => ({
  __esModule: true,
  default: () => <div data-testid="creator">creator</div>,
}));

describe("ThemeCreationPopup - filter/search logic unit tests", () => {
  beforeEach(() => {
    getMovieCount.mockResolvedValue(12); // total pages = 2 with MOVIE_LIMIT=6
    searchMovies.mockResolvedValue([
      { tConst: "tt0000001", primaryTitle: "Mock Movie 1", moviePosterURL: "x" },
    ]);
    getMoviePoster.mockResolvedValue("poster-url");
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  // Ensure normal text search triggers movie count + first page search with default filters
  it("runs a normal search and passes default filter args to searchMovies", async () => {
    // Arrange
    render(<ThemeCreationPopup setSelected={vi.fn()} />);

    // Act
    fireEvent.click(screen.getByTestId("set-query"));

    // Assert
    await waitFor(() => {
      expect(getMovieCount).toHaveBeenCalledWith("star wars");
    });

    await waitFor(() => {
      // searchMovies(query, page, limit, sortBy, sortDirection, movieFilter, seriesFilter, shortsFilter, hideUnrated)
      expect(searchMovies).toHaveBeenCalledWith(
        "star wars",
        1,
        6,
        "rating",
        "desc",
        true,
        false,
        false,
        false
      );
    });
  });

  // Ensure changing hideUnrated triggers a new search with hideUnrated=true
  it("changing hideUnrated reruns searchMovies with hideUnrated=true", async () => {
    // Arrange
    render(<ThemeCreationPopup setSelected={vi.fn()} />);
    fireEvent.click(screen.getByTestId("set-query"));
    await waitFor(() => expect(searchMovies).toHaveBeenCalled());

    // Act
    fireEvent.click(screen.getByTestId("toggle-hide-unrated"));

    // Assert
    await waitFor(() => {
      expect(searchMovies).toHaveBeenLastCalledWith(
        "star wars",
        1,
        6,
        "rating",
        "desc",
        true,
        false,
        false,
        true
      );
    });
  });

  // Ensure changing sortBy triggers a new search using the updated sortBy value
  it("changing sortBy reruns searchMovies with the new sortBy", async () => {
    // Arrange
    render(<ThemeCreationPopup setSelected={vi.fn()} />);
    fireEvent.click(screen.getByTestId("set-query"));
    await waitFor(() => expect(searchMovies).toHaveBeenCalled());

    // Act
    fireEvent.click(screen.getByTestId("set-sort-year"));

    // Assert
    await waitFor(() => {
      expect(searchMovies).toHaveBeenLastCalledWith(
        "star wars",
        1,
        6,
        "year",
        "desc",
        true,
        false,
        false,
        false
      );
    });
  });

  // Ensure changing pageCount loads the requested page for normal searches
  it("changing pageCount loads that page (normal search path)", async () => {
    // Arrange
    render(<ThemeCreationPopup setSelected={vi.fn()} />);
    fireEvent.click(screen.getByTestId("set-query"));

    await waitFor(() => {
      expect(searchMovies).toHaveBeenCalledWith(
        "star wars",
        1,
        6,
        "rating",
        "desc",
        true,
        false,
        false,
        false
      );
    });

    // Act
    fireEvent.click(screen.getByTestId("set-page-2"));

    // Assert
    await waitFor(() => {
      expect(searchMovies).toHaveBeenLastCalledWith(
        "star wars",
        2,
        6,
        "rating",
        "desc",
        true,
        false,
        false,
        false
      );
    });
  });

  // Ensure IMDb/tconst searches bypass getMovieCount and always use limit=1 even after filter changes
  it("IMDb/tconst search bypasses getMovieCount and uses limit=1 even if filters change", async () => {
    // Arrange
    render(<ThemeCreationPopup setSelected={vi.fn()} />);

    // Act
    fireEvent.click(screen.getByTestId("set-imdb"));

    // Assert
    await waitFor(() => {
      expect(getMovieCount).not.toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(searchMovies).toHaveBeenCalledWith(
        "tt1234567",
        1,
        1,
        "rating",
        "desc",
        true,
        false,
        false,
        false
      );
    });

    // Act
    fireEvent.click(screen.getByTestId("toggle-hide-unrated"));

    // Assert
    await waitFor(() => {
      expect(searchMovies).toHaveBeenLastCalledWith(
        "tt1234567",
        1,
        1,
        "rating",
        "desc",
        true,
        false,
        false,
        true
      );
    });
  });
});
