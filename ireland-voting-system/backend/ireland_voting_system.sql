CREATE DATABASE ireland_voting_system;

USE ireland_voting_system;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE face_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  face_descriptor TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE presidential_candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  party VARCHAR(100) NOT NULL,
  image_url VARCHAR(255) NOT NULL
);

-- Drop existing table if it exists
DROP TABLE IF EXISTS candidates;

-- Create new candidates table
CREATE TABLE candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32) CHARACTER SET ascii NOT NULL,
  party VARCHAR(32),
  image_url VARCHAR(32)
);

-- Insert up to 4 general election candidates
INSERT INTO candidates (name, party, image_url) VALUES
('Alice Byrne', 'Fine Gael', 'images/FGlogo.jpeg'),
('Brian O\'Connell', 'Fianna Fail', 'images/FFlogo.jpeg'),
('Ciara Murphy', 'Labour', 'images/Labourlogo.png'),
('David Keane', 'Sinn Fein', 'images/SFlogo.jpeg');

CREATE TABLE mayor_candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  party VARCHAR(100) NOT NULL,
  image_url VARCHAR(255)
);

INSERT INTO mayor_candidates (name, party, image_url)
VALUES 
  ('Siobhán Gallagher', 'Fianna Fail', 'images/FFlogo.jpeg'),
  ('Conor Murphy', 'Green Party', 'images/GPlogo.png'),
  ('Aisling Byrne', 'Fine Gael', 'images/FGlogo.jpeg'),
  ('Declan O\'Sullivan', 'Sinn Fein', 'images/SFlogo.jpeg'),
  ('Fiona Walsh', 'Labour', 'images/Labourlogo.png');

CREATE TABLE presidential_candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  party VARCHAR(100) NOT NULL,
  image_url VARCHAR(255)
);

INSERT INTO presidential_candidates (name, party, image_url)
VALUES 
  ('Eamon Fitzgerald', 'Fianna Fail', 'images/FFlogo.jpeg'),
  ('Bridget Ní Chonaill', 'Sinn Fein', 'images/SFlogo.jpeg'),
  ('Ronan McKeown', 'Fine Gael', 'images/FGlogo.jpeg'),
  ('Maeve O\'Donoghue', 'Labour', 'images/Labourlogo.png'),
  ('Darragh O\'Toole', 'Aontu', 'images/Aontulogo.jpeg');


