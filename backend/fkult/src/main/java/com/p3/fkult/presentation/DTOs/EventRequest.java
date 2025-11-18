package com.p3.fkult.presentation.DTOs;

import java.time.LocalDateTime;
import java.util.List;

public class EventRequest {
    private String name;
    private String username;
    private LocalDateTime timestamp;
    private List<String> drinkingRules;
    private List<String> tConsts;

    //Constructors

    //default constructor
    public EventRequest(){}
    //Constructor for getting events
    public EventRequest(String name, String username, LocalDateTime timestamp, List<String> drinkingRules, List<String> tConsts){
        this.name = name;
        this.username = username;
        this.timestamp = timestamp;
        this.drinkingRules = drinkingRules;
        this.tConsts = tConsts;
    }

    //getters
    public void setName(String name) {
        this.name = name;
    }
    public void setDrinkingRules(List<String> drinkingRules) {
        this.drinkingRules = drinkingRules;
    }
    public void settConsts(List<String> tConsts) {
        this.tConsts = tConsts;
    }
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    //setters
    public List<String> getDrinkingRules() {
        return drinkingRules;
    }
    public List<String> gettConsts() {
        return tConsts;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public String getName() {
        return name;
    }
    public String getUsername() {
        return username;
    }
}
