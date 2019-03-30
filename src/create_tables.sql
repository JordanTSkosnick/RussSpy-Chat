CREATE TABLE users (
    name TEXT NOT NULL PRIMARY KEY,
	password TEXT
);
CREATE TABLE rooms (
    name TEXT NOT NULL PRIMARY KEY,
	creator TEXT
);
CREATE TABLE logs (
    room TEXT NOT NULL,
    user TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    FOREIGN KEY (room) REFERENCES rooms(name)
);
