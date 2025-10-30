package com.p3.fkult.business.services;

import java.util.*;

interface HasUserId {
    Long getUserId();
    String getName();
    void setUserCount(double count);
    double getUserCount();
}

class User implements HasUserId {
    Long userId;
    double userCount;
    String name;

    User(Long userId, String name) {
        this.userId = userId;
        this.userCount = 1;
        this.name = name;
    }

    @Override
    public Long getUserId() {
        return userId;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setUserCount(double count) {
        this.userCount = count;
    }

    @Override
    public double getUserCount() {
        return userCount;
    }
}

// Requre at least an array containing an object called: "userId"
public class ShuffleFilter {

    public static <T extends HasUserId> List<T> weightedShuffle(List<T> list) {
        System.out.println("Starting weighted shuffle filter...");

        List<T> copy = new ArrayList<>(list);
        List<T> shuffledList = new ArrayList<>();

        // Count number of users
        Map<Long, Integer> totalUsers = new HashMap<>();

        // Count how many times each user appears
        for (T item : copy) {
            totalUsers.put(item.getUserId(), totalUsers.getOrDefault(item.getUserId(), 0) + 1);
        }
        double counter = copy.size();
        
        // Calc the weight [%] a user represent
        List<T> uniqueUsers = new ArrayList<>();
        Set<Long> added = new HashSet<>();
        for (T item : copy) {
            if (!added.contains(item.getUserId())) {
                double weight = totalUsers.get(item.getUserId()) / counter * 10000;
                item.setUserCount(weight);
                uniqueUsers.add(item);
                added.add(item.getUserId());
            }
        }

        // Start random number generater between 0 - 10000 and find winner
        Random r = new Random();
        while (totalUsers.size() > 1) {
            int rNumber = r.nextInt(10000);
            double cumulative = 0.0;
            
            for (T u : uniqueUsers) {
                cumulative += u.getUserCount();

                if (rNumber < cumulative && totalUsers.get(u.getUserId()) > 0) {
                    // Find userId corresponding to the first of its entries
                    for (T j: copy) {
                        if (u.getUserId().equals(j.getUserId())) {
                            shuffledList.add(j);
                            copy.remove(j);

                            // Subtract/delete a userId count, to prevent searching for users entries when it has no left
                            int totalUserCount = totalUsers.get(u.getUserId());
                            if (totalUserCount != 1) {
                                totalUsers.put(u.getUserId(), totalUserCount - 1);
                            } else {
                                totalUsers.remove(u.getUserId());
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        // Inserting the rest
        System.out.println("and inserting leftovers");
        for (T j: copy) {
            shuffledList.add(j);
        }

        System.out.println("Done");
        return shuffledList;
    }

    // Quick shuffle
    public static <T> List<T> quickShuffle(List<T> list) {
        System.out.println("Starting quick shuffle filter...");
        List<T> copy = new ArrayList<>(list);
        Collections.shuffle(copy);
        System.out.println("Done");
        return copy;
    }
}