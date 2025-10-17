package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.ExampleMessage;
import com.p3.fkult.persistence.entities.Theme;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public class ThemeRepository {

    private final JdbcTemplate jdbcTemplate;

    //Constructor :D
    public ThemeRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Theme> rowMapper = (rs, rowNum) ->
            new Theme(
                    rs.getLong("id"),
                    rs.getString("name"),
                    rs.getLong("user_id"),
                    rs.getTimestamp("timestamp").toLocalDateTime(),
                    rs.getObject("vote_count", Integer.class)
            );

    //database operations
    public List<Theme> findAll(){
        return jdbcTemplate.query("SELECT * FROM theme", rowMapper);
    }

    public Theme save(Theme theme) {
        jdbcTemplate.update("INSERT INTO theme (name, user_id) VALUES (?,?)", theme.getName(), theme.getUserid());
        // Get the last inserted ID
        Long id = jdbcTemplate.queryForObject("SELECT last_insert_rowid()", Long.class);
        theme.setId(id);
        return theme;
    }
}
