const crypto = require("crypto");
const { AppDataSource } = require("../data-source");
const UserEntity = require("../models/UserEntity");

class UserService {
  static userRepo = AppDataSource.getRepository(UserEntity);

  static async getAll() {
    return await this.userRepo.find({
      select: ["id", "username", "email", "role", "created_at", "updated_at"],
    });
  }

  static async findByUsername(username) {
    return await this.userRepo.findOneBy({ username });
  }

  static async findByEmail(email) {
    return await this.userRepo.findOneBy({ email });
  }

  static async findById(id) {
    return await this.userRepo.findOneBy({ id });
  }

  static async getPaged(limit, offset) {
    const [users, totalCount] = await this.userRepo.findAndCount({
      select: ["id", "username", "email", "role", "created_at"],
      order: { created_at: "DESC" },
      skip: offset,
      take: limit,
    });

    return { users, totalCount };
  }

  static async create(userData) {
    const { username, email, password, role = "user" } = userData;

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = this.hashPassword(password, salt);

    const user = this.userRepo.create({
      username,
      email,
      password: hashedPassword,
      salt,
      role,
    });

    return await this.userRepo.save(user);
  }

  static async update(id, userData) {
    const user = await this.findById(id);
    if (!user) throw new Error("User not found");

    user.username = userData.username;
    user.email = userData.email;
    user.role = userData.role;
    user.updated_at = new Date();

    return await this.userRepo.save(user);
  }

  static async delete(id) {
    return await this.userRepo.delete(id);
  }

  static hashPassword(password, salt) {
    return crypto
      .pbkdf2Sync(password, salt, 10000, 64, "sha512")
      .toString("hex");
  }

  static validatePassword(plainPassword, hashedPassword, salt) {
    const hashToVerify = this.hashPassword(plainPassword, salt);
    return hashToVerify === hashedPassword;
  }
}

module.exports = UserService;
