package com.p3.fkult.business.services;

import org.springframework.stereotype.Service;
import com.p3.fkult.persistence.repository.EventRepository;
import com.p3.fkult.persistence.entities.Event;

import java.time.LocalDateTime;

@Service
public class EventService {

    // Download a copy of repository to run its code
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Handles event uploads
    public String UploadEvent(LocalDateTime eventDate, long themeId) {
        try {
            eventRepository.save(eventDate, themeId);
            return "Event upload complete!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Event upload failed: " + e.getMessage();
        }
    }

    // Handles event deletion
    public String DeleteEvent(long id) {
        try {
            eventRepository.delete(id);
            return "Event deletion complete!";
        } catch (Exception e) {
            e.printStackTrace();
            return "Event deletion failed: " + e.getMessage();
        }
    }

    public LocalDateTime getLastStartupDate(){
        Event event = eventRepository.getLastStartupEvent();
        return event.getEventDate();
        // NOT SURE HERE
    }
}