package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.DrinkingRule;
import com.p3.fkult.persistence.entities.Movie;
import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.persistence.entities.ThemeMovie;
import com.p3.fkult.persistence.repository.*;
import com.p3.fkult.presentation.controllers.MovieRequest;
import com.p3.fkult.presentation.controllers.ThemeRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

import java.util.ArrayList;
import java.util.List;

@Service
public class MovieService {
    private final String IMDB_URL = "https://www.imdb.com/title/";
    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public MovieService(MovieRepository movieRepository){
        this.movieRepository = movieRepository;
    }

    public List<MovieRequest> getMoviesByIds(List<Long> movieIds) {
        List<MovieRequest> movieRequests = new ArrayList<>();

        for (Long movieId : movieIds) {
            Movie movie = movieRepository.findById(movieId);
            if (movie == null){
                throw new RuntimeException("Movie not found with id: " + movieId);
            }
            String posterURL = getPosterURL(movie);
            MovieRequest movieRequest = new MovieRequest(
                    movie.getId(),
                    movie.getMovieName(),
                    posterURL,
                    movie.getRuntimeMinutes(),
                    movie.getYear());
            movieRequests.add(movieRequest);
        }
        return movieRequests;
    }

    public String getPosterURL(Movie movie){
        String tConst = movie.getTconst() + "/";
        String movieURL = IMDB_URL + tConst;

        try{
            String html = fetchHTML(movieURL);
            Document doc = Jsoup.parse(html);
            Element ogImage = doc.selectFirst("meta[property=og:image]");
            if (ogImage != null){
                return ogImage.attr("content");
            } else {
                return null;
            }
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public String fetchHTML(String imdbURL){
        return restTemplate.getForObject(imdbURL, String.class);
    }
}
