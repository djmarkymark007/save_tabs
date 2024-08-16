-- +goose Up
CREATE TABLE save_webpage(
    id UUID PRIMARY KEY,
    create_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    has_read BOOLEAN,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
);

-- +goose Down
DROP TABLE save_webpage;