-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 25, 2018 at 05:58 PM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sdb_dosulliv`
--

-- --------------------------------------------------------

--
-- Table structure for table `listings`
--

CREATE TABLE `listings` (
  `id` int(10) NOT NULL,
  `userId` int(11) NOT NULL DEFAULT '0',
  `businessName` varchar(30) COLLATE utf8_bin NOT NULL DEFAULT '',
  `location` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `description` text COLLATE utf8_bin NOT NULL,
  `businessType` varchar(20) COLLATE utf8_bin NOT NULL DEFAULT '',
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `matched` tinyint(1) NOT NULL DEFAULT '1',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `listings`
--

INSERT INTO `listings` (`id`, `userId`, `businessName`, `location`, `description`, `businessType`, `verified`, `matched`, `created`, `updated`) VALUES
(1, 2, 'Whazup International', 'Dublin', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', 'Education', 1, 1, '2018-11-24 12:48:53', '2018-11-24 12:49:29'),
(3, 2, 'tes', 'tes', 'tes', 'Retail', 1, 1, '2018-11-24 12:48:53', '2018-11-24 12:49:29'),
(8, 2, 'testereree', 'Amsteram', 'ijabsdi iihasdkahskasdnda', 'Lifestyle', 1, 1, '2018-11-24 12:48:53', '2018-11-24 12:49:29'),
(10, 2, 'test', 'ghtegg', 'jhasdkjand asdaskjbhkbas', 'Health Care', 1, 1, '2018-11-24 12:48:53', '2018-11-24 12:49:29'),
(11, 2, 'a', 'a', 'a', 'Arts', 1, 1, '2018-11-24 12:48:53', '2018-11-25 12:48:59'),
(12, 2, 'd', 'd', 'd', 'Health Care', 1, 1, '2018-11-24 12:48:53', '2018-11-25 12:50:07'),
(14, 2, 'd', 'd', 'd', 'Retail', 0, 1, '2018-11-24 12:48:53', '2018-11-24 12:49:29'),
(24, 1, 'verified', 'bu', 'ajsdn kjnasd', 'Retail', 0, 1, '2018-11-25 14:16:16', '2018-11-25 14:16:16'),
(25, 1, 'up', 'kasdb ', 'kjabksd', 'Arts', 0, 1, '2018-11-25 14:17:47', '2018-11-25 14:17:47'),
(26, 1, 'another t', 'tes', 'asjadsn', 'Retail', 1, 1, '2018-11-25 14:19:10', '2018-11-25 14:37:16'),
(27, 1, 'try ', 'again', 'ajnsdannas,d', 'Dining', 1, 1, '2018-11-25 14:21:24', '2018-11-25 14:38:43'),
(28, 1, 'scad', 'mads', 'kjands', 'Dining', 0, 1, '2018-11-25 14:22:15', '2018-11-25 14:22:15'),
(29, 1, 'kbad', 'ambsd', 'kjans,das', 'Retail', 0, 1, '2018-11-25 14:23:15', '2018-11-25 14:23:15'),
(31, 1, 'test', 'test', 'jhbasdb', 'Retail', 0, 1, '2018-11-25 14:27:55', '2018-11-25 14:27:55');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(10) NOT NULL,
  `userId` int(10) NOT NULL DEFAULT '0',
  `cookieId` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `timeoutTime` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `startTime` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `userId`, `cookieId`, `timeoutTime`, `startTime`) VALUES
(59, 1, 'tAPr94U284Q08kwbAla25jVoW2IowxIdBynFxoJB37Nr0p56KB', 1543162345, 1543161745),
(60, 1, 'ZHfaaDy24VCVt4cYnKWvyDCITOCuESA0RkH6krRvYvW2hRXjkW', 1543162359, 1543161759),
(63, 1, 'qr5Mt01hHvpNoNwtWJ5IxkEzvDRAoAqA7EMPzthKGRlXnspEaj', 1543164795, 1543164195);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) COLLATE utf8_bin NOT NULL DEFAULT '',
  `firstName` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `lastName` varchar(50) COLLATE utf8_bin NOT NULL DEFAULT '',
  `password` varchar(50) COLLATE utf8_bin NOT NULL,
  `gradYear` smallint(4) NOT NULL DEFAULT '0',
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `firstName`, `lastName`, `password`, `gradYear`, `admin`, `created`, `updated`) VALUES
(1, 'dara@gmail.com', 'Dara', 'O\'Sullivan', 'cc03e747a6afbbcbf8be7668acfebee5', 2019, 1, '2018-11-25 14:42:26', '2018-11-25 16:43:27'),
(2, 'dara2@gmail.com', 'Dara2', 'OSul', 'cc03e747a6afbbcbf8be7668acfebee5', 2020, 0, '2018-11-25 14:42:26', '2018-11-25 14:42:47'),
(3, 'asdc', 'asd', 'asd', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 2002, 0, '2018-11-25 16:42:22', '2018-11-25 16:42:22'),
(4, 'user@test', 'Test', 'User', '0b4e7a0e5fe84ad35fb5f95b9ceeac79', 2015, 0, '2018-11-25 16:54:29', '2018-11-25 16:54:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `listings`
--
ALTER TABLE `listings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `listings`
--
ALTER TABLE `listings`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
