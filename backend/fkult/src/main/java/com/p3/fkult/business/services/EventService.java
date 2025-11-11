package com.p3.fkult.business.services;

import com.p3.fkult.persistence.repository.EventRepository;
import com.p3.fkult.persistence.entities.Event;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public LocalDate getLastStartupDate(){
        Event event = eventRepository.getLastStartupEvent();
        return event.getDate();
    }
}
