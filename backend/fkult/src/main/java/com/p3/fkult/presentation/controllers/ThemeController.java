package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.ExampleMessageService;
import com.p3.fkult.business.services.ThemeService;
import com.p3.fkult.persistence.entities.ExampleMessage;
import com.p3.fkult.persistence.entities.Theme;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/themes")
public class ThemeController {

    private final ThemeService themeService;

    public ThemeController(ThemeService themeService) {
        this.themeService = themeService;
    }

    @GetMapping
    public List<ThemeRequest> getThemes(){
        return themeService.getAllThemes();
    }

    @PostMapping
    public ResponseEntity<String> createTheme(@RequestBody ThemeRequest themeRequest) {
        if (    themeRequest.getName() == null ||
                themeRequest.getName().isBlank() ||
                themeRequest.gettConsts() == null ||
                themeRequest.gettConsts().isEmpty())
        {
            return ResponseEntity.badRequest().body("Theme data not accepted please ensure there is a title and at least one tConst" + themeRequest.toString());
        }
        themeService.createThemeWithTConsts(themeRequest);
        return ResponseEntity.ok("Theme created successfully");
    }
}