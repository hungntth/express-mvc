const { AppDataSource } = require("../data-source");
const UserEntity = require("../models/UserEntity");
const crypto = require("crypto");

async function initAdminUser() {
  const userRepo = AppDataSource.getRepository(UserEntity);

  const existingAdmin = await userRepo.findOne({
    where: { username: "admin" },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  const adminPlainPassword = "aacckjb123";
  const adminSalt = crypto.randomBytes(16).toString("hex");
  const adminHashedPassword = crypto
    .pbkdf2Sync(adminPlainPassword, adminSalt, 10000, 64, "sha512")
    .toString("hex");

  const adminUser = userRepo.create({
    username: "admin",
    email: "admin@example.com",
    password: adminHashedPassword,
    salt: adminSalt,
    role: "admin",
  });

  await userRepo.save(adminUser);

  console.log("Admin user created successfully.");
}

module.exports = {
  initAdminUser,
};
