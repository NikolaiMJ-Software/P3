package com.p3.fkult;

import org.junit.jupiter.api.DisplayName;
import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import com.p3.fkult.testTemplate.GreetingController;
import com.p3.fkult.testTemplate.calculator;

@WebMvcTest(GreetingController.class)
class GreetingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void helloShouldReturnDefaultMessage() throws Exception {
        mockMvc.perform(get("/hello"))
               .andExpect(status().isOk())
               .andExpect(content().string(containsString("Hello, World")));
    }
}


@SpringBootTest
public class CalculatorUnitTest {

    @Test
    @DisplayName("det er 7 bro")
    void testAddition() {
        calculator calc = new calculator();
        assertEquals(7, calc.add(3, 4));
    }

    @Test
    @DisplayName("det bare 1")
    void testSubtraction() {
        calculator calc = new calculator();
        assertEquals(1, calc.subtract(4, 3));
    }

    @Test
    void testDivisionByZeroThrows() {
        calculator calc = new calculator();
        assertThrows(IllegalArgumentException.class, () -> calc.divide(5, 0));
    }
}