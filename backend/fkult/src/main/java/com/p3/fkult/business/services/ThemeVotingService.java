package com.p3.fkult.business.services;

import java.util.*;
import org.springframework.stereotype.Service;
import com.p3.fkult.presentation.controllers.ThemeRequest;

@Service
public class ThemeVotingService {

    // Download copy of the themes
    private final List<ThemeRequest> themes;
    public ThemeVotingService(ThemeService themeService) {
        this.themes = themeService.getAllThemes();
    }

    // Get shuffled list of themes that avoid repeated user ids
    public List<ThemeRequest> getShuffledThemes() {
        if (themes == null || themes.size() < 2) return themes;

        // Create list of shuffled themes
        List<ThemeRequest> shuffled = new ArrayList<>(themes);
        Collections.shuffle(shuffled);

        // Manages list to avoid repeated user ids
        for (int i = 0; i < shuffled.size() - 1; i++) {
            ThemeRequest current = shuffled.get(i);
            ThemeRequest next = shuffled.get(i + 1);

            // If the next one has the same userId, try to swap with another further ahead
            if (current.getUserId().equals(next.getUserId())) {
                for (int j = i + 2; j < shuffled.size(); j++) {
                    if (!shuffled.get(j).getUserId().equals(current.getUserId())) {
                        // Swap next with j
                        Collections.swap(shuffled, i + 1, j);
                        break;
                    }
                }
            }
        }
        return shuffled;
    }
}