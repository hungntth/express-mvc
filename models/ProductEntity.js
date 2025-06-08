const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "integer",
      generated: "increment",
    },
    name: {
      type: "varchar",
    },
    description: {
      type: "text",
      nullable: true,
    },
    price: {
      type: "real",
    },
    category: {
      type: "varchar",
      nullable: true,
    },
    status: {
      type: "varchar",
      default: "active",
    },
    image: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "datetime",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "datetime",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
