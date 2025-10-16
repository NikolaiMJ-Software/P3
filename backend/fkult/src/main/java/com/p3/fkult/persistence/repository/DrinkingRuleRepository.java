package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.DrinkingRule;
import com.p3.fkult.persistence.entities.Movie;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import java.util.List;


public class DrinkingRuleRepository {
    private final JdbcTemplate jdbcTemplate;

    public DrinkingRuleRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<DrinkingRule> rowMapper = (rs, rowNum) ->
            new DrinkingRule(
                    rs.getLong("id"),
                    rs.getLong("theme_id"),
                    rs.getString("rule_text")
            );

    public List<DrinkingRule> findAll(){
        return jdbcTemplate.query("SELECT * FROM drinking_rule", rowMapper);
    }
}
