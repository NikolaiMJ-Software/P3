package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.UserService;
import com.p3.fkult.persistence.entities.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
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
    public ResponseEntity<?> changeAdminValueOfUser(@PathVariable String username, @RequestParam int status) {
        return userService.postAdminUser(username, status);
    }

    @PostMapping("/admin/ban_user")
    public ResponseEntity<?> banUser(@RequestBody List<String> body){
        if (body == null || body.get(0) == null || body.get(1) == null) return ResponseEntity.badRequest().build();
        if (checkForAdminUser(body.getFirst()) == 0) return ResponseEntity.status(403).body("user not admin");

        return userService.postUserBan(body.get(1), 1);
    }

    @PostMapping("/admin/unban_user")
    public ResponseEntity<?> unbanUser(@RequestBody List<String> body){
        if (body == null || body.get(0) == null || body.get(1) == null) return ResponseEntity.badRequest().build();
        if (checkForAdminUser(body.getFirst()) == 0) return ResponseEntity.status(403).body("user not admin");

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

    public static class ThemeRequest {
        private Long themeId;
        private String name;
        private Long userId;
        private List<Long> movieIds;
        private List<String> drinkingRules;
        private List<String> tConsts;
        private String username;
        private LocalDateTime timestamp;
        //Springboot requires a default constructor to deserialize using @RequestBody on endpoints
        public ThemeRequest(){}

        public ThemeRequest(Long themeId, String name, Long userId, List<Long> movieIds, List<String> drinkingRules){
            this.themeId = themeId;
            this.name = name;
            this.userId = userId;
            this.movieIds = movieIds;
            this.drinkingRules = drinkingRules;
        }
        public ThemeRequest(List<String> tConsts, Long themeId, String name, String username, List<String> drinkingRules){
            this.themeId = themeId;
            this.name = name;
            this.username = username;
            this.tConsts = tConsts;
            this.drinkingRules = drinkingRules;
        }

        public ThemeRequest(String name, String username, List<String> tConsts, List<String> drinkingRules){
            this.name = name;
            this.username = username;
            this.tConsts = tConsts;
            this.drinkingRules = drinkingRules;
        }
        public ThemeRequest(Long themeId, String name, Long userId, List<Long> movieIds, List<String> drinkingRules, LocalDateTime timestamp) {
            this.themeId = themeId;
            this.name = name;
            this.userId = userId;
            this.movieIds = movieIds;
            this.drinkingRules = drinkingRules;
            this.timestamp = timestamp;
        }
        public ThemeRequest(Long themeId, String name, String username, Long userId, List<Long> movieIds, List<String> drinkingRules, LocalDateTime timestamp) {
            this.themeId = themeId;
            this.name = name;
            this.username = username;
            this.userId = userId;
            this.movieIds = movieIds;
            this.drinkingRules = drinkingRules;
            this.timestamp = timestamp;
        }

        //getters
        public Long getThemeId(){
            return themeId;
        }
        public String getName() { return name; }
        public Long getUserId() { return userId; }
        public List<Long> getMovieIds() { return movieIds; }
        public List<String> getDrinkingRules() { return drinkingRules; }
        public List<String> gettConsts() { return tConsts; }
        public String getUsername(){ return username; }
        public LocalDateTime getTimestamp() { return timestamp; }

        //setters
        public void setName(String name) { this.name = name; }
        public void setUserId(Long userId) { this.userId = userId; }
        public void setMovieIds(List<Long> movieIds) { this.movieIds = movieIds; }
        public void setDrinkingRules(List<String> rules) { this.drinkingRules = rules; }
        public void settConsts(List<String> tConsts) {this.tConsts = tConsts;}
        public void setUsername(String username){this.username = username;}
        public void setTimestamp(LocalDateTime timestamp){this.timestamp = timestamp;}

        @Override
        public String toString() {
            return "ThemeRequest{" +
                    "themeId=" + themeId +
                    ", name='" + name + '\'' +
                    ", userId=" + userId +
                    ", username='" + username + '\'' +
                    ", movieIds=" + (movieIds != null ? movieIds.stream()
                    .map(Object::toString)
                    .collect(Collectors.joining(", ")) : "null") +
                    ", drinkingRules=" + (drinkingRules != null ? String.join(", ", drinkingRules) : "null") +
                    ", tConsts=" + (tConsts != null ? String.join(", ", tConsts) : "null") +
                    ", timestamp=" + timestamp +
                    '}';
        }

    }
}
