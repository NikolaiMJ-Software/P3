package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.UserService;
import com.p3.fkult.persistence.entities.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    //GET all users
    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
