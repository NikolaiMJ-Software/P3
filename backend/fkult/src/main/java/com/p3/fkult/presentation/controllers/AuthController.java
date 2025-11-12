package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.Authenticator;
import com.p3.fkult.business.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

record UsernameDTO(String username) {}

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final Authenticator auth;
    private final UserService user;

    public AuthController(Authenticator auth, UserService user) { 
        this.auth = auth; 
        this.user = user;
    }

    @PostMapping("/username")
    public ResponseEntity<String> sendUsername(@RequestBody UsernameDTO body) {
        boolean exists = auth.receiveUsername(body.username());
        if (exists) {
            boolean banned = user.getIfUserBanned(body.username());
            if(!banned){
                return ResponseEntity.ok("Login successful");
            }else
            {
                return ResponseEntity.status(404).body("Your Banned Bozo!");
            }
        } else {
            // return a body so the frontend can display it
            return ResponseEntity.status(404).body("Username does not exist");
        }
    }
}




