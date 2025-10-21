package com.p3.fkult;

import com.p3.fkult.business.services.ImdbMovieImportService;
import com.p3.fkult.persistence.repository.MovieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ImdbMovieImportServiceTest {

    @Mock
    private MovieRepository movieRepository;

    private ImdbMovieImportService service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        service = new ImdbMovieImportService(movieRepository);
    }

    @Test
    @DisplayName("weeklyRefresh calls repository and returns expected result")
    void testWeeklyRefresh() throws Exception {
        // Arrange
        when(movieRepository.upsertFromImdbFile(any(File.class), eq(true), eq(true)))
                .thenReturn(42); // simulate DB upsert returning 42 rows updated

        // Act
        int result = service.weeklyRefresh();

        // Assert
        assertEquals(42, result);
        verify(movieRepository, times(1))
                .upsertFromImdbFile(any(File.class), eq(true), eq(true));
    }

    @Test
    @DisplayName("weeklyRefresh throws IOException when download fails")
    void testWeeklyRefreshThrowsIOException() throws IOException {
        // spy the service to force downloadTemp() to fail
        ImdbMovieImportService spyService = spy(service);
        doThrow(new IOException("Network error")).when(spyService).weeklyRefresh();

        // Assert
        assertThrows(IOException.class, spyService::weeklyRefresh);
        verify(movieRepository, never()).upsertFromImdbFile(any(), anyBoolean(), anyBoolean());
    }


}
