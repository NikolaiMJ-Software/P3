package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.ExampleMessage;
import com.p3.fkult.persistence.repository.ExampleMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExampleMessageService {

    private final ExampleMessageRepository examplemessageRepository;

    public ExampleMessageService(ExampleMessageRepository ExamplemessageRepository) {
        this.examplemessageRepository = ExamplemessageRepository;
    }

    public List<ExampleMessage> getAllMessages() {
        return examplemessageRepository.findAll();
    }

    public ExampleMessage saveMessage(String content) {
        return examplemessageRepository.save(new ExampleMessage(content));
    }

    public void deleteMessage (long id){
        examplemessageRepository.deleteById(id);
    }
}
