package com.p3.fkult.persistence.entities;

import java.time.LocalDate;

public class Event {
    private Long id;
    private LocalDate date;
    private long themeId;

    public Event(long id, LocalDate date, long themeId) {
        this.id = id;
        this.date = date;
        this.themeId = themeId;
    }

    public Event (LocalDate date, long themeId) {
        this.date = date;
        this.themeId = themeId;
    }


    //getters
    public Long getId() {return id;}
    public LocalDate getDate() {return date;}
    public long getThemeId() {return themeId;}

    //setters
    public void setId(long id) {this.id = id;}
    public void setDate(LocalDate date) {this.date = date;}
    public void setThemeId(long themeId) {this.themeId = themeId;}

}
