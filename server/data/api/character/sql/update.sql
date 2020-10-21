UPDATE `character`
SET name = coalesce(?, name)
WHERE id = ?;