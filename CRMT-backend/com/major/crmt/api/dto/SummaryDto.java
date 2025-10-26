package com.major.crmt.api.dto;

import java.util.Map;

public class SummaryDto {
    private long totalUsers;
    private Map<String, Long> usersByRole;
    private long totalCases;
    private long recentCases;
    private long totalParties;
    private long totalEvidence;

    // getters/setters
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public Map<String, Long> getUsersByRole() { return usersByRole; }
    public void setUsersByRole(Map<String, Long> usersByRole) { this.usersByRole = usersByRole; }
    public long getTotalCases() { return totalCases; }
    public void setTotalCases(long totalCases) { this.totalCases = totalCases; }
    public long getRecentCases() { return recentCases; }
    public void setRecentCases(long recentCases) { this.recentCases = recentCases; }
    public long getTotalParties() { return totalParties; }
    public void setTotalParties(long totalParties) { this.totalParties = totalParties; }
    public long getTotalEvidence() { return totalEvidence; }
    public void setTotalEvidence(long totalEvidence) { this.totalEvidence = totalEvidence; }
}
