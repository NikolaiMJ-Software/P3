package com.p3.fkult;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.IOException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import com.p3.fkult.presentation.controllers.RateLimitingFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;

public class RateLimitFilterTest {

    private RateLimitingFilter filter;
    
    @BeforeEach
    void setUp() {
        filter = new RateLimitingFilter();
    }

    // Default endpoint (limit 3)
    @Test
    void defaultWithinLimit() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (req, res) -> {}; // Dummy chain

        request.setRemoteAddr("127.0.0.1");
        request.setRequestURI("/default");

        for (int i = 0; i < 100; i++) {
            response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertEquals(200, response.getStatus());
        }
    }

    @Test
    void defaultOverLimit() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (req, res) -> {}; // Dummy chain

        request.setRemoteAddr("127.0.0.1");
        request.setRequestURI("/default");

        for (int i = 0; i < 101; i++) {
            response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
        }

        assertEquals(429, response.getStatus());
    }

    // /api/themes (limit 101)
    @Test
    void themesWithinLimit() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (req, res) -> {}; // Dummy chain

        request.setRemoteAddr("127.0.0.1");
        request.setRequestURI("/api/themes");

        for (int i = 0; i < 100; i++) {
            response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertEquals(200, response.getStatus());
        }
    }

    @Test
    void themesOverLimit() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (req, res) -> {}; // Dummy chain

        request.setRemoteAddr("127.0.0.1");
        request.setRequestURI("/api/themes");

        for (int i = 0; i < 102; i++) {
            response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
        }

        assertEquals(429, response.getStatus());
    }

    // /api/sound-sample (limit 90)
    @Test
    void soundSampleWithinLimit() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (req, res) -> {}; // Dummy chain

        request.setRemoteAddr("192.0.0.1");
        request.setRequestURI("/api/sound-sample");

        for (int i = 0; i < 90; i++) {
            response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
            assertEquals(200, response.getStatus());
        }
    }

    @Test
    void soundSampleOverLimit() throws IOException, ServletException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        FilterChain chain = (req, res) -> {}; // Dummy chain

        request.setRemoteAddr("192.0.0.1");
        request.setRequestURI("/api/sound-sample");

        for (int i = 0; i < 91; i++) {
            response = new MockHttpServletResponse();
            filter.doFilter(request, response, chain);
        }

        assertEquals(429, response.getStatus());
    }
}
