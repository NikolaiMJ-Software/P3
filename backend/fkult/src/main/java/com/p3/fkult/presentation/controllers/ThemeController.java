package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.ExampleMessageService;
import com.p3.fkult.business.services.ThemeService;
import com.p3.fkult.business.services.UserService;
import com.p3.fkult.persistence.entities.ExampleMessage;
import com.p3.fkult.persistence.entities.Theme;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/themes")
public class ThemeController {

    private final ThemeService themeService;
    private final UserService userService;

    public ThemeController(ThemeService themeService, UserService userService) {
        this.themeService = themeService;
        this.userService = userService;
    }

    @GetMapping
    public List<ThemeRequest> getThemes(){
        return themeService.getAllThemes();
    }

    @PostMapping
    public ResponseEntity<String> createTheme(@RequestBody ThemeRequest themeRequest){
        String name = themeRequest.getName();
        String username = themeRequest.getUsername();
        List<String> tConsts = themeRequest.gettConsts();
        List<String> drinkingRules = themeRequest.getDrinkingRules();
        if (name == null || name.trim().isBlank() || tConsts.isEmpty() ||username == null || username.trim().isEmpty())
        {
            return ResponseEntity.badRequest().body("Theme data not accepted please ensure there is a title, username and at least one movie");
        }
        if (userService.getIfUserBanned(username)){
            ResponseEntity.badRequest().body("Theme data not accepted as user is banned");
        }
        /*
        //check if user even exists and fail them if they do not exist
        if (){
            ResponseEntity.badRequest().body("Theme data not accepted as user doesn't exist");
        }
        */
        themeService.createThemeWithTConsts(themeRequest);
        return ResponseEntity.ok("Theme created successfully");
    }
}