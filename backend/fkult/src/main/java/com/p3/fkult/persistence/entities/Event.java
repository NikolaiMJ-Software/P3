package com.p3.fkult.persistence.entities;

import java.time.LocalDate;

public class Event {
    private Long id;
    private LocalDate eventDate;
    private long themeId;

    public Event() {}

    public Event(long id, LocalDate eventDate, long themeId) {
        this.id = id;
        this.eventDate = eventDate;
        this.themeId = themeId;
    }

    // Get functions
    public long getId() {
        return this.id;
    }
    public LocalDate getEventDate() {
        return this.eventDate;
    }
    public long getThemeId() {
        return this.themeId;
    }

    // Set functions
    public void setId(long id) {
        this.id = id;
    }
    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }
    public void setThemeId(long themeId) {
        this.themeId = themeId;
    }
}
