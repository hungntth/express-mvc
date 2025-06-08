const { DataSource } = require("typeorm");
const UserEntity = require("./models/UserEntity");
const ProductEntity = require("./models/ProductEntity");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  synchronize: true, // dev mode thôi, prod thì false + migration
  logging: false,
  entities: [UserEntity, ProductEntity],
});

module.exports = { AppDataSource };
