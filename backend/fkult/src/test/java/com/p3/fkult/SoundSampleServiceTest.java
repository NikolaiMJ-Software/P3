package com.p3.fkult;

import com.p3.fkult.business.services.SoundSampleService;
import com.p3.fkult.persistence.entities.SoundSample;
import com.p3.fkult.persistence.repository.SoundSampleRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class SoundSampleServiceTest {

    @Mock
    private SoundSampleRepository repository;
    private SoundSampleService service;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        service = new SoundSampleService(repository);
    }

    @Test
    @DisplayName("Upload soundsample with a link")
    void testUploadSoundSampleWithLink() throws Exception {

        // Arrange
        String link = "http://example.com/sample";
        String userId = "1";
        String json = String.format("{\"link\":\"%s\",\"filePath\":null,\"userId\":\"%s\"}", link, userId);

        // Act
        String response = service.upload(null, json);

        // Assert
        assertEquals("Upload complete!", response);
        verify(repository, times(1)).save(any(SoundSample.class));
    }

    @Test
    @DisplayName("Upload soundsample with a file")
    void testUploadSoundSampleWithFile() throws Exception {

        // Arrange
        String userId = "1";
        String json = String.format("{\"link\":\"null\",\"filePath\":null,\"userId\":\"%s\"}", userId);
        MockMultipartFile file = new MockMultipartFile(
            "file", // Data type
            "sample.mp3", // Original file name
            "audio/mpeg", // Content type
            "dummy content".getBytes() // File content
        );

        // Act
        String response = service.upload(file, json);

        // Assert
        assertEquals("Upload complete!", response);
        verify(repository, times(1)).save(any(SoundSample.class));
    }

    @Test
    @DisplayName("Upload a soundsample with no data")
    void testUploadSoundSampleWithNoData() throws Exception {

        // Arrange
        String userId = "1";
        String json = String.format("{\"link\":null,\"filePath\":null,\"userId\":\"%s\"}", userId);

        // Act
        String response = service.upload(null, json);

        // Assert
        assertEquals("Upload failed: either link or file must be provided for upload", response);
        verify(repository, times(1)).save(any(SoundSample.class));
    }
}