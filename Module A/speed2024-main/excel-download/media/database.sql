-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: web-stp_excel-download
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `comments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` bigint(20) unsigned NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_comment_id_foreign` (`post_id`),
  CONSTRAINT `posts_comment_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,'Eum quo saepe et commodi eos iure rerum. Error doloremque qui eos delectus. Fugiat est et eum dolore rem voluptatum excepturi. Necessitatibus incidunt eius assumenda ut modi.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(2,1,'Culpa aut consequatur cum magnam aut. Reprehenderit vel id dolores magni rem nam quis. Provident voluptas pariatur voluptas itaque. Ut officia ut distinctio enim.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(3,1,'Consequatur eius deleniti aut illum quidem sit. Ex iure quidem explicabo. Eos et fuga laborum aliquam.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(4,1,'Dolores repudiandae eveniet est exercitationem aliquam minus explicabo. Ut officiis amet incidunt cumque minus quidem modi. Eum id nesciunt qui consequatur adipisci.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(5,2,'Natus amet iste quo aliquid. Tempora sint alias possimus tempora ea culpa sit. Molestiae ut atque voluptatem qui nostrum similique optio.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(6,2,'Asperiores est aut maiores. Et magnam sunt suscipit. Et incidunt reprehenderit non et culpa qui vel.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(7,2,'Neque omnis nobis qui sed asperiores quos error. Dolor repellendus doloribus aspernatur qui aliquam. Qui et eos in adipisci minima dolores autem.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(8,3,'Nihil similique distinctio pariatur consequatur consequatur. Ullam hic explicabo labore sed ea et accusantium quod. Reiciendis animi eos vitae. Rem aliquam recusandae id saepe amet ea quisquam sed.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(9,3,'Rerum et id neque aspernatur placeat. Iste cum velit id non nobis aperiam libero omnis. Non reiciendis voluptas sunt aut rem aut dicta modi.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(10,3,'Voluptatem aut ut eum est alias rerum. Nihil rerum reiciendis optio sapiente nesciunt et. Minus hic asperiores et autem sed minus. Dicta qui magnam officia temporibus dolorem veniam repudiandae.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(11,4,'Rerum cum molestiae delectus non et. Deleniti minus atque dolor maxime tempora praesentium. Quos aut eos qui voluptates velit nihil amet. Quia quo laudantium qui veritatis.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(12,4,'Voluptatem nobis aperiam est sit distinctio eius eveniet. Temporibus harum dolor reprehenderit ducimus perspiciatis architecto. Labore hic exercitationem eaque quod. Et non et rerum ex.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(13,4,'Quae consequatur laborum sit in. Et sunt aut doloribus asperiores qui.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(14,4,'Debitis ut vitae officia id ipsa. Nobis ea maiores dolores. Dolorum esse reiciendis maxime alias nobis nihil id. Provident dolores doloribus eligendi dolor eos reprehenderit.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(15,4,'Aut laboriosam et totam natus. Nam neque eum veniam eveniet quis nulla. Doloremque voluptas eaque voluptatem voluptate quo quae.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(16,5,'Tempore voluptates quam optio voluptas officiis est voluptatum. Recusandae rerum id maxime. Nesciunt quos qui quam error. Sapiente voluptatem ut magnam eos mollitia.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(17,5,'Ratione et voluptatem non. Sint sint blanditiis ipsum dolorem dolor perferendis quos. Iusto consequatur voluptatem quaerat unde labore. Quis suscipit natus facere.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(18,5,'Et architecto expedita animi et dolores sed. Vero vitae porro nemo at numquam. Est atque reprehenderit repellendus harum quia eos mollitia ullam. Necessitatibus voluptatem facilis rerum ut.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(19,7,'Quia ut autem molestias earum quam. Aut doloremque aliquid rerum sunt. Ducimus occaecati eum qui accusamus officiis. Iste id sed omnis qui.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(20,7,'Nihil neque maxime vitae eos tempora non non. Ipsam sunt nulla maiores culpa quod. Facere est alias blanditiis et nam.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(21,8,'Consequatur quisquam consectetur quaerat. Natus doloremque sed est. Dolor ex deleniti eaque molestiae. Voluptas earum enim culpa.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(22,9,'Ab veritatis quae iste sequi impedit non. Praesentium soluta et nihil. Unde vel dolor illum non sed nesciunt veniam velit. Aut provident et odit dolorum.','2024-02-18 19:24:30','2024-02-18 19:24:30');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'Omnis incidunt fuga eos voluptatem quia.','Est quia nulla rerum nam aut quam ipsa. Est ut numquam architecto. Sequi necessitatibus molestias quis soluta sapiente ut fugit numquam. Enim incidunt rerum doloribus. Nihil voluptates natus quis quibusdam.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(2,'Ducimus adipisci debitis quidem voluptatem qui totam.','Maiores qui pariatur vel voluptate totam. Odio nam officiis quas dignissimos ratione. Quaerat quod qui aliquid facilis qui provident modi quisquam. Et molestiae maiores quae accusantium cumque qui impedit delectus.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(3,'Fuga consectetur dolor aut quae.','Non et accusamus earum facilis aut aliquid non fugit. Laborum quis eos deserunt rerum. Sint modi aut quia totam voluptate voluptas. Quos deserunt dolor eveniet mollitia libero expedita minima.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(4,'Fuga repellat voluptatem sit tempora.','Nobis et quaerat neque quos. Dolor autem mollitia qui distinctio in accusamus. Autem eum voluptates non.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(5,'Deleniti ut explicabo omnis cum.','Repudiandae ipsam voluptatum eligendi rerum. Eligendi ea facilis sint amet sit nihil.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(6,'Reiciendis id porro ipsam officia.','Assumenda asperiores est cupiditate sunt praesentium. Dolor mollitia maiores quia rerum numquam sit. Eos quis corrupti unde nihil aliquid.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(7,'Accusamus et ut quae atque quis soluta quia.','Aut odit maiores voluptatem nihil cupiditate cum quae cumque. Iure suscipit distinctio quos cupiditate. Reprehenderit doloribus rerum porro autem non quas aut. Ipsa omnis sunt enim laborum sed qui et.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(8,'Earum et est consequatur ut.','Omnis provident quis animi. Excepturi accusamus voluptas ut. Illo optio atque nobis minima et voluptas ut molestiae. Aliquid autem occaecati enim quibusdam excepturi ut.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(9,'Maiores et odit fugit mollitia et.','Commodi tempore aliquam tempora illo fuga. Occaecati et consequatur et iste et ab. Et voluptatem molestias sapiente voluptatem rerum et rerum totam.','2024-02-18 19:24:30','2024-02-18 19:24:30'),(10,'Expedita qui fuga laudantium dolor et.','Ipsam id voluptatem earum dolor ea voluptate. Harum sequi rerum quis voluptatibus aliquam omnis. Quis tempora aut minima et voluptatem officiis.','2024-02-18 19:24:30','2024-02-18 19:24:30');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-19 14:08:42
