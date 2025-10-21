package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.Authenticator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

record UsernameDTO(String username) {}

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final Authenticator auth;
    public AuthController(Authenticator auth) { this.auth = auth; }

    @PostMapping("/username")
    public ResponseEntity<String> sendUsername(@RequestBody UsernameDTO body) {
        boolean exists = auth.receiveUsername(body.username());
        if (exists) {
            return ResponseEntity.ok("Login successful");
        } else {
            // return a body so the frontend can display it
            return ResponseEntity.status(404).body("Username does not exist");
        }
    }
}




