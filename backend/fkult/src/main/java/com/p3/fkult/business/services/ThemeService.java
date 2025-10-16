package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.DrinkingRule;
import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.persistence.entities.ThemeMovie;
import com.p3.fkult.persistence.repository.*;
import com.p3.fkult.presentation.controllers.ThemeRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ThemeService {
    private final ThemeRepository themeRepository;
    private final MovieRepository movieRepository;
    private final DrinkingRuleRepository drinkingRuleRepository;
    private final ThemeMovieRepository themeMovieRepository;

    public ThemeService(ThemeRepository themeRepository, MovieRepository movieRepository, DrinkingRuleRepository drinkingRuleRepository, ThemeMovieRepository themeMovieRepository){
        this.themeRepository = themeRepository;
        this.movieRepository = movieRepository;
        this.drinkingRuleRepository = drinkingRuleRepository;
        this.themeMovieRepository = themeMovieRepository;
    }
    public List<Theme> getAllThemes() {
        return themeRepository.findAll();
    }

    @Transactional
    public void createTheme(ThemeRequest themeRequest){
        //two birds one stone ahh line. assigns themeid AND saves theme to database
        long themeId = themeRepository.save(new Theme(themeRequest.getName(), themeRequest.getUserId())).getId();

        List<ThemeMovie> themeMovies = themeRequest.getMovieIds().stream()
                        .map(movieId -> new ThemeMovie(themeId, movieId)).toList();
        themeMovies.forEach(themeMovie -> themeMovieRepository.save(themeMovie));

        themeRequest.getRules().forEach(ruleText ->
                drinkingRuleRepository.save(new DrinkingRule(themeId, ruleText)));
    }
}
