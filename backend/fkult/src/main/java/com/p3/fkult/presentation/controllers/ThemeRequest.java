package com.p3.fkult.presentation.controllers;
import com.p3.fkult.persistence.entities.Movie;
import java.util.List;
public class ThemeRequest {
    private Long themeId;
    private String name;
    private Long userId;
    private List<Long> movieIds;
    private List<String> drinkingRules;

    public ThemeRequest(Long themeId, String name, Long userId, List<Long> movieIds, List<String> drinkingRules){
        this.themeId = themeId;
        this.name = name;
        this.userId = userId;
        this.movieIds = movieIds;
        this.drinkingRules = drinkingRules;
    }

    //getters
    public Long getThemeId(){
        return themeId;
    }
    public String getName() { return name; }
    public Long getUserId() { return userId; }
    public List<Long> getMovieIds() { return movieIds; }
    public List<String> getDrinkingRules() { return drinkingRules; }

    //setters
    public void setName(String name) { this.name = name; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setMovieIds(List<Long> movieIds) { this.movieIds = movieIds; }
    public void setRules(List<String> rules) { this.drinkingRules = rules; }
}
