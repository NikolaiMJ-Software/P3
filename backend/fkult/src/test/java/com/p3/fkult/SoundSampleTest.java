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
import java.io.File;
import java.nio.file.Files;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class SoundSampleTest {

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
        Long userId = 1l;
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
        Long userId = 1l;
        String json = String.format("{\"link\":\"null\",\"filePath\":null,\"userId\":\"%s\"}", userId);
        MockMultipartFile file = new MockMultipartFile(
            "file", // Data type
            "sample.mp3", // Original file name
            "audio/mpeg", // Content type
            "dummy content".getBytes() // File content
        );
        File uploadedFile = new File("soundSampleUploads/sample.mp3");

        try {
        // Act
        String response = service.upload(file, json);

        // Assert
        assertEquals("Upload complete!", response);
        verify(repository, times(1)).save(any(SoundSample.class));
        assertTrue(uploadedFile.exists(), "Uploaded file should exist");

    } finally {
        // Cleanup
        if (uploadedFile.exists()) {
            assertTrue(uploadedFile.delete(), "Cleanup: uploaded file deleted");
        }
    }
    }

    @Test
    @DisplayName("Upload a soundsample with no data")
    void testUploadSoundSampleWithNoData() throws Exception {

        // Arrange
        Long userId = 1l;
        String json = String.format("{\"link\":null,\"filePath\":null,\"userId\":\"%s\"}", userId);

        // Act
        String response = service.upload(null, json);

        // Assert
        assertEquals("Upload failed: either link or file must be provided for upload.", response);
        verify(repository, times(0)).save(any(SoundSample.class));
    }

    @Test
    @DisplayName("Delete a valid soundsample from file name")
    void testDeleteValidSoundSampleFromFileName() throws Exception {
        
        // Arrange
        String fileName = "testfile.wav";
        File uploadDir = new File("soundSampleUploads");
        if (!uploadDir.exists()) uploadDir.mkdirs();
        File testFile = new File(uploadDir, fileName);
        Files.writeString(testFile.toPath(), "dummy data");

        // Act
        String response = service.delete(null, fileName);

        // Assert
        assertNull(response, "Service should return null since repository mock returns null");
        assertFalse(testFile.exists(), "File should have been deleted");
        verify(repository, times(1)).delete(isNull(), contains(fileName));
    }

    @Test
    @DisplayName("Try to delete a sound sample from link")
    void testDeleteValidSoundSampleFromLink() throws Exception {

        // Arrange
        String link = "http://example.com/test-sample.mp3";
        when(repository.delete(eq(link), isNull())).thenReturn("Reached database succesfully");

        // Act
        String response = service.delete(link, null);

        // Assert
        assertEquals("Reached database succesfully", response);
        verify(repository, times(1)).delete(eq(link), isNull());
    }

    @Test
    @DisplayName("Delete an invalid sound sample from file name")
    void testDeleteInvalidSoundSampleFromFileName() throws Exception {

        // Arrange
        String invalidFileName = "nonexistent.wav";

        // Act
        String response = service.delete(null, invalidFileName);

        // Assert
        assertTrue(response.contains(invalidFileName + ". Aborting database deletion.")); // Checks last part of string
        verify(repository, times(0)).delete(isNull(), eq(invalidFileName));
    }
}