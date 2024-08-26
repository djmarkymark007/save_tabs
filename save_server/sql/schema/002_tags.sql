-- +goose Up
CREATE TABLE IF NOT EXISTS tags(
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    show BOOLEAN,
    tag TEXT NOT NULL
);

-- +goose Down
DROP TABLE IF EXISTS tags