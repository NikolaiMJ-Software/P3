package com.p3.fkult.ThemeTests;

import static org.junit.jupiter.api.Assertions.assertAll;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.presentation.DTOs.ThemeRequest; 


public class ThemeRequestTest {
    


    @Test
    void testThemeRequestCreation() {
        // Arrange
        String name = "Test Theme";
        Long userId = 1L;
        Long themeId = 1L;
        List<Long> movieIds = List.of(101L, 102L, 103L);


        // Act
        ThemeRequest themeRequest = new ThemeRequest(themeId, name, userId, movieIds, List.of("Rule 1", "Rule 2"), null);

        // Assert
        assert(themeRequest.getName().equals(name));
        assert(themeRequest.getUserId().equals(userId));
        assert(themeRequest.getThemeId().equals(themeId));
        assert(themeRequest.getMovieIds().equals(movieIds));

    }

    //test getThemeid
    @Test
    void testGetThemeId() {
        // Arrange
        Long themeId = 42L;
        ThemeRequest themeRequest = new ThemeRequest();
        themeRequest = new ThemeRequest(themeId, "Sample Theme", 1L, List.of(1L, 2L), List.of("Rule 1"));

        // Act
        Long retrievedThemeId = themeRequest.getThemeId();

        // Assert
        assert(retrievedThemeId.equals(themeId));
    }


}
