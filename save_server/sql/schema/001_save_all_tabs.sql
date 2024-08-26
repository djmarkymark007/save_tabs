-- +goose Up
CREATE TABLE IF NOT EXISTS save_all_tabs(
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    titles TEXT[] NOT NULL,
    urls TEXT[] NOT NULL
);

-- +goose Down
DROP TABLE IF EXISTS save_all_tabs;