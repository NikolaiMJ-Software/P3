package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.User;
import com.p3.fkult.persistence.repository.UserRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController

@RequestMapping("/users")
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    @GetMapping("/id/{username}")
    public long getUserIdByUsername(@PathVariable String username){
        return userRepository.findIdByUsername(username);
    }
}