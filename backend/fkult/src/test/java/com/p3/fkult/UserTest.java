package com.p3.fkult;

import com.p3.fkult.business.services.UserService;
import com.p3.fkult.persistence.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class UserTest {

    @Mock
    private UserRepository userRepository;
    private UserService userService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository);
    }

}
