package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.ExampleMessage;
import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.persistence.repository.ExampleMessageRepository;
import com.p3.fkult.persistence.repository.ThemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThemeService {
    private final ThemeRepository themeRepository;

    public ThemeService(ThemeRepository themeRepository){
        this.themeRepository = themeRepository;
    }
    public List<Theme> getAllThemes() {
        return themeRepository.findAll();
    }
    public Theme saveTheme(String name, Long userid){
        return themeRepository.save(new Theme(name, userid));
    }
}
