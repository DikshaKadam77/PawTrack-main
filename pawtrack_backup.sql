-- MySQL dump 10.13  Distrib 9.4.0, for macos15 (arm64)
--
-- Host: localhost    Database: pawtrack_db
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animals`
--

DROP TABLE IF EXISTS `animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `age_approx` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `animal_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `identification_marks` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qr_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `report_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnpsvgsqm9dhtmprglrs8sgt1s` (`report_id`),
  CONSTRAINT `FKghi8a5mhe2qv41f32cv8y5w5g` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animals`
--

LOCK TABLES `animals` WRITE;
/*!40000 ALTER TABLE `animals` DISABLE KEYS */;
/*!40000 ALTER TABLE `animals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `donor_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `payment_id` varchar(255) DEFAULT NULL,
  `order_id` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (1,'Test Donor','test@example.com','9999999999',500,'INR',NULL,NULL,'PENDING','2025-10-22 17:49:50'),(2,'Chinmay','chinmaykale998@gmail.com','9999999999',500,'INR',NULL,NULL,'PENDING','2025-10-22 17:57:36'),(3,'Anonymous Donor',NULL,NULL,1,NULL,'pay_RXa0RgsxajtyzE','order_RXa05OIabmxj5t',NULL,'2025-10-24 23:19:37'),(4,'Anonymous Donor',NULL,NULL,1,NULL,'pay_RXa5t4q2xJJRBN','order_RXa5aRmtexpe9W',NULL,'2025-10-24 23:24:45'),(5,'Anonymous Donor',NULL,NULL,1,NULL,'pay_RXaRunxRH5utqW','order_RXaReJCNti2Xsz',NULL,'2025-10-24 23:45:37');
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `animal_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reporter_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reporter_phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qr_code_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `animal_condition` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Unknown',
  `urgency_level` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Medium',
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `report_code` (`report_code`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,'Dog','2025-10-22 11:28:20.000000','Found injured dog near road, needs medical care urgently.',NULL,'Navi Mumbai','Chinmay','9876543210','treated',NULL,'RPT-1735234523','Injured Leg','High',NULL),(3,'Cat','2025-10-22 08:33:48.868346','My cat lost she is of brown color with some spots on the body',NULL,'19.24747, 73.15009','Ck','7208577332','treated',NULL,'RPT-1761122028868','Lost','medium',NULL),(4,'Cow','2025-10-22 13:03:15.617976','Cow is abused by some group of people',NULL,'19.24742, 73.15021','Chinmay','7208577332','treated',NULL,'RPT-1761138195618','Abused','medium',NULL),(5,'Pig','2025-10-22 22:16:30.672832','Pig is injured',NULL,'19.24746, 73.15002','Radhika','9324777348','treated',NULL,'RPT-1761171390672','Malnourished','critical',NULL),(6,'Dog','2025-10-22 23:58:34.605741','Found a sick dog near the footpath',NULL,'19.24739, 73.15002','Chinmay','9324777348','in-progress',NULL,'RPT-1761177514605','Sick','critical',NULL),(7,'Cat','2025-10-23 00:04:32.723997','Cat go injured',NULL,'19.24738, 73.14998','Chinmay','7208577332','pending',NULL,'RPT-1761177872724','Injured','critical',NULL);
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rescues`
--

DROP TABLE IF EXISTS `rescues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rescues` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `follow_up_needed` bit(1) DEFAULT NULL,
  `next_visit_date` datetime(6) DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rescue_date` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `animal_id` bigint NOT NULL,
  `rescued_by_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKg840cjam5vbclnsdar1ifgis1` (`animal_id`),
  KEY `FKhoaqcrwcw0u0vt4q24v1sqwk7` (`rescued_by_id`),
  CONSTRAINT `FKg840cjam5vbclnsdar1ifgis1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`id`),
  CONSTRAINT `FKhoaqcrwcw0u0vt4q24v1sqwk7` FOREIGN KEY (`rescued_by_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rescues`
--

LOCK TABLES `rescues` WRITE;
/*!40000 ALTER TABLE `rescues` DISABLE KEYS */;
/*!40000 ALTER TABLE `rescues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKdu5v5sr43g5bfnji4vb8hg5s3` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,NULL,'helpingpaws@gmail.com','Helping Paws Foundation','1234',NULL,'ngo',NULL),(2,NULL,NULL,'safetails@gmail.com','SafeTails Animal Care','$2a$10$L7sEfKcMatsk99QX3I8uJek7LlfenZmugtOC/9/rezVaiFMI6N2q6','N/A','ngo',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-25 11:09:49
