-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- Cats (preloaded)
CREATE TABLE IF NOT EXISTS cats (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  initial TEXT NOT NULL,
  color TEXT NOT NULL,
  notes TEXT
);

INSERT OR IGNORE INTO cats (id, name, initial, color, notes) VALUES
(1, 'Iris', 'I', '#ffb3c6', 'Sweet, shy, loves window naps'),
(2, 'Jasper', 'J', '#ffd59e', 'Playful troublemaker, loves toys'),
(3, 'Raja', 'R', '#c8d9ff', 'Calm, gentle, loves brushing'),
(4, 'Cali', 'C', '#b8f2e6', 'Talkative, curious, loves treats');

-- Fixed task template
CREATE TABLE IF NOT EXISTS tasks_template (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT OR IGNORE INTO tasks_template (id, name) VALUES
(1, 'Feeding'),
(2, 'Fresh Water'),
(3, 'Litter Cleaning'),
(4, 'Grooming'),
(5, 'Playtime'),
(6, 'Medications'),
(7, 'Treat Time'),
(8, 'Behavior Notes');

-- Completed tasks (per day, per user, per cat)
CREATE TABLE IF NOT EXISTS tasks_completed (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  cat_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  UNIQUE(user_id, cat_id, task_id, date)
);

-- Vet records
CREATE TABLE IF NOT EXISTS vet_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  cat_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  date TEXT NOT NULL
);
