package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.Movie;
import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.persistence.entities.ThemeMovie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class ThemeMovieRepository {
    private final JdbcTemplate jdbcTemplate;

    public ThemeMovieRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<ThemeMovie> rowMapper = (rs, rowNum) ->
            new ThemeMovie(
                    rs.getLong("theme_id"),
                    rs.getLong("movie_id")
            );

    public ThemeMovie save(ThemeMovie themeMovie) {
        jdbcTemplate.update("INSERT INTO theme_movie (theme_id, movie_id) VALUES (?,?)", themeMovie.getThemeid(), themeMovie.getMovieid());
        return themeMovie;
    }
}
