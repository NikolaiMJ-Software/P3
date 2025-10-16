package com.p3.fkult.presentation.controllers;
import com.p3.fkult.persistence.entities.Movie;
import java.util.List;
public class ThemeRequest {
    private String name;
    private Long userId;
    private List<Long> movieIds;
    private List<String> drinkingRules;

    //getters
    public String getName() { return name; }
    public Long getUserId() { return userId; }
    public List<Long> getMovieIds() { return movieIds; }
    public List<String> getRules() { return drinkingRules; }

    //setters
    public void setName(String name) { this.name = name; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setMovieIds(List<Long> movieIds) { this.movieIds = movieIds; }
    public void setRules(List<String> rules) { this.drinkingRules = rules; }
}
