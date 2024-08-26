-- +goose Up
CREATE TABLE IF NOT EXISTS tab_tags(
    tag_id UUID,
    webpage_id UUID,
    PRIMARY KEY (webpage_id, tag_id),
    FOREIGN KEY (webpage_id) REFERENCES save_webpage(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- +goose Down
DROP TABLE IF EXISTS tab_tags;