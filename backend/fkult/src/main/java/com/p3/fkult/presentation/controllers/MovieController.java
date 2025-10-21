package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.MovieService;
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

    @PostMapping("/batch")
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
}