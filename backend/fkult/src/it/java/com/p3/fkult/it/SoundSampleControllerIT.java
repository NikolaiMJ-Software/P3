package com.p3.fkult.it;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SoundSampleControllerIT {
    
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;

    private static final String UPLOAD_DIR = "soundSampleUploads";
    private static final String UPLOAD_FILENAME = "test.wav";

    @BeforeAll
    static void ensureUploadDir(){
        new File(UPLOAD_DIR).mkdir();
    }

    @AfterAll
    static void cleanup() throws Exception {
        Files.deleteIfExists(Path.of(UPLOAD_DIR, UPLOAD_FILENAME));
    }

    @Test
    @Order(1)
    void getAll() throws Exception{
        mvc.perform(get("/api/sound-sample/get-all")).andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(content().string(containsString("example.com/sample.mp3")));
    }

    @Test
    @Order(2)
    void uploadLink() throws Exception{
        String json = """
            {"link":"https://example.com/random.mp3", "userId":2}
        """;

        MockMultipartFile soundSampleJson = new MockMultipartFile("soundSample", "", "application/json", json.getBytes());

        mvc.perform(multipart("/api/sound-sample/upload").file(soundSampleJson))
        .andExpect(status().isOk()).andExpect(content().string("Upload complete!"));
    }

    @Test
    @Order(3)
    void uploadFile() throws Exception {
        byte[] bytes = "RIF----WAVEfmt ".getBytes();

        MockMultipartFile file = new MockMultipartFile("file",UPLOAD_FILENAME, "audio/wav", bytes);

        String json = """
                {"userId":2}
                """;
        
        MockMultipartFile soundSamleJson = new MockMultipartFile("soundSample", "", "application/json", json.getBytes());

        mvc.perform(multipart("/api/sound-sample/upload").file(file).file(soundSamleJson))
        .andExpect(status().isOk()).andExpect(content().string(containsString("Upload complete!")));

        Assertions.assertTrue(Files.exists(Path.of(UPLOAD_DIR, UPLOAD_FILENAME)), "Uploaded file should be written to " + UPLOAD_DIR);
    }

    @Test
    @Order(4)
    void deleteByFileName() throws Exception {
        MockMultipartFile fileName = new MockMultipartFile("fileName", "", "text/plain", UPLOAD_FILENAME.getBytes());

        mvc.perform(multipart("/api/sound-sample/delete").file(fileName).with(req -> {req.setMethod("DELETE"); return req;}))
        .andExpect(status().isOk()).andExpect(content().string(notNullValue()));

        Assertions.assertFalse(Files.exists(Path.of(UPLOAD_DIR, UPLOAD_FILENAME)), "File should be deleted by the service before DB deletion");
    }

    @Test
    @Order(5)
    void deleteMissingValue() throws Exception {
        mvc.perform(multipart("/api/sound-sample/delete").with(req -> {req.setMethod("DELETE"); return req;}))
        .andExpect(status().isOk()).andExpect(content().string(containsString("No link or file")));
    }

    @Test
    @Order(6)
    void getAllWhenQuickAndWeightedTrue() throws Exception{
        mvc.perform(get("/api/sound-sample/get-all").param("quick","true").param("weighted","true"))
        .andExpect(status().isOk()).andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(content().string(containsString("[]")));
    }

    @Test
    @Order(7)
    void downloadFileWhenExists() throws Exception{
        Files.write(Path.of(UPLOAD_DIR, UPLOAD_FILENAME), "beep".getBytes());

        mvc.perform(get("/api/sound-sample/download").param("filePath", UPLOAD_FILENAME))
        .andExpect(status().isOk()).andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(content().string(containsString(UPLOAD_FILENAME)));

    }
}
