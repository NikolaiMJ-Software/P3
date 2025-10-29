package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    //Constructor :D
    public UserRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> rowMapper = (rs, rowNum) ->
            new User(
                    rs.getLong("id"),
                    rs.getString("username"),
                    rs.getString("name"),
                    rs.getBoolean("is_banned"),
                    rs.getBoolean("is_admin")
            );

    //database operations
    public List<User> findAll(){
        return jdbcTemplate.query("SELECT * FROM user", rowMapper);
    }

    public User findUser(String username){
        return jdbcTemplate.queryForObject("SELECT * FROM user WHERE username = ?", rowMapper, username);
    }

    // Find ID by username
    public long findIdByUsername(String username){
        return jdbcTemplate.queryForObject("SELECT id FROM user WHERE username = ?", Long.class, username);
    }


}
