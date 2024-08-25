-- +goose Up
CREATE TABLE save_all_tabs(
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    titles TEXT[] NOT NULL,
    urls TEXT[] NOT NULL
);

-- +goose Down
DROP TABLE save_all_tabs;