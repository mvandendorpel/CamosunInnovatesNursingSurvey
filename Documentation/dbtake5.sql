-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fitbitdata`
--

DROP TABLE IF EXISTS `fitbitdata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fitbitdata` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nurses_ID` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_fitbitData_nurses1_idx` (`nurses_ID`),
  CONSTRAINT `fk_fitbitData_nurses1` FOREIGN KEY (`nurses_ID`) REFERENCES `nurses` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fitbitdata`
--

LOCK TABLES `fitbitdata` WRITE;
/*!40000 ALTER TABLE `fitbitdata` DISABLE KEYS */;
/*!40000 ALTER TABLE `fitbitdata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nurses`
--

DROP TABLE IF EXISTS `nurses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nurses` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(45) NOT NULL,
  `LastName` varchar(45) NOT NULL,
  `email` varchar(320) NOT NULL,
  `Password` varchar(60) NOT NULL,
  `username` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `idNurses_UNIQUE` (`ID`),
  UNIQUE KEY `Nurse_Email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nurses`
--

LOCK TABLES `nurses` WRITE;
/*!40000 ALTER TABLE `nurses` DISABLE KEYS */;
INSERT INTO `nurses` VALUES (2,'test','test','test@gmail.com','test123','test1233');
/*!40000 ALTER TABLE `nurses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offered_answer`
--

DROP TABLE IF EXISTS `offered_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offered_answer` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `AnswerText` varchar(200) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offered_answer`
--

LOCK TABLES `offered_answer` WRITE;
/*!40000 ALTER TABLE `offered_answer` DISABLE KEYS */;
INSERT INTO `offered_answer` VALUES (1,'day shift'),(2,'night shift'),(3,'Fully alert, wide awake'),(4,'Very lively, responsive but not at peak'),(5,'Okay, somewhat fresh'),(6,'A little tired, less than fresh'),(7,'Moderately tired, let down'),(8,'Extremely tired, very difficult to concentrate'),(9,'Completely exhausted, unable to function effectively'),(10,'Fully alert, wide awake '),(11,'Very lively, responsive but not at peak'),(12,'Okay, somewhat fresh '),(13,'A little tired, less than fresh'),(14,'Moderately tired, let down'),(15,'Extremely tired, very difficult to concentrate'),(16,'Completely exhausted, unable to function effectively');
/*!40000 ALTER TABLE `offered_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `questionText` varchar(200) DEFAULT NULL,
  `survey_type_id` int DEFAULT NULL,
  `daily_survey_type` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_question_survey_type1_idx` (`survey_type_id`),
  CONSTRAINT `fk_question_survey_type1` FOREIGN KEY (`survey_type_id`) REFERENCES `survey_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'Are you on day shift or night shift?',1,NULL),(2,'When does their shift start and end?  ',1,1),(3,'Please describe the quality of last night’s sleep',1,1),(4,'What factors contributed to the quality of sleep you described above?',1,1),(5,'How fatigued did you feel within the first 30 minutes of waking up?',1,1),(6,'What did you do within those first 30 minutes?',1,1),(7,'Overall, how fatigued did you feel throughout the day?',1,2),(8,'How did your levels of fatigue and resilience change throughout the day?',1,2),(9,'How did your fatigue and resilience affect your actions, performance, and interactions?',1,2),(10,'What did you do today that was active in nature? ',1,2),(11,'What factors influenced today’s level of activity?',1,2),(12,'What trends have you noticed in the quality and quantity of your sleep over the last week? What factors do you think influenced these trends?',2,NULL),(13,'What trends were there between your sleep (quality and/or quantity) and rated levels of fatigue? ',2,NULL),(14,'What trends were there in how your daily levels of fatigue and resilience impacted your actions performance and/or interactions?',2,NULL),(15,'Moving into the next week, what would you like to see in regard to the quality and quantity of your sleep?',2,NULL),(16,'Over the last week, how did your work schedule affect your levels of fatigue and resilience?',2,NULL),(17,'What trends have you noticed in the quality and quantity of your activity & exercise levels? What factors do you think influenced these trends? ',2,NULL),(18,'Moving into the next week, what would you like to see in regard to the quality and quantity of your activity & exercise levels?  ',2,NULL),(19,'Reflecting on the incidences of significance you mentioned in your daily logs this week, what stands out to you and why?',2,NULL);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_answer`
--

DROP TABLE IF EXISTS `question_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_answer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Question_Id` int DEFAULT NULL,
  `OfferedAnswer_Id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sqa_question_id_fk_idx` (`Question_Id`),
  KEY `offered_answer_id_fk_idx` (`OfferedAnswer_Id`),
  CONSTRAINT `offered_answer_id_fk` FOREIGN KEY (`OfferedAnswer_Id`) REFERENCES `offered_answer` (`Id`),
  CONSTRAINT `sqa_question_id_fk` FOREIGN KEY (`Question_Id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_answer`
--

LOCK TABLES `question_answer` WRITE;
/*!40000 ALTER TABLE `question_answer` DISABLE KEYS */;
INSERT INTO `question_answer` VALUES (1,1,1),(2,1,2),(3,2,NULL),(4,3,NULL),(5,4,NULL),(6,5,3),(7,5,4),(8,5,5),(9,5,6),(10,5,7),(11,5,8),(12,5,9),(13,6,NULL),(14,7,10),(15,7,11),(16,7,12),(17,7,13),(18,7,14),(19,7,15),(20,7,16),(21,8,NULL),(22,9,NULL),(23,10,NULL),(24,11,NULL),(25,12,NULL),(26,13,NULL),(27,14,NULL),(28,15,NULL),(29,16,NULL),(30,17,NULL),(31,18,NULL),(32,19,NULL);
/*!40000 ALTER TABLE `question_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey`
--

DROP TABLE IF EXISTS `survey`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(100) NOT NULL,
  `surveyDate` date DEFAULT NULL,
  `nurses_ID` int DEFAULT NULL,
  `survey_type_id` int DEFAULT NULL,
  `fitbitData_id` int DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_Survey_survey_type1_idx` (`survey_type_id`),
  KEY `fk_Survey_nurses1_idx` (`nurses_ID`),
  KEY `fk_Survey_fitbitData1_idx` (`fitbitData_id`),
  CONSTRAINT `fk_Survey_fitbitData1` FOREIGN KEY (`fitbitData_id`) REFERENCES `fitbitdata` (`id`),
  CONSTRAINT `fk_Survey_nurses1` FOREIGN KEY (`nurses_ID`) REFERENCES `nurses` (`ID`),
  CONSTRAINT `fk_Survey_survey_type1` FOREIGN KEY (`survey_type_id`) REFERENCES `survey_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey`
--

LOCK TABLES `survey` WRITE;
/*!40000 ALTER TABLE `survey` DISABLE KEYS */;
INSERT INTO `survey` VALUES (1,'test survey','2022-05-24',2,1,NULL),(5,'Test Description','2022-05-26',2,1,NULL),(6,'Test Description','2022-05-26',2,1,NULL),(7,'Test Description','2022-05-26',2,1,NULL),(8,'Test Description','2022-05-26',2,1,NULL),(9,'Test Description','2022-05-26',2,1,NULL),(10,'Test Description','2022-05-26',2,1,NULL),(11,'Test Description','2022-06-07',2,1,NULL),(12,'Test Description','2022-06-07',2,1,NULL),(13,'Test Description','2022-06-07',2,1,NULL),(14,'Test Description','2022-06-07',2,2,NULL);
/*!40000 ALTER TABLE `survey` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_question`
--

DROP TABLE IF EXISTS `survey_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_question` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Survey_Id` int DEFAULT NULL,
  `Question_Id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `survey_id_fk_idx` (`Survey_Id`),
  KEY `question_id_fk_idx` (`Question_Id`),
  CONSTRAINT `question_id_fk` FOREIGN KEY (`Question_Id`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `survey_id_fk` FOREIGN KEY (`Survey_Id`) REFERENCES `survey` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_question`
--

LOCK TABLES `survey_question` WRITE;
/*!40000 ALTER TABLE `survey_question` DISABLE KEYS */;
INSERT INTO `survey_question` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,1,6),(7,1,7),(8,1,8),(9,1,9),(10,1,10),(11,1,11),(20,10,1),(21,10,2),(22,10,3),(23,10,4),(24,10,5),(25,10,6),(26,10,7),(27,10,8),(28,10,9),(29,10,10),(30,10,11),(31,11,1),(32,11,7),(33,11,8),(34,11,9),(35,11,10),(36,11,11),(37,12,1),(38,12,2),(39,12,3),(40,12,4),(41,12,5),(42,12,6),(43,13,12),(44,13,13),(45,13,14),(46,13,15),(47,13,16),(48,13,17),(49,13,18),(50,13,19),(51,14,12),(52,14,13),(53,14,14),(54,14,15),(55,14,16),(56,14,17),(57,14,18),(58,14,19);
/*!40000 ALTER TABLE `survey_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `survey_type`
--

DROP TABLE IF EXISTS `survey_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `survey_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `surveyType` varchar(45) DEFAULT NULL,
  `descrption` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `survey_type`
--

LOCK TABLES `survey_type` WRITE;
/*!40000 ALTER TABLE `survey_type` DISABLE KEYS */;
INSERT INTO `survey_type` VALUES (1,'daily','daily question'),(2,'weekly','weekly question');
/*!40000 ALTER TABLE `survey_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surveyanswer`
--

DROP TABLE IF EXISTS `surveyanswer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surveyanswer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `answer` text,
  `survey_question_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_survey_question_id_idx` (`survey_question_id`),
  CONSTRAINT `fk_survey_question_id` FOREIGN KEY (`survey_question_id`) REFERENCES `survey_question` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surveyanswer`
--

LOCK TABLES `surveyanswer` WRITE;
/*!40000 ALTER TABLE `surveyanswer` DISABLE KEYS */;
INSERT INTO `surveyanswer` VALUES (1,'1',1),(2,'test',2),(3,'test1',3),(4,'3',4),(5,'1',20),(6,'test',21),(7,'test',22),(8,'test',23),(9,'4',24),(10,'test',25),(11,'10',26),(12,'test',27),(13,'test',28),(14,'test',29),(15,'test',30),(16,'2',31),(17,'10',32),(18,'asdfds',33),(19,'asdfs',34),(20,'asdfsd',35),(21,'asdfsdf',36),(22,'1',37),(23,'sadfsdaf',38),(24,'asdfsd',39),(25,'asdfsdf',40),(26,'5',41),(27,'asdfsdfsdf',42),(28,'sfdasdf',43),(29,'asdfasdf',44),(30,'asdfasdf',45),(31,'asdfasdf',46),(32,'asdfasdf',47),(33,'asfasdfsad',48),(34,'asdfasdf',49),(35,'sdfsadfgsdfgfd',50),(36,'test',51),(37,'asdfasdf',52),(38,'asdfasdf',53),(39,'asdfasdf',54),(40,'asdfasdf',55),(41,'asdfasdf',56),(42,'asdfasdf',57),(43,'asdfasfsd',58);
/*!40000 ALTER TABLE `surveyanswer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `surveys`
--

DROP TABLE IF EXISTS `surveys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `surveys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(255) DEFAULT NULL,
  `surveyDate` varchar(255) DEFAULT NULL,
  `nurses_ID` int DEFAULT NULL,
  `survey_type_id` int DEFAULT NULL,
  `fitbitDataId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `surveys`
--

LOCK TABLES `surveys` WRITE;
/*!40000 ALTER TABLE `surveys` DISABLE KEYS */;
INSERT INTO `surveys` VALUES (1,'Test Description','2022-05-26T06:47:26.532Z',2,1,NULL);
/*!40000 ALTER TABLE `surveys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(60) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `gender` varchar(15) DEFAULT NULL,
  `user_infocol` varchar(45) DEFAULT NULL,
  `userID` varchar(45) DEFAULT NULL,
  `nurses_ID` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_user_info_nurses1_idx` (`nurses_ID`),
  CONSTRAINT `fk_user_info_nurses1` FOREIGN KEY (`nurses_ID`) REFERENCES `nurses` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-07 17:19:34
