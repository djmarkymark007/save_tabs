-- name: SaveBrowserState :one
INSERT INTO save_all_tabs (id, created_at, titles, urls)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetAllBrowserStates :many
SELECT * FROM save_all_tabs;

-- name: GetLastBrowserState :one
SELECT * FROM save_all_tabs
ORDER BY created_at DESC 
LIMIT 1;

-- name: GetBrowserStatesByIndex :many
SELECT * FROM save_all_tabs
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

