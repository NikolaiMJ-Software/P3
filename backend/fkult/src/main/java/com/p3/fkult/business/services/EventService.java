package com.p3.fkult.business.services;

import org.springframework.stereotype.Service;
import com.p3.fkult.persistence.repository.EventRepository;
import com.p3.fkult.persistence.entities.Event;

@Service
public class EventService {

    // Download a copy of repository to run its code
    public final EventRepository eventRepository;
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Handles event uploads
    public String UploadEvent(Event event) {
        try {
            eventRepository.save(event);
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
}