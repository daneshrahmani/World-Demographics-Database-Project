-- Drop Table statements for each table, ordered to reverse dependencies between tables
-- to avoid constraint violations
DROP TABLE LocatedIn;
DROP TABLE HasClimateType;
DROP TABLE HasEthnicGroup;
DROP TABLE HasTimezone;
DROP TABLE IsOfficialLanguage;
DROP TABLE PortCity;
DROP TABLE Capital;
DROP TABLE HasBorder;
DROP TABLE SpeaksLanguage;
DROP TABLE PracticesReligion;
DROP TABLE City;
DROP TABLE CountryClimate;
DROP TABLE ClimateType;
DROP TABLE TimeZone;
DROP TABLE EthnicGroup;
DROP TABLE Language;
DROP TABLE Religion;
DROP TABLE Continent;
DROP TABLE Country;
DROP TABLE Currency;



-- Creating all necessary tables
CREATE TABLE Continent (
                           ContinentName VARCHAR(50) PRIMARY KEY,
                           numCountries INT,
                           surfaceArea INT,
                           CHECK (numCountries >= 0 AND surfaceArea > 0)
);

CREATE TABLE Religion (
                          ReligionName VARCHAR(50) PRIMARY KEY,
                          Followers INT DEFAULT 0,
                          CHECK (Followers >= 0)
);

CREATE TABLE Language (
                          LanguageName VARCHAR(50) PRIMARY KEY,
                          ScriptType VARCHAR(50),
                          LanguageFamily VARCHAR(50)
);

CREATE TABLE EthnicGroup (
                             GroupName VARCHAR(50) PRIMARY KEY,
                             Country VARCHAR(50),
                             Population INT DEFAULT 0,
                             CHECK (Population >= 0)
);

CREATE TABLE Currency (
                          Code CHAR(3) PRIMARY KEY,
                          Name VARCHAR(50) UNIQUE,
                          ValueAgainstUSD FLOAT
);

CREATE TABLE TimeZone (
                          Code VARCHAR(10) PRIMARY KEY,
                          Name VARCHAR(50),
                          UTCOffset VARCHAR(10) NOT NULL
);

CREATE TABLE ClimateType (
                             ClimateTypeID INT PRIMARY KEY,
                             ClimateTypeName VARCHAR(20) UNIQUE
);

CREATE TABLE Country (
                         ID INT PRIMARY KEY,
                         Name VARCHAR(50) UNIQUE,
                         Population INT,
                         GDP FLOAT,
                         SurfaceArea INT,
                         CurrencyCode CHAR(3) DEFAULT 'USD',
                         CHECK (Population >= 0 AND GDP >= 0 AND SurfaceArea >= 0),
                         FOREIGN KEY (CurrencyCode) REFERENCES Currency(Code)
                             ON DELETE SET NULL
);

CREATE TABLE CountryClimate (
                                CountryID INT PRIMARY KEY,
                                avgTemp INT,
                                avgPrecipitation INT,
                                CHECK (avgPrecipitation >= 0),
                                FOREIGN KEY (CountryID) REFERENCES Country(ID)
                                    ON DELETE CASCADE
);

CREATE TABLE City (
                      CityName VARCHAR(50),
                      CountryID INT,
                      Population INT,
                      CHECK (Population >= 0),
                      PRIMARY KEY (CityName, CountryID),
                      FOREIGN KEY (CountryID) REFERENCES Country(ID)
                          ON DELETE CASCADE
);

CREATE TABLE SpeaksLanguage (
                                LanguageName VARCHAR(50),
                                CountryID INT,
                                EthnicGroupName VARCHAR(50),
                                percentPopulation INT DEFAULT 0,
                                PRIMARY KEY (LanguageName, CountryID, EthnicGroupName),
                                FOREIGN KEY (LanguageName) REFERENCES Language(LanguageName)
                                    ON DELETE CASCADE,
                                FOREIGN KEY (EthnicGroupName) REFERENCES EthnicGroup(GroupName)
                                    ON DELETE CASCADE,
                                FOREIGN KEY (CountryID) REFERENCES Country(ID)
                                    ON DELETE CASCADE
);

CREATE TABLE HasBorder (
                           Country1ID INT,
                           Country2ID INT,
                           Length INT,
                           PRIMARY KEY (Country1ID, Country2ID),
                           FOREIGN KEY (Country1ID) REFERENCES Country(ID)
                               ON DELETE CASCADE,
                           FOREIGN KEY (Country2ID) REFERENCES Country(ID)
                               ON DELETE CASCADE,
                           CHECK (Country1ID != Country2ID)
    );

CREATE TABLE Capital (
                         CountryID INT PRIMARY KEY,
                         CityName VARCHAR(50),
                         Since INT,
                         FOREIGN KEY (CountryID, CityName) REFERENCES City(CountryID, CityName)
                             ON DELETE CASCADE
);

CREATE TABLE PortCity (
                          CountryID INT,
                          CityName VARCHAR(50),
                          PRIMARY KEY (CountryID, CityName),
                          FOREIGN KEY (CountryID, CityName) REFERENCES City(CountryID, CityName)
                              ON DELETE CASCADE
);

CREATE TABLE IsOfficialLanguage (
                                    CountryID INT,
                                    LanguageName VARCHAR(50),
                                    PRIMARY KEY (CountryID, LanguageName),
                                    FOREIGN KEY (CountryID) REFERENCES Country(ID)
                                        ON DELETE CASCADE,
                                    FOREIGN KEY (LanguageName) REFERENCES Language(LanguageName)
                                        ON DELETE CASCADE
);

CREATE TABLE HasTimezone (
                             CountryID INT,
                             TimezoneCode VARCHAR(10),
                             PRIMARY KEY (CountryID, TimezoneCode),
                             FOREIGN KEY (CountryID) REFERENCES Country(ID)
                                 ON DELETE CASCADE,
                             FOREIGN KEY (TimezoneCode) REFERENCES TimeZone(Code)
                                 ON DELETE CASCADE
);

CREATE TABLE HasEthnicGroup (
                                CountryID INT,
                                EthnicGroupName VARCHAR(50),
                                PRIMARY KEY (CountryID, EthnicGroupName),
                                FOREIGN KEY (CountryID) REFERENCES Country(ID)
                                    ON DELETE CASCADE,
                                FOREIGN KEY (EthnicGroupName) REFERENCES EthnicGroup(GroupName)
                                    ON DELETE CASCADE
);

CREATE TABLE HasClimateType (
                                ClimateTypeID INT,
                                CountryID INT,
                                PRIMARY KEY (ClimateTypeID, CountryID),
                                FOREIGN KEY (ClimateTypeID) REFERENCES ClimateType(ClimateTypeID)
                                    ON DELETE CASCADE,
                                FOREIGN KEY (CountryID) REFERENCES Country(ID)
                                    ON DELETE CASCADE
);

CREATE TABLE LocatedIn (
                           CountryID INT,
                           ContinentName VARCHAR(50),
                           PRIMARY KEY (ContinentName, CountryID),
                           FOREIGN KEY (CountryID) REFERENCES Country(ID)
                               ON DELETE CASCADE,
                           FOREIGN KEY (ContinentName) REFERENCES Continent(ContinentName)
);

CREATE TABLE PracticesReligion (
                                   CountryID INT,
                                   ReligionName VARCHAR(50),
                                   PRIMARY KEY (CountryID, ReligionName),
                                   FOREIGN KEY (CountryID) REFERENCES Country(ID)
                                       ON DELETE CASCADE,
                                   FOREIGN KEY (ReligionName) REFERENCES Religion(ReligionName)
                                       ON DELETE CASCADE
);

-- Continent data
INSERT INTO Continent VALUES ('Asia', 47, 44614000);
INSERT INTO Continent VALUES ('North America', 23, 24230000);
INSERT INTO Continent VALUES ('South America', 12, 17814000);
INSERT INTO Continent VALUES ('Europe', 43, 10000000);
INSERT INTO Continent VALUES ('Australia', 14, 7688287);
INSERT INTO Continent VALUES ('Africa', 54, 30365000);
INSERT INTO Continent VALUES ('Antarctica', 0, 14200000);

-- Religion data
INSERT INTO Religion VALUES ('Christianity', 2400000000);
INSERT INTO Religion VALUES ('Islam', 1900000000);
INSERT INTO Religion VALUES ('Hinduism', 1200000000);
INSERT INTO Religion VALUES ('Buddhism', 500000000);
INSERT INTO Religion VALUES ('Judaism', 15000000);

-- Language data
INSERT INTO Language VALUES ('English', 'Latin', 'Indo-European');
INSERT INTO Language VALUES ('Spanish', 'Latin', 'Indo-European');
INSERT INTO Language VALUES ('Mandarin', 'Chinese', 'Sino-Tibetan');
INSERT INTO Language VALUES ('Arabic', 'Arabic', 'Afro-Asiatic');
INSERT INTO Language VALUES ('Hindi', 'Devanagari', 'Indo-European');
INSERT INTO Language VALUES ('French', 'Latin', 'Indo-European');
INSERT INTO Language VALUES ('Russian', 'Cyrillic', 'Indo-European');
INSERT INTO Language VALUES ('Portuguese', 'Latin', 'Indo-European');
INSERT INTO Language VALUES ('Japanese', 'Japanese', 'Japonic');
INSERT INTO Language VALUES ('German', 'Latin', 'Indo-European');
INSERT INTO Language VALUES ('Swahili', 'Latin', 'Niger-Congo');
INSERT INTO Language VALUES ('Malay', 'Latin', 'Austronesian');
INSERT INTO Language VALUES ('Italian', 'Latin', 'Romance');
INSERT INTO Language VALUES ('Romansh', 'Latin', 'Gallo-Romance');
INSERT INTO Language VALUES ('Afrikaans', 'Latin', 'Germanic');
INSERT INTO Language VALUES ('Zulu', 'Latin', 'Bantu');
INSERT INTO Language VALUES ('Xhosa', 'Latin', 'Bantu');

-- EthnicGroup data
INSERT INTO EthnicGroup VALUES ('Han Chinese', 'China', 1300000000);
INSERT INTO EthnicGroup VALUES ('Indo-Aryan', 'India', 1000000000);
INSERT INTO EthnicGroup VALUES ('European', 'Various', 750000000);
INSERT INTO EthnicGroup VALUES ('Arab', 'Various', 450000000);
INSERT INTO EthnicGroup VALUES ('African', 'Various', 1200000000);
INSERT INTO EthnicGroup VALUES ('Latino', 'Various', 650000000);
INSERT INTO EthnicGroup VALUES ('Slavic', 'Various', 300000000);
INSERT INTO EthnicGroup VALUES ('Japanese', 'Japan', 125000000);
INSERT INTO EthnicGroup VALUES ('Malay', 'Malaysia', 25000000);
INSERT INTO EthnicGroup VALUES ('Anglo-Saxon', 'United Kingdom', 55000000);
INSERT INTO EthnicGroup VALUES ('Bantu', 'Various', 350000000);
INSERT INTO EthnicGroup VALUES ('Germanic', 'Various', 450000000);

-- Currency data
INSERT INTO Currency VALUES ('USD', 'US Dollar', 1.0000000);
INSERT INTO Currency VALUES ('EUR', 'Euro', 1.0900000);
INSERT INTO Currency VALUES ('GBP', 'British Pound', 1.2700000);
INSERT INTO Currency VALUES ('JPY', 'Japanese Yen', 0.0091000);
INSERT INTO Currency VALUES ('CNY', 'Chinese Yuan', 0.1550000);
INSERT INTO Currency VALUES ('INR', 'Indian Rupee', 0.0135000);
INSERT INTO Currency VALUES ('BRL', 'Brazilian Real', 0.2050000);
INSERT INTO Currency VALUES ('RUB', 'Russian Ruble', 0.0129000);
INSERT INTO Currency VALUES ('ZAR', 'South African Rand', 0.0670000);
INSERT INTO Currency VALUES ('AUD', 'Australian Dollar', 0.7700000);
INSERT INTO Currency VALUES ('MYR', 'Malaysian Ringgit', 0.2400000);
INSERT INTO Currency VALUES ('KES', 'Kenyan Shilling', 0.0087000);
INSERT INTO Currency VALUES ('AED', 'UAE Dirham', 0.2720000);
INSERT INTO Currency VALUES ('MXN', 'Mexican Peso', 0.0580000);
INSERT INTO Currency VALUES ('CHF', 'Swiss Franc', 1.1300000);

-- TimeZone data
INSERT INTO TimeZone VALUES ('UTC', 'Coordinated Universal Time', '+00:00');
INSERT INTO TimeZone VALUES ('EST', 'Eastern Standard Time', '-05:00');
INSERT INTO TimeZone VALUES ('CST', 'Central Standard Time', '-06:00');
INSERT INTO TimeZone VALUES ('PST', 'Pacific Standard Time', '-08:00');
INSERT INTO TimeZone VALUES ('JST', 'Japan Standard Time', '+09:00');
INSERT INTO TimeZone VALUES ('IST', 'India Standard Time', '+05:30');
INSERT INTO TimeZone VALUES ('CET', 'Central European Time', '+01:00');
INSERT INTO TimeZone VALUES ('MSK', 'Moscow Time', '+03:00');
INSERT INTO TimeZone VALUES ('CST-CN', 'China Standard Time', '+08:00');
INSERT INTO TimeZone VALUES ('BRT', 'Brasília Time', '-03:00');
INSERT INTO TimeZone VALUES ('AEST', 'Australian Eastern Standard Time', '+10:00');
INSERT INTO TimeZone VALUES ('EAT', 'East Africa Time', '+03:00');
INSERT INTO TimeZone VALUES ('GST', 'Gulf Standard Time', '+04:00');
INSERT INTO TimeZone VALUES ('MST', 'Mountain Standard Time', '-07:00');
INSERT INTO TimeZone VALUES ('YEKT', 'Yekaterinburg Time', '+05:00');
INSERT INTO TimeZone VALUES ('OMST', 'Omsk Time', '+06:00');
INSERT INTO TimeZone VALUES ('KRAT', 'Krasnoyarsk Time', '+07:00');
INSERT INTO TimeZone VALUES ('VLAT', 'Vladivostok Time', '+10:00');
INSERT INTO TimeZone VALUES ('ACST', 'Australian Central Standard Time', '+09:30');
INSERT INTO TimeZone VALUES ('AWST', 'Australian Western Standard Time', '+08:00');

-- ClimateType data
INSERT INTO ClimateType VALUES (1, 'Tropical');
INSERT INTO ClimateType VALUES (2, 'Dry');
INSERT INTO ClimateType VALUES (3, 'Temperate');
INSERT INTO ClimateType VALUES (4, 'Continental');
INSERT INTO ClimateType VALUES (5, 'Polar');
INSERT INTO ClimateType VALUES (6, 'Mediterranean');
INSERT INTO ClimateType VALUES (7, 'Mountain');

-- Country data
INSERT INTO Country VALUES (1, 'United States', 331000000, 27720, 9833517, 'USD');
INSERT INTO Country VALUES (2, 'China', 1410000000, 17790, 9596961, 'CNY');
INSERT INTO Country VALUES (3, 'India', 1380000000, 3568, 3287263, 'INR');
INSERT INTO Country VALUES (4, 'United Kingdom', 67000000, 3381, 242495, 'GBP');
INSERT INTO Country VALUES (5, 'Germany', 83000000, 4526, 357022, 'EUR');
INSERT INTO Country VALUES (6, 'Japan', 126000000, 4204, 377975, 'JPY');
INSERT INTO Country VALUES (7, 'Brazil', 212000000, 2174, 8515767, 'BRL');
INSERT INTO Country VALUES (8, 'Russia', 144000000, 2021, 17098246, 'RUB');
INSERT INTO Country VALUES (9, 'South Africa', 59000000, 380.7, 1221037, 'ZAR');
INSERT INTO Country VALUES (10, 'Australia', 25000000, 1728, 7692024, 'AUD');
INSERT INTO Country VALUES (11, 'Malaysia', 32000000, 407, 330803, 'MYR');
INSERT INTO Country VALUES (12, 'Kenya', 53000000, 116, 580367, 'KES');
INSERT INTO Country VALUES (13, 'United Arab Emirates', 514, 421000, 83600, 'AED');
INSERT INTO Country VALUES (14, 'Mexico', 128000000, 1789, 1964375, 'MXN');
INSERT INTO Country VALUES (15, 'Switzerland', 8600000, 885, 41284, 'CHF');

-- CountryClimate data (CountryID, avgTemp in Celsius, avgPrecipitation in mm)
INSERT INTO CountryClimate VALUES (1, 14, 767);
INSERT INTO CountryClimate VALUES (2, 15, 645);
INSERT INTO CountryClimate VALUES (3, 24, 1083);
INSERT INTO CountryClimate VALUES (4, 10, 885);
INSERT INTO CountryClimate VALUES (5, 9, 700);
INSERT INTO CountryClimate VALUES (6, 16, 1668);
INSERT INTO CountryClimate VALUES (7, 25, 1761);
INSERT INTO CountryClimate VALUES (8, 5, 571);
INSERT INTO CountryClimate VALUES (9, 18, 495);
INSERT INTO CountryClimate VALUES (10, 21, 534);
INSERT INTO CountryClimate VALUES (11, 27, 2875);
INSERT INTO CountryClimate VALUES (12, 24, 1072);
INSERT INTO CountryClimate VALUES (13, 29, 78);
INSERT INTO CountryClimate VALUES (14, 21, 758);
INSERT INTO CountryClimate VALUES (15, 9, 1537);

-- City data
-- United States cities
INSERT INTO City VALUES ('Washington DC', 1, 705749);
INSERT INTO City VALUES ('New York', 1, 8804190);
INSERT INTO City VALUES ('Los Angeles', 1, 3898747);
INSERT INTO City VALUES ('Chicago', 1, 2746388);
INSERT INTO City VALUES ('Houston', 1, 2304580);

-- China cities
INSERT INTO City VALUES ('Beijing', 2, 21540000);
INSERT INTO City VALUES ('Shanghai', 2, 27780000);
INSERT INTO City VALUES ('Guangzhou', 2, 15310000);
INSERT INTO City VALUES ('Shenzhen', 2, 12590000);
INSERT INTO City VALUES ('Chongqing', 2, 30750000);

-- India cities
INSERT INTO City VALUES ('New Delhi', 3, 16787941);
INSERT INTO City VALUES ('Mumbai', 3, 20667656);
INSERT INTO City VALUES ('Kolkata', 3, 14850000);
INSERT INTO City VALUES ('Bangalore', 3, 12327000);
INSERT INTO City VALUES ('Chennai', 3, 10971108);

-- UK cities
INSERT INTO City VALUES ('London', 4, 8982000);
INSERT INTO City VALUES ('Manchester', 4, 553230);
INSERT INTO City VALUES ('Birmingham', 4, 1141400);
INSERT INTO City VALUES ('Edinburgh', 4, 509000);
INSERT INTO City VALUES ('Liverpool', 4, 496784);

-- Germany cities
INSERT INTO City VALUES ('Berlin', 5, 3669491);
INSERT INTO City VALUES ('Hamburg', 5, 1845229);
INSERT INTO City VALUES ('Munich', 5, 1488202);
INSERT INTO City VALUES ('Cologne', 5, 1085664);
INSERT INTO City VALUES ('Frankfurt', 5, 763380);

-- Japan cities
INSERT INTO City VALUES ('Tokyo', 6, 13960000);
INSERT INTO City VALUES ('Osaka', 6, 2691000);
INSERT INTO City VALUES ('Yokohama', 6, 3760000);
INSERT INTO City VALUES ('Nagoya', 6, 2320000);
INSERT INTO City VALUES ('Sapporo', 6, 1961000);

-- Brazil cities
INSERT INTO City VALUES ('Brasilia', 7, 3015268);
INSERT INTO City VALUES ('Sao Paulo', 7, 12325232);
INSERT INTO City VALUES ('Rio de Janeiro', 7, 6747815);
INSERT INTO City VALUES ('Salvador', 7, 2886698);
INSERT INTO City VALUES ('Fortaleza', 7, 2686612);

-- Russia cities
INSERT INTO City VALUES ('Moscow', 8, 12537954);
INSERT INTO City VALUES ('Saint Petersburg', 8, 5383890);
INSERT INTO City VALUES ('Novosibirsk', 8, 1625631);
INSERT INTO City VALUES ('Yekaterinburg', 8, 1493749);
INSERT INTO City VALUES ('Kazan', 8, 1257391);

-- South Africa cities
INSERT INTO City VALUES ('Pretoria', 9, 741651);
INSERT INTO City VALUES ('Cape Town', 9, 433688);
INSERT INTO City VALUES ('Johannesburg', 9, 957441);
INSERT INTO City VALUES ('Durban', 9, 595061);
INSERT INTO City VALUES ('Port Elizabeth', 9, 312392);

-- Australia cities
INSERT INTO City VALUES ('Canberra', 10, 431380);
INSERT INTO City VALUES ('Sydney', 10, 5312163);
INSERT INTO City VALUES ('Melbourne', 10, 5078193);
INSERT INTO City VALUES ('Brisbane', 10, 2560720);
INSERT INTO City VALUES ('Perth', 10, 2059484);

-- Malaysia cities
INSERT INTO City VALUES ('Kuala Lumpur', 11, 1808140);
INSERT INTO City VALUES ('George Town', 11, 708127);
INSERT INTO City VALUES ('Ipoh', 11, 657892);
INSERT INTO City VALUES ('Johor Bahru', 11, 497067);
INSERT INTO City VALUES ('Shah Alam', 11, 481654);

-- Kenya cities
INSERT INTO City VALUES ('Nairobi', 12, 4397073);
INSERT INTO City VALUES ('Mombasa', 12, 1208333);
INSERT INTO City VALUES ('Nakuru', 12, 570674);
INSERT INTO City VALUES ('Eldoret', 12, 475716);
INSERT INTO City VALUES ('Kisumu', 12, 409928);

-- UAE cities
INSERT INTO City VALUES ('Abu Dhabi', 13, 1450000);
INSERT INTO City VALUES ('Dubai', 13, 3331420);
INSERT INTO City VALUES ('Sharjah', 13, 1274749);
INSERT INTO City VALUES ('Al Ain', 13, 766936);
INSERT INTO City VALUES ('Ajman', 13, 504846);

-- Mexico cities
INSERT INTO City VALUES ('Mexico City', 14, 9209944);
INSERT INTO City VALUES ('Guadalajara', 14, 1460148);
INSERT INTO City VALUES ('Monterrey', 14, 1135512);
INSERT INTO City VALUES ('Puebla', 14, 1434062);
INSERT INTO City VALUES ('Tijuana', 14, 1300983);

-- Switzerland cities
INSERT INTO City VALUES ('Bern', 15, 133798);
INSERT INTO City VALUES ('Zurich', 15, 415215);
INSERT INTO City VALUES ('Geneva', 15, 201818);
INSERT INTO City VALUES ('Basel', 15, 171513);
INSERT INTO City VALUES ('Lausanne', 15, 139111);

-- Capital data
INSERT INTO Capital VALUES (1, 'Washington DC', 1800);
INSERT INTO Capital VALUES (2, 'Beijing', 1420);
INSERT INTO Capital VALUES (3, 'New Delhi', 1911);
INSERT INTO Capital VALUES (4, 'London', 1066);
INSERT INTO Capital VALUES (5, 'Berlin', 1990);
INSERT INTO Capital VALUES (6, 'Tokyo', 1868);
INSERT INTO Capital VALUES (7, 'Brasilia', 1960);
INSERT INTO Capital VALUES (8, 'Moscow', 1918);
INSERT INTO Capital VALUES (9, 'Pretoria', 1860);
INSERT INTO Capital VALUES (10, 'Canberra', 1913);
INSERT INTO Capital VALUES (11, 'Kuala Lumpur', 1963);
INSERT INTO Capital VALUES (12, 'Nairobi', 1963);
INSERT INTO Capital VALUES (13, 'Abu Dhabi', 1971);
INSERT INTO Capital VALUES (14, 'Mexico City', 1821);
INSERT INTO Capital VALUES (15, 'Bern', 1848);

-- PortCity data
INSERT INTO PortCity VALUES (1, 'New York');
INSERT INTO PortCity VALUES (1, 'Los Angeles');
INSERT INTO PortCity VALUES (2, 'Shanghai');
INSERT INTO PortCity VALUES (2, 'Guangzhou');
INSERT INTO PortCity VALUES (3, 'Mumbai');
INSERT INTO PortCity VALUES (3, 'Chennai');
INSERT INTO PortCity VALUES (4, 'Liverpool');
INSERT INTO PortCity VALUES (5, 'Hamburg');
INSERT INTO PortCity VALUES (6, 'Tokyo');
INSERT INTO PortCity VALUES (6, 'Yokohama');
INSERT INTO PortCity VALUES (7, 'Rio de Janeiro');
INSERT INTO PortCity VALUES (8, 'Saint Petersburg');
INSERT INTO PortCity VALUES (9, 'Cape Town');
INSERT INTO PortCity VALUES (9, 'Durban');
INSERT INTO PortCity VALUES (10, 'Sydney');
INSERT INTO PortCity VALUES (10, 'Melbourne');
INSERT INTO PortCity VALUES (11, 'George Town');
INSERT INTO PortCity VALUES (12, 'Mombasa');
INSERT INTO PortCity VALUES (13, 'Dubai');
INSERT INTO PortCity VALUES (14, 'Tijuana');

-- HasBorder data
INSERT INTO HasBorder VALUES (1, 14, 3145);
INSERT INTO HasBorder VALUES (2, 3, 3488);
INSERT INTO HasBorder VALUES (5, 15, 362);
INSERT INTO HasBorder VALUES (2, 8, 4300);

-- HasEthnicGroup data
INSERT INTO HasEthnicGroup VALUES (1, 'European');
INSERT INTO HasEthnicGroup VALUES (2, 'Han Chinese');
INSERT INTO HasEthnicGroup VALUES (3, 'Indo-Aryan');
INSERT INTO HasEthnicGroup VALUES (4, 'Anglo-Saxon');
INSERT INTO HasEthnicGroup VALUES (5, 'Germanic');
INSERT INTO HasEthnicGroup VALUES (6, 'Japanese');
INSERT INTO HasEthnicGroup VALUES (7, 'Latino');
INSERT INTO HasEthnicGroup VALUES (8, 'Slavic');
INSERT INTO HasEthnicGroup VALUES (9, 'Bantu');
INSERT INTO HasEthnicGroup VALUES (10, 'European');

-- HasClimateType data
INSERT INTO HasClimateType VALUES (1, 1);
INSERT INTO HasClimateType VALUES (2, 1);
INSERT INTO HasClimateType VALUES (3, 1);
INSERT INTO HasClimateType VALUES (4, 1);
INSERT INTO HasClimateType VALUES (5, 1);
INSERT INTO HasClimateType VALUES (6, 1);
INSERT INTO HasClimateType VALUES (7, 1);

INSERT INTO HasClimateType VALUES (1, 2);
INSERT INTO HasClimateType VALUES (1, 3);
INSERT INTO HasClimateType VALUES (3, 4);
INSERT INTO HasClimateType VALUES (3, 5);
INSERT INTO HasClimateType VALUES (3, 6);
INSERT INTO HasClimateType VALUES (1, 7);
INSERT INTO HasClimateType VALUES (4, 8);
INSERT INTO HasClimateType VALUES (3, 9);
INSERT INTO HasClimateType VALUES (2, 10);

-- SpeaksLanguage data
INSERT INTO SpeaksLanguage VALUES ('English', 1, 'European', 78);
INSERT INTO SpeaksLanguage VALUES ('Mandarin', 2, 'Han Chinese', 81);
INSERT INTO SpeaksLanguage VALUES ('Hindi', 3, 'Indo-Aryan', 44);
INSERT INTO SpeaksLanguage VALUES ('English', 4, 'Anglo-Saxon', 91);
INSERT INTO SpeaksLanguage VALUES ('German', 5, 'Germanic', 95);
INSERT INTO SpeaksLanguage VALUES ('Japanese', 6, 'Japanese', 99);
INSERT INTO SpeaksLanguage VALUES ('Portuguese', 7, 'Latino', 98);
INSERT INTO SpeaksLanguage VALUES ('Russian', 8, 'Slavic', 81);
INSERT INTO SpeaksLanguage VALUES ('English', 9, 'Bantu', 60);
INSERT INTO SpeaksLanguage VALUES ('English', 10, 'European', 72);
INSERT INTO SpeaksLanguage VALUES ('Spanish', 14, 'Latino', 99);

-- LocatedIn data
INSERT INTO LocatedIn VALUES (1, 'North America');
INSERT INTO LocatedIn VALUES (2, 'Asia');
INSERT INTO LocatedIn VALUES (3, 'Asia');
INSERT INTO LocatedIn VALUES (4, 'Europe');
INSERT INTO LocatedIn VALUES (5, 'Europe');
INSERT INTO LocatedIn VALUES (6, 'Asia');
INSERT INTO LocatedIn VALUES (7, 'South America');
INSERT INTO LocatedIn VALUES (8, 'Europe');
INSERT INTO LocatedIn VALUES (9, 'Africa');
INSERT INTO LocatedIn VALUES (10, 'Australia');

-- PracticesReligion data
INSERT INTO PracticesReligion VALUES (1, 'Christianity');
INSERT INTO PracticesReligion VALUES (2, 'Buddhism');
INSERT INTO PracticesReligion VALUES (3, 'Hinduism');
INSERT INTO PracticesReligion VALUES (4, 'Christianity');
INSERT INTO PracticesReligion VALUES (5, 'Christianity');
INSERT INTO PracticesReligion VALUES (6, 'Buddhism');
INSERT INTO PracticesReligion VALUES (7, 'Christianity');
INSERT INTO PracticesReligion VALUES (8, 'Christianity');
INSERT INTO PracticesReligion VALUES (9, 'Christianity');
INSERT INTO PracticesReligion VALUES (10, 'Christianity');

-- IsOfficialLanguage data
-- United States
INSERT INTO IsOfficialLanguage VALUES (1, 'English');

-- China
INSERT INTO IsOfficialLanguage VALUES (2, 'Mandarin');

-- India
INSERT INTO IsOfficialLanguage VALUES (3, 'Hindi');
INSERT INTO IsOfficialLanguage VALUES (3, 'English');

-- United Kingdom
INSERT INTO IsOfficialLanguage VALUES (4, 'English');

-- Germany
INSERT INTO IsOfficialLanguage VALUES (5, 'German');

-- Japan
INSERT INTO IsOfficialLanguage VALUES (6, 'Japanese');

-- Brazil
INSERT INTO IsOfficialLanguage VALUES (7, 'Portuguese');

-- Russia
INSERT INTO IsOfficialLanguage VALUES (8, 'Russian');

-- South Africa
INSERT INTO IsOfficialLanguage VALUES (9, 'English');
INSERT INTO IsOfficialLanguage VALUES (9, 'Afrikaans');
INSERT INTO IsOfficialLanguage VALUES (9, 'Zulu');
INSERT INTO IsOfficialLanguage VALUES (9, 'Xhosa');

-- Australia
INSERT INTO IsOfficialLanguage VALUES (10, 'English');

-- Malaysia
INSERT INTO IsOfficialLanguage VALUES (11, 'Malay');

-- Kenya
INSERT INTO IsOfficialLanguage VALUES (12, 'English');
INSERT INTO IsOfficialLanguage VALUES (12, 'Swahili');

-- United Arab Emirates
INSERT INTO IsOfficialLanguage VALUES (13, 'Arabic');

-- Mexico
INSERT INTO IsOfficialLanguage VALUES (14, 'Spanish');

-- Switzerland
INSERT INTO IsOfficialLanguage VALUES (15, 'German');
INSERT INTO IsOfficialLanguage VALUES (15, 'French');
INSERT INTO IsOfficialLanguage VALUES (15, 'Italian');
INSERT INTO IsOfficialLanguage VALUES (15, 'Romansh');

-- HasTimezone data
-- United States
INSERT INTO HasTimezone VALUES (1, 'EST');
INSERT INTO HasTimezone VALUES (1, 'CST');
INSERT INTO HasTimezone VALUES (1, 'PST');
INSERT INTO HasTimezone VALUES (1, 'MST');

-- China
INSERT INTO HasTimezone VALUES (2, 'CST-CN');

-- India
INSERT INTO HasTimezone VALUES (3, 'IST');

-- United Kingdom
INSERT INTO HasTimezone VALUES (4, 'UTC');

-- Germany
INSERT INTO HasTimezone VALUES (5, 'CET');

-- Japan
INSERT INTO HasTimezone VALUES (6, 'JST');

-- Brazil
INSERT INTO HasTimezone VALUES (7, 'BRT');

-- Russia
INSERT INTO HasTimezone VALUES (8, 'MSK');
INSERT INTO HasTimezone VALUES (8, 'YEKT');
INSERT INTO HasTimezone VALUES (8, 'VLAT');

-- Australia
INSERT INTO HasTimezone VALUES (10, 'AEST');
INSERT INTO HasTimezone VALUES (10, 'AWST');

-- Commit the transaction
COMMIT;