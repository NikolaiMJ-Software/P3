package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.ExampleMessage;
import com.p3.fkult.persistence.entities.User;
import com.p3.fkult.persistence.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    };

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}
