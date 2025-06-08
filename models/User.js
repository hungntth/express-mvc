const { db } = require("./database");
const crypto = require("crypto");

class User {
  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC",
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static create(userData) {
    return new Promise((resolve, reject) => {
      const { username, email, password, role = "user" } = userData;

      // Generate random salt
      const salt = crypto.randomBytes(16).toString("hex");
      // Hash password with salt
      const hashedPassword = User.hashPassword(password, salt);

      db.run(
        "INSERT INTO users (username, email, password, salt, role) VALUES (?, ?, ?, ?, ?)",
        [username, email, hashedPassword, salt, role],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username, email, role });
          }
        }
      );
    });
  }

  static update(id, userData) {
    return new Promise((resolve, reject) => {
      const { username, email, role } = userData;

      db.run(
        "UPDATE users SET username = ?, email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [username, email, role, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ changes: this.changes });
        }
      });
    });
  }

  // Hash password với salt
  static hashPassword(password, salt) {
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
  }

  // Kiểm tra password
  static validatePassword(plainPassword, hashedPassword, salt) {
    const hashToVerify = User.hashPassword(plainPassword, salt);
    return hashToVerify === hashedPassword;
  }
}

module.exports = User;
