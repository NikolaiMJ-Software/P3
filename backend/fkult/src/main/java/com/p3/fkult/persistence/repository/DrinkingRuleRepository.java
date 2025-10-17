package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.DrinkingRule;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
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

    //database operations
    public List<DrinkingRule> findAll(){
        return jdbcTemplate.query("SELECT * FROM drinking_rule", rowMapper);
    }

    public DrinkingRule save(DrinkingRule drinkingRule) {
        jdbcTemplate.update("INSERT INTO drinking_rule (theme_id, rule_text) VALUES (?,?)", drinkingRule.getThemeId(), drinkingRule.getRuleText());
        // Get the last inserted ID
        Long id = jdbcTemplate.queryForObject("SELECT last_insert_rowid()", Long.class);
        drinkingRule.setId(id);
        return drinkingRule;
    }
}
