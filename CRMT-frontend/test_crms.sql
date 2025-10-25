DROP DATABASE IF EXISTS test_crms;
CREATE DATABASE test_crms;
USE test_crms;

-- ============================
-- JURISDICTIONS (Police stations / courts)
-- ============================
CREATE TABLE Jurisdictions (
    JurisdictionID  BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name            VARCHAR(200) NOT NULL,
    Type            ENUM('PoliceStation', 'Court') NOT NULL,
    Level           ENUM('Local', 'District', 'State', 'HighCourt', 'SupremeCourt') DEFAULT 'Local',
    Address         TEXT
);

-- ============================
-- USERS (System Access Roles)
-- ============================
CREATE TABLE Users (
    UserID          BIGINT AUTO_INCREMENT PRIMARY KEY,
    Username        VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash    VARCHAR(255) NOT NULL,
    FullName        VARCHAR(200),
    Role            ENUM('Admin', 'Police', 'Investigator', 'Lawyer', 'Judge', 'Civilian') NOT NULL,
    CreatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- PERMISSIONS (Task Permissions)
-- ============================
CREATE TABLE Permissions (
    PermissionID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Name         VARCHAR(100) UNIQUE NOT NULL
);

-- ============================
-- ROLE PERMISSIONS (Link: Users with Permissions)
-- ============================
CREATE TABLE RolePermissions (
    UserID       BIGINT,
    PermissionID BIGINT,
    PRIMARY KEY (UserID, PermissionID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (PermissionID) REFERENCES Permissions(PermissionID) ON DELETE CASCADE
);

-- ============================
-- ADMIN / POLICE / LAWYER / JUDGE / CIVILIAN
-- ============================
CREATE TABLE Admins (
    UserID          BIGINT PRIMARY KEY,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Police (
	UserID          BIGINT PRIMARY KEY,
    BadgeNumber     VARCHAR(50) UNIQUE,
    PoliceRank      VARCHAR(100),
    JurisdictionID  BIGINT,
    FOREIGN KEY (JurisdictionID) REFERENCES Jurisdictions(JurisdictionID) ON DELETE SET NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Investigators (
    UserID          BIGINT PRIMARY KEY,
    Department      VARCHAR(200),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Lawyers (
    UserID          BIGINT PRIMARY KEY,
    LicenseNumber   VARCHAR(100) UNIQUE NOT NULL,
    FirmName        VARCHAR(200),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Judges (
    UserID          BIGINT PRIMARY KEY,
    JurisdictionID  BIGINT,
    FOREIGN KEY (JurisdictionID) REFERENCES Jurisdictions(JurisdictionID) ON DELETE SET NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE Civilians (
    UserID          BIGINT PRIMARY KEY,
    NationalID      VARCHAR(50) UNIQUE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- ============================
-- PARTIES (Case parties)
-- ============================
CREATE TABLE Parties (
    PartyID         BIGINT AUTO_INCREMENT PRIMARY KEY,
    FullName        VARCHAR(200) NOT NULL,
    Alias           VARCHAR(200),
    PhotoURL        VARCHAR(255),
    NationalID      VARCHAR(50),
    Address         TEXT,
    RoleInCase      ENUM('Accused', 'Victim', 'Complainant') NOT NULL,
    IsPublic		BOOL NOT NULL DEFAULT TRUE,
    CreatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- CASES
-- ============================
CREATE TABLE Cases (
    CaseID          BIGINT AUTO_INCREMENT PRIMARY KEY,
    FIR_ID          VARCHAR(100) UNIQUE,
    RegistrationDate DATE NOT NULL,
    JurisdictionID  BIGINT,
    Description     TEXT,
    FOREIGN KEY (JurisdictionID) REFERENCES Jurisdictions(JurisdictionID) ON DELETE SET NULL
);

CREATE TABLE CaseParties (
    CaseID          BIGINT,
    PartyID         BIGINT,
    RoleInCase      ENUM('Accused', 'Victim', 'Complainant') NOT NULL,
    PRIMARY KEY (CaseID, PartyID, RoleInCase),
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID) ON DELETE CASCADE,
    FOREIGN KEY (PartyID) REFERENCES Parties(PartyID) ON DELETE CASCADE
);

CREATE TABLE CaseLegal (
    CaseID              BIGINT PRIMARY KEY,
    ProsecutorLawyerID  BIGINT,
    DefenseLawyerID     BIGINT,
    JudgeID             BIGINT,
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID) ON DELETE CASCADE,
    FOREIGN KEY (ProsecutorLawyerID) REFERENCES Users(UserID),
    FOREIGN KEY (DefenseLawyerID) REFERENCES Users(UserID),
    FOREIGN KEY (JudgeID) REFERENCES Users(UserID)
);

CREATE TABLE CaseStatus (
    StatusID        BIGINT AUTO_INCREMENT PRIMARY KEY,
    CaseID          BIGINT NOT NULL,
    Status          ENUM('FIR Filed', 'Chargesheet Filed', 'Cognizance Taken', 'Under Trial', 'Judgment Given', 'Appeal Pending', 'Closed') NOT NULL,
    UpdatedBy       BIGINT NOT NULL,
    UpdatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID) ON DELETE CASCADE,
    FOREIGN KEY (UpdatedBy) REFERENCES Users(UserID)
);

CREATE TABLE Evidence (
    EvidenceID      BIGINT AUTO_INCREMENT PRIMARY KEY,
    CaseID          BIGINT NOT NULL,
    AddedBy         BIGINT NOT NULL,
    EvidenceType    ENUM('Document', 'Image', 'Video', 'Audio', 'Other') NOT NULL,
    FilePath        VARCHAR(255) NOT NULL,
    ShortDescription VARCHAR(255),
    CreatedAt       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CaseID) REFERENCES Cases(CaseID) ON DELETE CASCADE,
    FOREIGN KEY (AddedBy) REFERENCES Users(UserID)
);

-- Jurisdictions
INSERT INTO Jurisdictions (Name, Type, Level, Address) VALUES
('Delhi Police Station Connaught Place', 'PoliceStation', 'District', 'Connaught Place, New Delhi'),
('Mumbai High Court', 'Court', 'HighCourt', 'Fort, Mumbai'),
('Supreme Court of India', 'Court', 'SupremeCourt', 'Tilak Marg, New Delhi');

-- Users
INSERT INTO Users (Username, PasswordHash, FullName, Role) VALUES
('admin1', 'hash123', 'System Admin', 'Admin'),
('police101', 'hash456', 'Inspector Rajesh Kumar', 'Police'),
('lawyer88', 'hash789', 'Advocate Meera Sharma', 'Lawyer'),
('judge77', 'hash321', 'Justice A.K. Verma', 'Judge'),
('civilian22', 'hash654', 'Rohit Sharma', 'Civilian');

-- Police
INSERT INTO Police (UserID, BadgeNumber, PoliceRank, JurisdictionID) VALUES
(2, 'DL-PS-101', 'Inspector', 1);

-- Lawyers
INSERT INTO Lawyers (UserID, LicenseNumber, FirmName) VALUES
(3, 'DL-BA-5678', 'Sharma & Co.');

-- Judges
INSERT INTO Judges (UserID, JurisdictionID) VALUES
(4, 2);

-- Civilians
INSERT INTO Civilians (UserID, NationalID) VALUES
(5, 'Aadhar-1122334455');

-- Parties
INSERT INTO Parties (FullName, RoleInCase, Address, NationalID) VALUES
('Amit Singh', 'Accused', 'Delhi', 'Aadhar-6677889900'),
('Priya Mehta', 'Victim', 'Mumbai', 'Aadhar-2233445566');

-- Cases
INSERT INTO Cases (FIR_ID, RegistrationDate, JurisdictionID, Description) VALUES
('FIR-2025-DEL-001', '2025-09-01', 1, 'Robbery at Connaught Place');

-- Case Parties
INSERT INTO CaseParties (CaseID, PartyID, RoleInCase) VALUES
(1, 1, 'Accused'),
(1, 2, 'Victim');

-- Case Legal
INSERT INTO CaseLegal (CaseID, ProsecutorLawyerID, DefenseLawyerID, JudgeID) VALUES
(1, 3, NULL, 4);

-- Case Status
INSERT INTO CaseStatus (CaseID, Status, UpdatedBy) VALUES
(1, 'FIR Filed', 2);

-- Evidence
INSERT INTO Evidence (CaseID, AddedBy, EvidenceType, FilePath, ShortDescription) VALUES
(1, 2, 'Image', '/evidence/case1/cctv1.jpg', 'CCTV footage from shop');