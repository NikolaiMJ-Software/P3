package com.p3.fkult.it;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.p3.fkult.persistence.repository.EventRepository;

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
public class EventControllerIT {
    
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper om;
    @Autowired EventRepository eventRepo;

    // helper to serialize objects to JSON
    private String json(Object o) throws Exception { return om.writeValueAsString(o); }

    @Test
    @Order(1)
    void getAll() throws Exception {
        mvc.perform(get("/api/event/all")).andExpect(status().isOk());
    }
}
