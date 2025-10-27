package com.p3.fkult.business.services;

import com.p3.fkult.persistence.repository.AuthRepository;
import org.springframework.stereotype.Service;

@Service
public class Authenticator {

    private final AuthRepository authRepo;

    public Authenticator(AuthRepository authRepo) {
        this.authRepo = authRepo;
    }

    //return true if user is found or inserted, otherwise return false
    public boolean receiveUsername(String username) {
        System.out.println("Authenticator got username: " + username);

        if (authRepo.userExistsLocally(username)) return true;

        Integer memberId = authRepo.fetchMemberId(username);
        if (memberId == null) return false;

        AuthRepository.MemberInfo info = authRepo.fetchMemberInfo(memberId);
        if (info == null) return false;

        return upsertLocalUser(info, username);
    }

    @org.springframework.transaction.annotation.Transactional
    protected boolean upsertLocalUser(AuthRepository.MemberInfo memberInfo, String fallback) {
        String user = (memberInfo.username != null && !memberInfo.username.isBlank()) ? memberInfo.username : fallback;
        String name = memberInfo.name;
        int rows = authRepo.upsertUser(name, user);
        return rows == 1; // insert or update counts as 1 with JdbcTemplate
    }
}






