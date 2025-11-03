package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.Movie;
import com.p3.fkult.persistence.repository.MovieRepository;
import com.p3.fkult.presentation.controllers.MovieRequest;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class MovieService {
    private final String IMDB_URL = "https://www.imdb.com/title/";
    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<MovieRequest> searchMovies(String query) {
        //partial matches (case-insensitive)
        List<MovieRequest> movieRequests = new ArrayList<MovieRequest>();
        movieRepository.searchMovies(query).forEach(movie -> {
            MovieRequest movieRequest = new MovieRequest(movie.getTconst(), movie.getMovieName(), movie.getRuntimeMinutes(), movie.getYear());
            movieRequests.add(movieRequest);
        });
        return movieRequests;
    }

    public List<MovieRequest> getMoviesByIds(List<Long> movieIds) {
        List<MovieRequest> movieRequests = new ArrayList<>();

        for (Long movieId : movieIds) {
            Movie movie = movieRepository.findById(movieId);
            if (movie == null) {
                throw new RuntimeException("Movie not found with id: " + movieId);
            }
            String posterURL = getPosterURL(movie);
            MovieRequest movieRequest = new MovieRequest(
                    movie.getId(),
                    movie.getMovieName(),
                    posterURL,
                    movie.getRuntimeMinutes(),
                    movie.getYear()
            );
            movieRequests.add(movieRequest);
        }
        return movieRequests;
    }

    public List<MovieRequest> getMoviesByTconsts(List<String> tConsts){
        List<MovieRequest> movieRequests = new ArrayList<>();

        for (String tConst : tConsts) {
            Movie movie = movieRepository.findByTconst(tConst);
            if (movie == null) {
                throw new RuntimeException("Movie not found with tconst: " + tConst);
            }
            String posterURL = getPosterURL(movie);
            MovieRequest movieRequest = new MovieRequest(
                    movie.getId(),
                    movie.getMovieName(),
                    posterURL,
                    movie.getRuntimeMinutes(),
                    movie.getYear()
            );
            movieRequests.add(movieRequest);
        }
        return movieRequests;
    }

    //ChatGPT said this is maybe illegal... but... it works though
    public String getPosterURL(Movie movie) {
        if (movie.getTconst() == null) {
            System.out.println("Movie " + movie.getId() + " has no tconst");
            return null;
        }
        if(movie.getPosterURL() != null && !movie.getPosterURL().isBlank()){
            System.out.println("Found cached poster" + movie.getPosterURL());
            return movie.getPosterURL();
        }

        String tConst = movie.getTconst() + "/";
        String movieURL = IMDB_URL + tConst;
        System.out.println("Fetching poster from: " + movieURL);

        try {
            // Use browser-like headers to avoid IMDb giving a 403 forbidden
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                    "AppleWebKit/537.36 (KHTML, like Gecko) " +
                    "Chrome/119.0.0.0 Safari/537.36");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    movieURL,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            String html = response.getBody();
            if (html == null || html.isEmpty()) {
                System.out.println("Failed to fetch HTML for movie " + movie.getId());
                return null;
            }

            Document doc = Jsoup.parse(html);
            Element ogImage = doc.selectFirst("meta[property=og:image]");
            if (ogImage != null) {
                String poster = ogImage.attr("content");
                movieRepository.updatePosterURL(movie.getId(), poster);
                movie.setPosterURL(poster);
                System.out.println("Found poster URL: " + poster +" caching URL...");
                return poster;
            } else {
                System.out.println("No og:image meta tag found for " + movieURL);
                return null;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
