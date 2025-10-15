package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.ExampleMessageService;
import com.p3.fkult.persistence.entities.ExampleMessage;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ExampleMessageController {

    private final ExampleMessageService messageService;

    public ExampleMessageController(ExampleMessageService messageService) {
        this.messageService = messageService;
    }

    // GET all messages
    @GetMapping
    public List<ExampleMessage> getMessages() {
        return messageService.getAllMessages();
    }

    // POST a new message
    @PostMapping
    public ExampleMessage addMessage(@RequestBody String content) {
        return messageService.saveMessage(content);
    }
    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable long id) {
        messageService.deleteMessage(id);
    }
}
