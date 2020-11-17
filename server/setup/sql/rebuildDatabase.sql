SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE squad;
DROP TABLE squadVersion;
DROP TABLE `character`;
DROP TABLE counter;
DROP TABLE counterVersion;
DROP TABLE videoLink;
DROP TABLE videoLinkVersion;
DROP TABLE event;
DROP TABLE eventVersion;
DROP TABLE eventTier;
DROP TABLE eventTierVersion;
DROP TABLE eventTierSquad;
DROP TABLE eventTierSquadVersion;
DROP TABLE `user`;
DROP TABLE watchlist;
DROP TABLE userWatchlist;
DROP TABLE userWatchlistItem;
DROP TABLE zeta;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `squad` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `latestVersionId` VARCHAR(50)
);

CREATE TABLE `squadVersion` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `squadId` VARCHAR(50),
  `description` VARCHAR(2000),
  `counterStrategy` VARCHAR(2000),
  `toon1Id` VARCHAR(50),
  `toon2Id` VARCHAR(50),
  `toon3Id` VARCHAR(50),
  `toon4Id` VARCHAR(50),
  `toon5Id` VARCHAR(50),
  `createdOn` datetime NOT NULL,
  `createdBy` VARCHAR(50) NOT NULL
);

CREATE TABLE `character` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `name` VARCHAR(50) NOT NULL
);

CREATE TABLE `counter` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `opponentSquadId` VARCHAR(50) NOT NULL,
  `counterSquadId` VARCHAR(50) NOT NULL,
  `latestVersionId` VARCHAR(50)
);

CREATE TABLE `counterVersion` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `counterId` VARCHAR(50) NOT NULL,
  `isHardCounter` boolean NOT NULL,
  `battleType` VARCHAR(50) NOT NULL,
  `description` VARCHAR(2000),
  `isToon2Req` boolean,
  `isToon3Req` boolean,
  `isToon4Req` boolean,
  `isToon5Req` boolean,
  `toon1Zetas` VARCHAR(500),
  `toon2Zetas` VARCHAR(500),
  `toon3Zetas` VARCHAR(500),
  `toon4Zetas` VARCHAR(500),
  `toon5Zetas` VARCHAR(500),
  `createdOn` datetime NOT NULL,
  `createdBy` VARCHAR(50) NOT NULL
);

CREATE TABLE `videoLink` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `subjectId` VARCHAR(50) NOT NULL,
  `latestVersionId` VARCHAR(50)
);

CREATE TABLE `videoLinkVersion` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `videoLinkId` VARCHAR(50) NOT NULL,
  `subjectType` VARCHAR(50) NOT NULL,
  `link` VARCHAR(255) NOT NULL,
  `description` VARCHAR(50) NOT NULL,
  `createdOn` datetime NOT NULL,
  `createdBy` VARCHAR(50) NOT NULL
);

CREATE TABLE `event` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `latestVersionId` VARCHAR(50)
);

CREATE TABLE `eventVersion` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `eventId` VARCHAR(50) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `createdOn` datetime NOT NULL,
  `createdBy` VARCHAR(50) NOT NULL
);

CREATE TABLE `eventTier` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `eventId` VARCHAR(50) NOT NULL,
  `latestVersionId` VARCHAR(50)
);

CREATE TABLE `eventTierVersion` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `eventTierId` VARCHAR(50) NOT NULL,
  `orderNum` int NOT NULL,
  `requirements` VARCHAR(2000),
  `createdOn` datetime NOT NULL,
  `createdBy` VARCHAR(50) NOT NULL
);

CREATE TABLE `eventTierSquad` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `eventTierId` VARCHAR(50) NOT NULL,
  `squadId` VARCHAR(50) NOT NULL,
  `latestVersionId` VARCHAR(50)
);

CREATE TABLE `eventTierSquadVersion` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `eventTierSquadId` VARCHAR(50) NOT NULL,
  `power` int NOT NULL,
  `description` VARCHAR(2000),
  `createdOn` datetime NOT NULL,
  `createdBy` VARCHAR(50) NOT NULL
);

CREATE TABLE `user` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `name` VARCHAR(50) NOT NULL
);

CREATE TABLE `watchlist` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL
);

CREATE TABLE `userWatchlist` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `userId` VARCHAR(50) NOT NULL,
  `watchlistId` VARCHAR(50) NOT NULL
);

CREATE TABLE `userWatchlistItem` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `userWatchlistId` VARCHAR(50) NOT NULL,
  `itemId` VARCHAR(50) NOT NULL
);

CREATE TABLE `zeta` (
  `id` VARCHAR(50) PRIMARY KEY NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `characterId` VARCHAR(50) NOT NULL
);

ALTER TABLE `squad` ADD FOREIGN KEY (`latestVersionId`) REFERENCES `squadVersion` (`id`);

ALTER TABLE `squadVersion` ADD FOREIGN KEY (`toon1Id`) REFERENCES `character` (`id`);

ALTER TABLE `squadVersion` ADD FOREIGN KEY (`toon2Id`) REFERENCES `character` (`id`);

ALTER TABLE `squadVersion` ADD FOREIGN KEY (`toon3Id`) REFERENCES `character` (`id`);

ALTER TABLE `squadVersion` ADD FOREIGN KEY (`toon4Id`) REFERENCES `character` (`id`);

ALTER TABLE `squadVersion` ADD FOREIGN KEY (`toon5Id`) REFERENCES `character` (`id`);

ALTER TABLE `squadVersion` ADD FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`);

ALTER TABLE `counter` ADD FOREIGN KEY (`opponentSquadId`) REFERENCES `squad` (`id`);

ALTER TABLE `counter` ADD FOREIGN KEY (`counterSquadId`) REFERENCES `squad` (`id`);

ALTER TABLE `counter` ADD FOREIGN KEY (`latestVersionId`) REFERENCES `counterVersion` (`id`);

ALTER TABLE `counterVersion` ADD FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`);

ALTER TABLE `videoLink` ADD FOREIGN KEY (`latestVersionId`) REFERENCES `videoLinkVersion` (`id`);

ALTER TABLE `videoLinkVersion` ADD FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`);

ALTER TABLE `event` ADD FOREIGN KEY (`latestVersionId`) REFERENCES `eventVersion` (`id`);

ALTER TABLE `eventVersion` ADD FOREIGN KEY (`eventId`) REFERENCES `event` (`id`);

ALTER TABLE `eventVersion` ADD FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`);

ALTER TABLE `eventTier` ADD FOREIGN KEY (`eventId`) REFERENCES `event` (`id`);

ALTER TABLE `eventTier` ADD FOREIGN KEY (`latestVersionId`) REFERENCES `eventTierVersion` (`id`);

ALTER TABLE `eventTierVersion` ADD FOREIGN KEY (`eventTierId`) REFERENCES `eventTier` (`id`);

ALTER TABLE `eventTierVersion` ADD FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`);

ALTER TABLE `eventTierSquad` ADD FOREIGN KEY (`eventTierId`) REFERENCES `eventTier` (`id`);

ALTER TABLE `eventTierSquad` ADD FOREIGN KEY (`squadId`) REFERENCES `squad` (`id`);

ALTER TABLE `eventTierSquad` ADD FOREIGN KEY (`latestVersionId`) REFERENCES `eventTierSquadVersion` (`id`);

ALTER TABLE `eventTierSquadVersion` ADD FOREIGN KEY (`eventTierSquadId`) REFERENCES `eventTierSquad` (`id`);

ALTER TABLE `eventTierSquadVersion` ADD FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`);

ALTER TABLE `userWatchlist` ADD FOREIGN KEY (`userId`) REFERENCES `user` (`id`);

ALTER TABLE `userWatchlist` ADD FOREIGN KEY (`watchlistId`) REFERENCES `watchlist` (`id`);

ALTER TABLE `userWatchlistItem` ADD FOREIGN KEY (`userWatchlistId`) REFERENCES `userWatchlist` (`id`);
