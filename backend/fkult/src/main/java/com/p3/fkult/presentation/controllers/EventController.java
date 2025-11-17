package com.p3.fkult.presentation.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.p3.fkult.business.services.EventService;
import com.p3.fkult.persistence.entities.Event;

@RestController
@RequestMapping("/api/event")
public class EventController {
    
    // Download copy of EventService to use its functions
    private final EventService service;
    public EventController(EventService service) {
        this.service = service;
    }

    @GetMapping("/all")
public List<Event> getAllEvents() {
    return service.getAllEvents();
}

    // Delete event from id
    @DeleteMapping("/delete/{id}")
    public String deleteEvent(@PathVariable long id) {
        return service.DeleteEvent(id);
    }

    // Upload event to the database
    @PutMapping("/upload/{LocalDate}/{themeId}")
    public String UploadEvent(@PathVariable("LocalDate") LocalDateTime eventDate, @PathVariable("themeId") long themeId) {
        return service.UploadEvent(eventDate, themeId);
    }
}