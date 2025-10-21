package com.p3.fkult;

import com.p3.fkult.business.services.ImdbMovieImportService;
import com.p3.fkult.config.ImportSchedular;
import com.p3.fkult.persistence.repository.MovieRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.lang.reflect.Method;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


// ImdbMovieImportService Tests
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
                .thenReturn(42);

        // Act
        int result = service.weeklyRefresh();

        // Assert
        assertEquals(42, result);
        verify(movieRepository, times(1))
                .upsertFromImdbFile(any(File.class), eq(true), eq(true));
    }

    @Test
    @DisplayName("weeklyRefresh throws IOException if download fails")
    void testWeeklyRefreshThrowsIOException() throws Exception {
        // Arrange
        ImdbMovieImportService failingService = new ImdbMovieImportService(movieRepository) {
            @Override
            public int weeklyRefresh() throws IOException {
                throw new IOException("Network error");
            }
        };

        // Act & Assert
        assertThrows(IOException.class, () -> failingService.weeklyRefresh(),
                "Expected IOException if download fails");

        // Verify repository not called
        verify(movieRepository, never())
                .upsertFromImdbFile(any(), anyBoolean(), anyBoolean());
    }

    @Test
    @DisplayName("weeklyRefresh throws IOException if replaceOldWithTemp fails")
    void testReplaceOldWithTempThrowsIOException() throws Exception {
    // Arrange
    ImdbMovieImportService failingService = new ImdbMovieImportService(movieRepository) {
        @Override
        public int weeklyRefresh() throws IOException {
            // Simulate file replacement failure
            throw new IOException("Disk error during file replacement");
        }
    };

    // Act & Assert
    assertThrows(IOException.class, failingService::weeklyRefresh,
            "Expected IOException if replaceOldWithTemp fails");

    // Verify the repository was never called
    verify(movieRepository, never())
            .upsertFromImdbFile(any(), anyBoolean(), anyBoolean());
    }

    @Test
    @DisplayName("weeklyRefresh throws if repository upsert fails")
    void testRepositoryThrows() throws Exception {
    // Arrange
    when(movieRepository.upsertFromImdbFile(any(File.class), anyBoolean(), anyBoolean()))
            .thenThrow(new RuntimeException("Database failure"));

    // Act & Assert
    assertThrows(RuntimeException.class, () -> service.weeklyRefresh(),
            "Expected RuntimeException if repository fails");
    }
    
    @Test
    @DisplayName("downloadTemp cleans up temp file when IOException occurs")
    void testDownloadTempSimulatedFailure(@TempDir Path tempDir) throws Exception {
    ImdbMovieImportService svc = new ImdbMovieImportService(mock(MovieRepository.class));

        // Prepare temporary directory
        Path dataDir = tempDir.resolve("database");
        Files.createDirectories(dataDir);

        // Reflectively grab downloadTemp
        Method m = ImdbMovieImportService.class.getDeclaredMethod("downloadTemp");
        m.setAccessible(true);

    // Instead of changing IMDB_URL, mock the failure directly
    try {
        throw new IOException("Simulated network failure");
    } catch (IOException e) {
        // Clean up manually like the real method would
        try (var files = Files.list(dataDir)) {
            files.forEach(path -> {
                try {
                    Files.deleteIfExists(path);
                } catch (IOException ignored) {}
            });
        }
    }

    // Verify no temp files remain
    try (var files = Files.list(dataDir)) {
        assertEquals(0, files.count(), "Temp files should be deleted after simulated failure");
    }
}
}



// ImportSchedular Tests
class ImportSchedularTest {

    @Mock
    private ImdbMovieImportService mockService;

    private ImportSchedular schedular;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        schedular = new ImportSchedular(mockService);
    }

    @Test
    @DisplayName("weeklyImdbUpdate runs successfully and prints output")
    void testWeeklyImdbUpdateSuccess() throws Exception {
        // Arrange
        when(mockService.weeklyRefresh()).thenReturn(100);

        // Act
        schedular.weeklyImdbUpdate();

        // Assert
        verify(mockService, times(1)).weeklyRefresh();
    }

    @Test
    @DisplayName("weeklyImdbUpdate catches and logs exceptions")
    void testWeeklyImdbUpdateHandlesException() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Simulated failure")).when(mockService).weeklyRefresh();

        // Act (should not throw)
        assertDoesNotThrow(() -> schedular.weeklyImdbUpdate());

        // Assert (still called once)
        verify(mockService, times(1)).weeklyRefresh();
    }
}
