package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.MovieService;
import com.p3.fkult.persistence.entities.Movie;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/batchById")
    public ResponseEntity<?> getMovieIds(@RequestBody List<Long> movieIds) {
        try {
            List<MovieRequest> movies = movieService.getMoviesByIds(movieIds);
            return ResponseEntity.ok(movies);
        } catch (RuntimeException e) {
            // Return 404 with a JSON error message
            Map<String, String> errorBody = new HashMap<>();
            errorBody.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
        }
    }

    @PostMapping("/batchByTconst")
        public ResponseEntity<?> getMoviesByTconst(@RequestBody List<String> tconsts) {
            try {
                List<MovieRequest> movies = movieService.getMoviesByTconsts(tconsts);
                return ResponseEntity.ok(movies);
            } catch (RuntimeException e) {
                // Return 404 with a JSON error message
                Map<String, String> errorBody = new HashMap<>();
                errorBody.put("error", e.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody);
            }
        }


    //Search by movie name
    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(@RequestParam String q) {
        List<Movie> results = movieService.searchMovies(q);
        return ResponseEntity.ok(results);
    } // to test the search: http://localhost:8080/api/movies/search?q=moviename

    //IMDb preview (scraping http to json)
    @GetMapping("/preview/{tconst}")
    public ResponseEntity<Map<String, String>> getPreview(@PathVariable String tconst) {
        Map<String, String> preview = new HashMap<>();
        try {
            String url = "https://www.imdb.com/title/" + tconst + "/";
            Document doc = Jsoup.connect(url).userAgent("Mozilla/5.0").get();

            preview.put("title", getMeta(doc, "og:title"));
            preview.put("description", getMeta(doc, "og:description"));
            preview.put("image", getMeta(doc, "og:image"));
            preview.put("url", getMeta(doc, "og:url"));

            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            preview.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(preview);
        }
    }

    private String getMeta(Document doc, String property) {
        Element meta = doc.selectFirst("meta[property=" + property + "]");
        return meta != null ? meta.attr("content") : "";
    }
}
    
