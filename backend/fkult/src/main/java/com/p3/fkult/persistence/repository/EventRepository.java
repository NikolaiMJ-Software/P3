package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.Event;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class EventRepository {

    // Setup template for database operations
    private final JdbcTemplate jdbcTemplate;
    public EventRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    // Setup RowMapper to map database rows to Event objects
    private final RowMapper<Event> rowMapper = (rs, rowNum) -> (
        new Event(
            rs.getLong("id"),
            LocalDateTime.parse(rs.getString("event_date")),
            rs.getObject("theme_id") != null ? rs.getLong("theme_id") : null
        )
    );

    // Get all Events from the database
    public List<Event> getAll(){
        String sql = "SELECT * FROM event";
        return jdbcTemplate.query(sql, rowMapper);
    }

    // Save an Event to the database
    public void save(LocalDateTime eventDate, long themeId){
        String sql = "INSERT INTO event (event_date, theme_id) VALUES (?,?)";
        jdbcTemplate.update(sql, eventDate, themeId);
    }

    // Delete one Event from the database by id
    public void delete(long id){
        String sql = "DELETE FROM event WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public Event getLastStartupEvent(){
        String sql = "SELECT * FROM event WHERE theme_id IS NULL AND event_date <= ? ORDER BY event_date DESC LIMIT 1";
        LocalDateTime today = LocalDateTime.now();
        List<Event> startups = jdbcTemplate.query(sql, rowMapper, today.toString());
        if(startups.isEmpty()){
            return null;
        }
        return startups.get(0);
    }
}
