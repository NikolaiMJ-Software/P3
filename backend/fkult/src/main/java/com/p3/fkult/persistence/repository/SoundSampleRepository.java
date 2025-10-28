package com.p3.fkult.persistence.repository;

import com.p3.fkult.persistence.entities.SoundSample;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class SoundSampleRepository {

    // Setup template for database operations
    private final JdbcTemplate jdbcTemplate;
    public SoundSampleRepository(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    // Setup RowMapper to map database rows to SoundSample objects
    private final RowMapper<SoundSample> rowMapper = (rs, rowNum) -> (
        new SoundSample(
            rs.getString("link"),
            rs.getString("file_path"),
            rs.getString("user_id")
        )
    );

    // Get all SoundSamples from the database
    public List<SoundSample> getAll(){
        String sql = "SELECT * FROM sound_sample";
        return jdbcTemplate.query(sql, rowMapper);
    }

    // Save a SoundSample to the database
    public void save(SoundSample soundSample){
        if(soundSample.getLink() != null && soundSample.getLink().isEmpty()){
            soundSample.setLink(null);
        }
        if(soundSample.getFilePath() != null && soundSample.getFilePath().isEmpty()){
            soundSample.setFilePath(null);
        }
        
        String sql = "INSERT INTO sound_samples (link, file_path, user_id) VALUES (?,?,?)";
        jdbcTemplate.update(sql, soundSample.getLink(), soundSample.getFilePath(), soundSample.getUserId());
    }

    // Delete a SoundSample from the database
    public String delete(String link, String filePath){
        if(link == null && filePath == null){
            return "No link or file path provided for deletion.";
        } else if(link != null && filePath != null){
            return "Please provide either link or file path for deletion, not both.";
        } else if(link != null){
            String sql = "DELETE FROM sound_sample WHERE link = ?";
            jdbcTemplate.update(sql, link);
            return "SoundSample with link " + link + " deleted.";
        } else {
            String sql = "DELETE FROM sound_sample WHERE file_path = ?";
            jdbcTemplate.update(sql, filePath);
            return "SoundSample with file path " + filePath + " deleted.";
        }
    }

    // Delete all SoundSamples for a specific user
    public void deleteAllFromUserId(String userId){
        String sql = "DELETE FROM sound_sample WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }
}