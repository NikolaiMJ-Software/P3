package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.Event;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
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
            rs.getString("event_date"),
            rs.getLong("theme_id")
        )
    );

    // Get all Events from the database
    public List<Event> getAll(){
        String sql = "SELECT * FROM events";
        return jdbcTemplate.query(sql, rowMapper);
    }

    // Save an Event to the database
    public void save(Event event){
        String sql = "INSERT INTO events (event_date, theme_id) VALUES (?,?)";
        jdbcTemplate.update(sql, event.getEventDate(), event.getThemeId());
    }

    // Delete one Event from the database by id
    public void delete(long id){
        String sql = "DELETE FROM events WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}