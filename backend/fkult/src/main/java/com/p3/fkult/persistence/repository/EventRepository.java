package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.Event;
import com.p3.fkult.persistence.entities.Theme;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;


@Repository
public class EventRepository {

    private final JdbcTemplate jdbcTemplate;


    public EventRepository(JdbcTemplate jdbcTemplate) {this.jdbcTemplate = jdbcTemplate;}

    private final RowMapper<Event> rowMapper= (rs, rowNum) ->
            new Event (
                    rs.getLong("id"),
                    LocalDate.parse(rs.getString("event_date")),
                    rs.getObject("theme_id") != null ? rs.getLong("theme_id") : null
            );

    public Event getLastStartupEvent(){
        String sql = "SELECT * FROM event WHERE theme_id IS NULL AND event_date <= ? ORDER BY event_date DESC LIMIT 1";
        LocalDate today = LocalDate.now();
        List<Event> startups = jdbcTemplate.query(sql, rowMapper, today.toString());
        if(startups.isEmpty()){
            return null;
        }

        return startups.get(0);
    }
}
