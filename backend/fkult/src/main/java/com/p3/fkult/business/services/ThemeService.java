package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.DrinkingRule;
import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.persistence.entities.ThemeMovie;
import com.p3.fkult.persistence.repository.*;
import com.p3.fkult.presentation.controllers.ThemeRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
public class ThemeService {
    private final ThemeRepository themeRepository;
    private final MovieRepository movieRepository;
    private final DrinkingRuleRepository drinkingRuleRepository;
    private final ThemeMovieRepository themeMovieRepository;
    private final UserRepository userRepository;

    public ThemeService(ThemeRepository themeRepository, MovieRepository movieRepository, DrinkingRuleRepository drinkingRuleRepository, ThemeMovieRepository themeMovieRepository, UserRepository userRepository){
        this.themeRepository = themeRepository;
        this.movieRepository = movieRepository;
        this.drinkingRuleRepository = drinkingRuleRepository;
        this.themeMovieRepository = themeMovieRepository;
        this.userRepository = userRepository;
    }
    public List<ThemeRequest> getAllThemes() {
        List<ThemeRequest> themeRequests = new ArrayList<>();
        List<Theme> themes =  themeRepository.findAll();
        for(Theme theme : themes) {
            //constructing a themeRequest one by one
            String name = theme.getName();
            Long userId = theme.getUserid();
            List<Long> movieIds = themeMovieRepository.findByThemeId(theme.getId())
                    .stream()
                    .map(ThemeMovie::getMovieid)
                    .toList();
            List<String> drinkingRules = drinkingRuleRepository.findByThemeId(theme.getId())
                    .stream()
                    .map(DrinkingRule::getRuleText)
                    .toList();
            ThemeRequest themeRequest = new ThemeRequest(theme.getId(),  name, userId, movieIds, drinkingRules);
            themeRequests.add(themeRequest);
        };
        System.out.println("Found themes: " + themes.size());
        return themeRequests;
    }

    @Transactional
    public void createTheme(ThemeRequest themeRequest){
        //two birds one stone ahh line. assigns themeid AND saves theme to database
        long themeId = themeRepository.save(new Theme(themeRequest.getName(), themeRequest.getUserId())).getId();

        List<ThemeMovie> themeMovies = themeRequest.getMovieIds().stream()
                        .map(movieId -> new ThemeMovie(themeId, movieId)).toList();
        themeMovies.forEach(themeMovie -> themeMovieRepository.save(themeMovie));

        themeRequest.getDrinkingRules().forEach(ruleText ->
                drinkingRuleRepository.save(new DrinkingRule(themeId, ruleText)));
    }

    @Transactional
    public void createThemeWithTConsts(ThemeRequest themeRequest){
        Long userId = userRepository.findUser(themeRequest.getUsername()).getId();
        long themeId = themeRepository.save(new Theme(themeRequest.getName(), userId)).getId();

        List<Long> movieIds = themeRequest.gettConsts().stream().map(
                tConst -> movieRepository.findByTconst(tConst).getId()
        ).toList();

        List<ThemeMovie> themeMovies = movieIds
                .stream()
                .map(movieId -> new ThemeMovie(themeId,movieId))
                .toList();
        themeMovies.forEach(themeMovie -> themeMovieRepository.save(themeMovie));
        if (!(themeRequest.getDrinkingRules() == null)){
            themeRequest.getDrinkingRules().forEach(ruleText ->
                    drinkingRuleRepository.save(new DrinkingRule(themeId,ruleText)));
        }
    }
}
