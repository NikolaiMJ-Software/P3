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
    public ResponseEntity<?> postAdminUser(String username, int status){
        if (status > 1 || status < 0) return ResponseEntity.status(400).body("Status not applicable: " + status);

        User result = userRepository.updateAdminStatus(username, status);

        if (result.getAdmin() == status) return ResponseEntity.ok("User updated successfully");
        else return ResponseEntity.status(500).body("User not correctly updated");
    }

    public ResponseEntity<?> postUserBan(String username, int status){
        User user = getUser(username);
        if (user.getId() < 0) {
            //get user from fklub

            return ResponseEntity.status(403).body("user does not exist");
        }
        if (user.getBanned() == status) return ResponseEntity.ok("User already " + ((status == 1) ? "banned" : "unbanned"));
        User result = userRepository.updateUserBanStatus(username, status);
        if (result.getBanned() == status) return ResponseEntity.ok("User successfully " + ((status == 1) ? "banned" : "unbanned"));
        else return ResponseEntity.status(500).body("User not correctly updated");
    }


    public long getUserIdByUsername(String username){
        return userRepository.findIdByUsername(username);
    }

    public boolean getIfUserBanned(String username){
        return userRepository.findIfUserBanned(username);
    }

}