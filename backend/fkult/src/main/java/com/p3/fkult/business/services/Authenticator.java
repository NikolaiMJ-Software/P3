package com.p3.fkult.business.services;

import com.p3.fkult.persistence.repository.AuthRepository;
import com.p3.fkult.persistence.repository.AuthRepository.MemberInfo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class Authenticator {

    private final AuthRepository authRepo;

    public Authenticator(AuthRepository authRepo) {
        this.authRepo = authRepo;
    }

    //return true if user is found or inserted, otherwise return false
    @Transactional
    public boolean receiveUsername(String username) {
        System.out.println("Authenticator got username: " + username);

        if (authRepo.userExistsLocally(username)) {
            System.out.println("User exists: true (local DB)");
            return true;
        }

        Integer memberId = authRepo.fetchMemberId(username);
        if (memberId == null) {
            System.out.println("User exists: false");
            return false;
        }

        MemberInfo memberInfo = authRepo.fetchMemberInfo(memberId);
        if (memberInfo == null) {
            System.out.println("User exists (remote ID), but failed to fetch member info → insert failure");
            return false;
        }

        String storeUsername = (memberInfo.username != null && !memberInfo.username.isBlank()) ? memberInfo.username : username;
        String storeName     = memberInfo.name;

        try {
            int rows = authRepo.insertUser(storeName, storeUsername);
            if (rows == 1) {
                System.out.println("Insert success: user={" + storeUsername + ", name=" + storeName + "}");
                return true;
            } else {
                System.out.println("Insert failure: no rows inserted");
                return false;
            }
        } catch (Exception e) {
            System.out.println("Insert failure: " + e.getMessage());
            return false;
        }
    }
}






