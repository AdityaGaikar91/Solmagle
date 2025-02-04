CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  interests TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_interests ON users USING gin(interests);