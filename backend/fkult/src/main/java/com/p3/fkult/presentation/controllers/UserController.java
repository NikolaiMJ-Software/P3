package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.UserService;
import com.p3.fkult.persistence.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

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
        return user.getAdmin();
    }

    @PostMapping("/admin/{username}")
    public ResponseEntity<?> changeAdminValueOfUser(@PathVariable String username, @RequestParam String newAdmin, @RequestParam int status) {
        if (checkForAdminUser(username) == 0) return ResponseEntity.status(403).body("User not admin");
        if ((Objects.equals(newAdmin, "topholt") || Objects.equals(newAdmin, "root") || Objects.equals(newAdmin, username)) && status == 0) return ResponseEntity.status(403).body("User can not be unadmin");

        return userService.postAdminUser(newAdmin, status);
    }

    @PostMapping("/admin/ban_user")
    public ResponseEntity<?> banUser(@RequestBody List<String> body){
        if (body == null || body.get(0) == null || body.get(1) == null) return ResponseEntity.badRequest().build();
        if (checkForAdminUser(body.getFirst()) == 0) return ResponseEntity.status(403).body("User not admin");

        return userService.postUserBan(body.get(1), 1);
    }

    @PostMapping("/admin/unban_user")
    public ResponseEntity<?> unbanUser(@RequestBody List<String> body){
        if (body == null || body.get(0) == null || body.get(1) == null) return ResponseEntity.badRequest().build();
        if (checkForAdminUser(body.getFirst()) == 0) return ResponseEntity.status(403).body("User not admin");

        return userService.postUserBan(body.get(1), 0);
    }

    @GetMapping("/id/{username}")
    public long getUserIdByUsername(@PathVariable String username){
        return userService.getUserIdByUsername(username);
    }

    @GetMapping("/full_name/{id}")
    public String getUserNameById(@PathVariable long id){
        return userService.getUserNameById(id);
    }
}
