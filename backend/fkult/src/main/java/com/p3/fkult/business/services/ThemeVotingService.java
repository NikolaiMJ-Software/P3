package com.p3.fkult.business.services;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.p3.fkult.presentation.controllers.ThemeRequest;

@Service
public class ThemeVotingService {

    // Download copy of the themes
    private final List<ThemeRequest> themes;
    public ThemeVotingService(ThemeService themeService) {
        this.themes = themeService.getAllThemes();
    }

    // Get shuffled list of themes to avoid repeated presenters
    public List<ThemeRequest> getShuffledThemes() {

        // Returns basic list of themes if shuffling is ineffective
        if (themes == null || themes.size() < 2) return themes;

        // Group themes by userId
        Map<Long, Queue<ThemeRequest>> grouped = themes.stream().collect(Collectors.groupingBy(
            ThemeRequest::getUserId,
            Collectors.toCollection(LinkedList::new)
        ));

        List<ThemeRequest> shuffled = new ArrayList<>();
        Long lastUserId = null;

        while (!grouped.isEmpty()) {
            Long chosenUserId = null;

            // Find a user that is not the same as the last one
            for (Long userId : grouped.keySet()) {
                if (!userId.equals(lastUserId)) {
                    chosenUserId = userId;
                    break;
                }
            }

            // If all remaining are same user, pick the first
            if (chosenUserId == null) {
                chosenUserId = grouped.keySet().iterator().next();
            }

            Queue<ThemeRequest> queue = grouped.get(chosenUserId);
            shuffled.add(queue.poll());
            lastUserId = chosenUserId;

            if (queue.isEmpty()) grouped.remove(chosenUserId);
        }

        // Replace old order with new one
        return shuffled;
    }
}
