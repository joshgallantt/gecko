CREATE DATABASE gecko;
CREATE TABLE account (
  id SERIAL PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text,
  admin boolean NOT NULL DEFAULT false
);
CREATE TABLE project (
  id SERIAL PRIMARY KEY,
  key text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  completed boolean NOT NULL DEFAULT false
);
CREATE TABLE assignment (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
  project_key text REFERENCES project(key) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE ticket (
  id SERIAL PRIMARY KEY,
  project_key text REFERENCES project(key) ON DELETE CASCADE ON UPDATE CASCADE,
  author integer REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'Not Started'::text,
  type text,
  created timestamp without time zone DEFAULT now(),
  priority text,
  key text NOT NULL UNIQUE
);
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id integer REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ticket_key text REFERENCES ticket(key) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE comment (
  id SERIAL PRIMARY KEY,
  author integer REFERENCES account(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ticket_key text REFERENCES ticket(key) ON DELETE CASCADE ON UPDATE CASCADE,
  comment text,
  posted timestamp without time zone DEFAULT now()
);