package com.p3.fkult.presentation.controllers;

import com.p3.fkult.business.services.ThemeVotingService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/vote")
public class ThemeVotingController {

    // Download copy of ThemeVotingService to use its functions
    private final ThemeVotingService themeVotingService;
    public ThemeVotingController(ThemeVotingService themeVotingService) {
        this.themeVotingService = themeVotingService;
    }

    // Get all theme data
    @GetMapping("/getThemes")
    public List<ThemeRequest> getThemes() {
        return themeVotingService.getThemes();
    }
}