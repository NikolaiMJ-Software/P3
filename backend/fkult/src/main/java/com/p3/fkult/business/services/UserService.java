package com.p3.fkult.business.services;

import com.p3.fkult.persistence.entities.User;
import com.p3.fkult.persistence.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public User getUser(String username){
        return userRepository.findUser(username);
    }
    public void postAdminUser(String username){
        userRepository.updateAdminStatus(username);
    }

    public ResponseEntity<?> postUserBan(String username, int status){
        return userRepository.updateUserBanStatus(username, status);
    }


    public long getUserIdByUsername(String username){
        return userRepository.findIdByUsername(username);
    }

}