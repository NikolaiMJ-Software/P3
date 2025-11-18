package com.p3.fkult.ThemeTests;

import org.junit.jupiter.api.Test;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import com.p3.fkult.persistence.entities.Theme;
import com.p3.fkult.persistence.repository.ThemeRepository;
import org.junit.jupiter.api.BeforeEach;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ThemeRepositoryTest {

    private ThemeRepository themeRepository;

    @Mock
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        themeRepository  = new ThemeRepository(jdbcTemplate);
    }

    @Test
    void findall_returns(){
        //arrange
        Theme t1 = new Theme(1L, "themeA", 5L, LocalDateTime.now(),0);
        Theme t2 = new Theme(2L, "themeB", 6L, LocalDateTime.now(),0);
        List<Theme> expectedThemes = List.of(t1, t2);

        when(jdbcTemplate.query(eq("SELECT * FROM theme"), any(RowMapper.class))).thenReturn(List.of(t1,t2));

        //act
        List<Theme> result = themeRepository.findAll();

        //assert
        assertThat(result).containsExactly(t1,t2);
        verify(jdbcTemplate).query(eq("SELECT * FROM theme"), any(RowMapper.class));
    }

    //find by ID/*
    @Test
    void findById_returnsTheme(){
        //arrange
        Theme theme = new Theme(1L, "test", 5L, LocalDateTime.now(),0);

        when(jdbcTemplate.queryForObject(eq("SELECT * FROM theme WHERE id = ?"), any(RowMapper.class), eq(1L))).thenReturn(theme);

        //act
        Theme result = themeRepository.findById(1L);

        //assert
        assertThat(result).isEqualTo(theme);

    }

    @Test
    void findById_returnsNull_notFound (){
        //arrange
        when(jdbcTemplate.queryForObject(any(), any(RowMapper.class), any())).thenThrow(new EmptyResultDataAccessException(1));

        //act
        Theme result = themeRepository.findById(125L);

        //assert
        assertThat(result).isNull();

    }
}
