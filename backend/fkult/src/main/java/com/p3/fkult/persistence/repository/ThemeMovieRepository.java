package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.DrinkingRule;
import com.p3.fkult.persistence.entities.Movie;
import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.persistence.entities.ThemeMovie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

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

    public List<ThemeMovie> findByThemeId(long themeId){
        String sql = "SELECT * FROM theme_movie WHERE theme_id = ?";
        return jdbcTemplate.query(sql, rowMapper, themeId);
    }

    public ThemeMovie save(ThemeMovie themeMovie) {
        jdbcTemplate.update("INSERT INTO theme_movie (theme_id, movie_id) VALUES (?,?)", themeMovie.getThemeid(), themeMovie.getMovieid());
        return themeMovie;
    }

    // delete theme movie
    public void deleteByThemeId(long themeId) {
        jdbcTemplate.update("DELETE FROM theme_movie WHERE theme_id = ?", themeId);
    }

}
