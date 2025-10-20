package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.MovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @PostMapping("/batch")
    //WIP should return a list of Strings of the movie ids
    public void getMovieIds(@RequestBody List<Long> movieIds){
        //return movieService.getMoviesByIds(movieIds);
    }
}