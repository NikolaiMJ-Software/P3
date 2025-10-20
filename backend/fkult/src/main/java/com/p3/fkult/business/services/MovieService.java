package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.DrinkingRule;
import com.p3.fkult.persistence.entities.Movie;
import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.persistence.entities.ThemeMovie;
import com.p3.fkult.persistence.repository.*;
import com.p3.fkult.presentation.controllers.ThemeRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class MovieService {
    private String IMDB_URL = "https://www.imdb.com/title/";
    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public MovieService(MovieRepository movieRepository){
        this.movieRepository = movieRepository;
    }
//WIP should return a MovieDTO defined in controller folder
    public void getMoviesByIds(List<Long> movieIds){
        List<Movie> movies = movieIds
                .stream()
                .map(movieId -> movieRepository.findById(movieId))
                .toList();
        List<String> posterURLs = movies
                .stream()
                .map(movie -> getPosterURL(movie))
                .toList();

    }
    public String getPosterURL(Movie movie){
        String tConst = movie.getTconst() + "/";
        String movieURL = IMDB_URL + tConst;

        return new String("wat");
    }

    public String fetchHTML(String imdbURL){
        return restTemplate.getForObject(imdbURL, String.class);
    }
}
