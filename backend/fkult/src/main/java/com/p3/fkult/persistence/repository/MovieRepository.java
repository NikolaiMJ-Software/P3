package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.Theme;
import org.springframework.stereotype.Repository;

import com.p3.fkult.persistence.entities.Movie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.util.List;

@Repository
public class MovieRepository {

    private final JdbcTemplate jdbcTemplate;

    //Constructor :D
    public MovieRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Movie> rowMapper = (rs, rowNum) ->
            new Movie(
                    rs.getLong("id"),
                    rs.getString("tconst"),
                    rs.getString("movie_name"),
                    rs.getString("original_movie_name"),
                    rs.getInt("year"),
                    rs.getInt("runtime_minutes"),
                    rs.getBoolean("is_active")
            );

    //database operations
    public List<Movie> findAll(){
        return jdbcTemplate.query("SELECT * FROM movie", rowMapper);
    }
}
