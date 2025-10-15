package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.ExampleMessage;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ExampleMessageRepository {

    private final JdbcTemplate jdbcTemplate;

    public ExampleMessageRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Map SQL rows to Message objects
    private final RowMapper<ExampleMessage> rowMapper = (rs, rowNum) ->
            new ExampleMessage(rs.getLong("id"), rs.getString("content"));

    // Fetch all messages
    public List<ExampleMessage> findAll() {
        return jdbcTemplate.query("SELECT * FROM messages", rowMapper);
    }

    // Save a new message
    public ExampleMessage save(ExampleMessage examplemessage) {
        jdbcTemplate.update("INSERT INTO messages (content) VALUES (?)", examplemessage.getContent());
        // Get the last inserted ID
        Long id = jdbcTemplate.queryForObject("SELECT last_insert_rowid()", Long.class);
        examplemessage.setId(id);
        return examplemessage;
    }

    public void deleteById(long id){
        String sql = "DELETE FROM messages WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
