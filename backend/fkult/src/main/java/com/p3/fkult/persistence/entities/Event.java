package com.p3.fkult.persistence.entities;

public class Event {
    private long id;
    private String event_date;
    private long theme_id;

    public Event() {}

    public Event(long id, String event_date, long theme_id) {
        this.id = id;
        this.event_date = event_date;
        this.theme_id = theme_id;

    }

    // Get functions
    public long getId() {
        return this.id;
    }
    public String getEventDate() {
        return this.event_date;
    }
    public long getThemeId() {
        return this.theme_id;
    }

    // Set functions
    public void setId(long id) {
        this.id = id;
    }
    public void setEventDate(String event_date) {
        this.event_date = event_date;
    }
    public void setThemeId(long theme_id) {
        this.theme_id = theme_id;
    }
}