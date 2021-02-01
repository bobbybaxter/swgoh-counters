SELECT
	vl.id,
	vl.subjectId,
	vlv.link,
	vlv.title,
	vlv.createdOn,
	vlv.createdById,
	vlv.createdByName
FROM videoLink vl
JOIN videoLinkVersion vlv ON vlv.id = vl.latestVersionId
WHERE vl.subjectId = ?
ORDER BY vlv.createdOn DESC;