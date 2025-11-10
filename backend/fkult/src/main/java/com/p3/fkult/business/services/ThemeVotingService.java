package com.p3.fkult.business.services;

import java.util.*;
import org.springframework.stereotype.Service;
import com.p3.fkult.presentation.controllers.ThemeRequest;
import com.p3.fkult.persistence.repository.ThemeRepository;

@Service
public class ThemeVotingService {

    // Download copy of ThemeService to utilize its functions
    private final ThemeRepository themeRepository;
    private final ThemeService themeService;
    public ThemeVotingService(ThemeService themeService, ThemeRepository themeRepository) {
        this.themeService = themeService;
        this.themeRepository = themeRepository;
    }

    // Get shuffled list of themes that avoid repeated user ids
    public List<ThemeRequest> getShuffledThemes() {
        List<ThemeRequest> themes = themeService.getAllThemes();
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

    
    // Updates the votes of a theme based on the id
    public String UpdateVote(long id, long votes) {
        try{
            themeRepository.setVote(id, votes);
            return "Set votes for theme " + id + " to: " + votes;
        } catch (Exception error) {
            return "failed to update votes for id " + id + " due to error: " + error;
        }
    }
}