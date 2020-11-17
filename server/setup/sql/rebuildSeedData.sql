SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE userWatchlistItem;
TRUNCATE TABLE userWatchlist;
TRUNCATE TABLE watchlist;
TRUNCATE TABLE eventTierSquadVersion;
TRUNCATE TABLE eventTierSquad;
TRUNCATE TABLE eventTierVersion;
TRUNCATE TABLE eventTier;
TRUNCATE TABLE eventVersion;
TRUNCATE TABLE `event`;
TRUNCATE TABLE `user`;

INSERT INTO `user`
	(id, name)
VALUES(
	'user1', 'User 1');

INSERT INTO eventVersion
	(id, eventId, `type`, createdOn, createdBy)
VALUES
	('event1Version1', 'event1', 'Ancient Journey', CURRENT_TIMESTAMP, 'user1'),
	('event2Version1', 'event2', 'Assault Battle', CURRENT_TIMESTAMP, 'user1');

INSERT INTO eventTier 
	(id, name, eventId, latestVersionId)
VALUES
	('event1eventTier1', 'Event Tier 1', 'event1', 'event1eventTier1Version1'),
	('event1eventTier2', 'Event Tier 2', 'event1', 'event1eventTier2Version1'),
	('event1eventTier3', 'Event Tier 3', 'event1', 'event1eventTier3Version1'),
	('event2eventTier1', 'Event Tier 1', 'event2', 'event2eventTier1Version1'),
	('event2eventTier2', 'Event Tier 2', 'event2', 'event2eventTier2Version1'),
	('event2eventTier3', 'Event Tier 3', 'event2', 'event2eventTier3Version1');

INSERT INTO eventTierVersion
	(id,
	eventTierId,
	orderNum,
	requirements,
	createdOn,
	createdBy)
VALUES
	('event1eventTier1Version1', 'event1eventTier1', 1, 'Event 1 - Event Tier 1 Requirements', CURRENT_TIMESTAMP,'user1'),
	('event1eventTier2Version1', 'event1eventTier2', 2, 'Event 1 - Event Tier 2 Requirements', CURRENT_TIMESTAMP,'user1'),
	('event1eventTier3Version1', 'event1eventTier3', 3, 'Event 1 - Event Tier 3 Requirements', CURRENT_TIMESTAMP,'user1'),
	('event2eventTier1Version1', 'event2eventTier1', 1, 'Event 2 - Event Tier 1 Requirements', CURRENT_TIMESTAMP,'user1'),
	('event2eventTier2Version1', 'event2eventTier2', 2, 'Event 2 - Event Tier 2 Requirements', CURRENT_TIMESTAMP,'user1'),
	('event2eventTier3Version1', 'event2eventTier3', 3, 'Event 2 - Event Tier 3 Requirements', CURRENT_TIMESTAMP,'user1');

INSERT INTO eventTierSquad 
	(id, eventTierId, squadId, latestVersionId)
VALUES
	('eventTierSquad1', 'event1eventTier1', '501ST', 'eventTierSquad1Version1'),
	('eventTierSquad2', 'event1eventTier2', 'SITH_EMPIRE_W_MALAK', 'eventTierSquad2Version1'),
	('eventTierSquad3', 'event1eventTier3', '501ST', 'eventTierSquad3Version1'),
	('eventTierSquad4', 'event2eventTier1', 'SITH_EMPIRE_W_MALAK', 'eventTierSquad4Version1'),
	('eventTierSquad5', 'event2eventTier2', '501ST', 'eventTierSquad5Version1'),
	('eventTierSquad6', 'event2eventTier3', 'SITH_EMPIRE_W_MALAK', 'eventTierSquad6Version1');

INSERT INTO eventTierSquadVersion
	(id, eventTierSquadId, `power`, description, createdOn, createdBy)
VALUES
	('eventTierSquad1Version1', 'eventTierSquad1', '60000', 'Event Tier Squad 1 on how to beat Event 1 - Event Tier 1', CURRENT_TIMESTAMP, 'user1'),
	('eventTierSquad2Version1', 'eventTierSquad2', '70000', 'Event Tier Squad 2 on how to beat Event 1 - Event Tier 2', CURRENT_TIMESTAMP, 'user1'),
	('eventTierSquad3Version1', 'eventTierSquad3', '80000', 'Event Tier Squad 3 on how to beat Event 1 - Event Tier 3', CURRENT_TIMESTAMP, 'user1'),
	('eventTierSquad4Version1', 'eventTierSquad4', '70000', 'Event Tier Squad 4 on how to beat Event 1 - Event Tier 1', CURRENT_TIMESTAMP, 'user1'),
	('eventTierSquad5Version1', 'eventTierSquad5', '80000', 'Event Tier Squad 5 on how to beat Event 1 - Event Tier 2', CURRENT_TIMESTAMP, 'user1'),
	('eventTierSquad6Version1', 'eventTierSquad6', '90000', 'Event Tier Squad 6 on how to beat Event 1 - Event Tier 3', CURRENT_TIMESTAMP, 'user1');

INSERT INTO watchlist 
	(id)
VALUES
	('watchlist1');

INSERT INTO userWatchlist 
	(id, userId, watchlistId)
VALUES
	('userWatchlist1', 'user1', 'watchlist1');

INSERT INTO userWatchlistItem 
	(id, userWatchlistId, itemId)
VALUES
	('userWatchlistItem1', 'userWatchlist1', '501ST'),
	('userWatchlistItem2', 'userWatchlist1', 'SQUADSUB1'),
	('userWatchlistItem3', 'userWatchlist1', 'counter1'),
	('userWatchlistItem4', 'userWatchlist1', 'event1eventTier1'),
	('userWatchlistItem5', 'userWatchlist1', 'event2eventTier1'),
	('userWatchlistItem6', 'userWatchlist1', 'eventTierSquad1'),
	('userWatchlistItem7', 'userWatchlist1', 'eventTierSquad4');

INSERT INTO videoLink 
	(id, subjectId, latestVersionId)
VALUES
	('videoLink1', 'counter1', 'videoLink1Version1'),
	('videoLink2', 'event1', 'videoLink2Version1');

INSERT INTO videoLinkVersion
	(id,
	videoLinkId,
	subjectType,
	link,
	description,
	createdOn,
	createdBy)
VALUES
	('videoLink1Version1',
	'videoLink1', 
	'counter',
	'https://www.youtube.com',
	'Video Link 1 Version 1 Video',
	CURRENT_TIMESTAMP,
	'user1'),
	
	('videoLink2Version1',
	'videoLink1', 
	'event',
	'https://www.google.com',
	'Video Link 2 Version 1 Video',
	CURRENT_TIMESTAMP,
	'user1');

SET FOREIGN_KEY_CHECKS = 1;