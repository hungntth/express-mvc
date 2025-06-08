const { AppDataSource } = require("../data-source"); // DataSource của bạn
const Product = require("../models/ProductEntity");

class ProductService {
  static getRepository() {
    return AppDataSource.getRepository(Product);
  }

  static async getPaged(filter = {}, page = 1, limit = 10) {
    const qb = this.getRepository().createQueryBuilder("product");

    // Filter
    if (filter.search) {
      qb.andWhere("product.name LIKE :search", { search: `%${filter.search}%` });
    }
    if (filter.category) {
      qb.andWhere("product.category = :category", { category: filter.category });
    }
    if (filter.status) {
      qb.andWhere("product.status = :status", { status: filter.status });
    }

    qb.orderBy("product.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [products, totalCount] = await qb.getManyAndCount();

    return { products, totalCount };
  }

  static async create(data) {
    const product = this.getRepository().create(data);
    return await this.getRepository().save(product);
  }

  static async findById(id) {
    return await this.getRepository().findOneBy({ id });
  }

  static async update(id, data) {
    await this.getRepository().update(id, data);
  }

  static async delete(id) {
    await this.getRepository().delete(id);
  }
}

module.exports = ProductService;
