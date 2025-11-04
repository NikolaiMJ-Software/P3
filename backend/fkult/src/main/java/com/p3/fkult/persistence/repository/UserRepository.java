package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.User;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
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
                    rs.getInt("is_banned"),
                    rs.getInt("is_admin")
            );

    //database operations
    public List<User> findAll(){
        return jdbcTemplate.query("SELECT * FROM user", rowMapper);
    }

    public User findUser(String username){
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM user WHERE username = ?", rowMapper, username);
        } catch (EmptyResultDataAccessException e){
            return new User(-1, "error", "Error Error", 0, 0);
        }
    }

    public User updateAdminStatus(String username, int status){
        jdbcTemplate.update("UPDATE user SET is_admin = ? WHERE username = ?", status, username);
        return jdbcTemplate.queryForObject("SELECT * FROM user WHERE username = ?", rowMapper, username);
    }

    public User updateUserBanStatus(String username, int status){
        jdbcTemplate.update("UPDATE user SET is_banned = ? WHERE username = ?", status, username);
        return jdbcTemplate.queryForObject("SELECT * FROM user WHERE username = ?", rowMapper, username);
    }

    // Find ID by username
    public long findIdByUsername(String username){
        return jdbcTemplate.queryForObject("SELECT id FROM user WHERE username = ?", Long.class, username);
    }

}
