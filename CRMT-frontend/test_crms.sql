DROP DATABASE IF EXISTS test_crms;
CREATE DATABASE test_crms;
USE test_crms;

-- ============================
-- JURISDICTIONS
-- ============================
CREATE TABLE jurisdictions (
    jurisdiction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type ENUM('police_station', 'court') NOT NULL,
    level ENUM('local', 'district', 'state', 'high_court', 'supreme_court') DEFAULT 'local',
    address TEXT
);

-- ============================
-- USERS
-- ============================
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    role ENUM('admin', 'police', 'investigator', 'lawyer', 'judge', 'civilian') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- PERMISSIONS
-- ============================
CREATE TABLE permissions (
    permission_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- ============================
-- ROLE PERMISSIONS
-- ============================
CREATE TABLE role_permissions (
    user_id BIGINT,
    permission_id BIGINT,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(permission_id) ON DELETE CASCADE
);

-- ============================
-- ADMIN / POLICE / LAWYER / JUDGE / CIVILIAN
-- ============================
CREATE TABLE admins (
    user_id BIGINT PRIMARY KEY,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE police (
    user_id BIGINT PRIMARY KEY,
    badge_no VARCHAR(50) UNIQUE,
    rank VARCHAR(100),
    jurisdiction_id BIGINT,
    FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(jurisdiction_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE investigators (
    user_id BIGINT PRIMARY KEY,
    dept VARCHAR(200),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE lawyers (
    user_id BIGINT PRIMARY KEY,
    license_no VARCHAR(100) UNIQUE NOT NULL,
    firm VARCHAR(200),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE judges (
    user_id BIGINT PRIMARY KEY,
    jurisdiction_id BIGINT,
    FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(jurisdiction_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE civilians (
    user_id BIGINT PRIMARY KEY,
    national_id VARCHAR(50) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ============================
-- PARTIES
-- ============================
CREATE TABLE parties (
    party_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(200) NOT NULL,
    alias VARCHAR(200),
    photo_url VARCHAR(255),
    national_id VARCHAR(50),
    address TEXT,
    role_in_case ENUM('accused', 'victim', 'complainant') NOT NULL,
    is_public BOOL NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- CASES
-- ============================
CREATE TABLE cases (
    case_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    fir_id VARCHAR(100) UNIQUE,
    reg_date DATE NOT NULL,
    jurisdiction_id BIGINT,
    description TEXT,
    FOREIGN KEY (jurisdiction_id) REFERENCES jurisdictions(jurisdiction_id) ON DELETE SET NULL
);

CREATE TABLE case_parties (
    case_id BIGINT,
    party_id BIGINT,
    role_in_case ENUM('accused', 'victim', 'complainant') NOT NULL,
    PRIMARY KEY (case_id, party_id, role_in_case),
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (party_id) REFERENCES parties(party_id) ON DELETE CASCADE
);

CREATE TABLE case_legal (
    case_id BIGINT PRIMARY KEY,
    prosecutor_id BIGINT,
    defense_id BIGINT,
    judge_id BIGINT,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (prosecutor_id) REFERENCES users(user_id),
    FOREIGN KEY (defense_id) REFERENCES users(user_id),
    FOREIGN KEY (judge_id) REFERENCES users(user_id)
);

CREATE TABLE case_status (
    status_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    status ENUM('fir_filed', 'chargesheet_filed', 'cognizance_taken', 'under_trial', 'judgment_given', 'appeal_pending', 'closed') NOT NULL,
    updated_by BIGINT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

CREATE TABLE evidence (
    evidence_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    added_by BIGINT NOT NULL,
    type ENUM('document', 'image', 'video', 'audio', 'other') NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    short_desc VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (added_by) REFERENCES users(user_id)
);
