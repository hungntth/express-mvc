const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const crypto = require("crypto");

const dbPath = path.join(__dirname, "../database.sqlite");
const db = new sqlite3.Database(dbPath);

const init = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tạo bảng users
      db.run(
        `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          salt TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
        }
      );

      // Tạo bảng sessions (tùy chọn)
      db.run(
        `
        CREATE TABLE IF NOT EXISTS sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          session_token TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `,
        (err) => {
          if (err) {
            reject(err);
            return;
          }
        }
      );

      const adminPlainPassword = "aacckjb123";
      const adminSalt = crypto.randomBytes(16).toString("hex");
      const adminHashedPassword = crypto
        .pbkdf2Sync(adminPlainPassword, adminSalt, 10000, 64, "sha512")
        .toString("hex");

      db.run(
        `
        INSERT OR IGNORE INTO users (username, email, password, salt, role) 
        VALUES (?, ?, ?, ?, ?)
        `,
        ["admin", "admin@example.com", adminHashedPassword, adminSalt, "admin"],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          console.log("Database initialized successfully");
          resolve();
        }
      );
    });
  });
};

module.exports = {
  db,
  init,
};
