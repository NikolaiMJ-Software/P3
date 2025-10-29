package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.UserService;
import com.p3.fkult.persistence.entities.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
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

    //GET singular user by username, check for admin.
    @GetMapping("/admin/{username}")
    public int checkForAdminUser(@PathVariable String username) {
        User user = userService.getUser(username);
        return user.getAdmin() ? 1 : 0;
    }

    @GetMapping("/id/{username}")
    public long getUserIdByUsername(@PathVariable String username){
        return userService.getUserIdByUsername(username);
    }
}
