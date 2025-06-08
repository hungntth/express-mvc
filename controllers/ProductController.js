const ProductService = require("../services/ProductService");
const exportProductsExcel = require("../utils/exportExcel");

class ProductController {
  static async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const filter = {
        search: req.query.search || "",
        category: req.query.category || "",
        status: req.query.status || "",
      };

      const { products, totalCount } = await ProductService.getPaged(filter, page, limit);
      const totalPages = Math.ceil(totalCount / limit);

      if (req.query.export === "excel") {
        return exportProductsExcel(products, res);
      }

      res.render("products/index", {
        title: "Quản lý sản phẩm",
        products,
        filter,
        pagination: {
          currentPage: page,
          totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
          prevPage: page - 1,
          nextPage: page + 1,
        },
      });
    } catch (error) {
      console.error("Product index error:", error);
      req.flash("error_msg", "Có lỗi xảy ra khi tải danh sách sản phẩm");
      res.render("products/index", { products: [] });
    }
  }

  static showCreate(req, res) {
    res.render("products/create", {
      title: "Thêm sản phẩm mới",
    });
  }

  static async create(req, res) {
    try {
      const { name, description, price, category, status } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      await ProductService.create({ name, description, price, category, status, image });

      req.flash("success_msg", "Thêm sản phẩm thành công");
      res.redirect("/products");
    } catch (error) {
      console.error("Create product error:", error);
      req.flash("error_msg", "Có lỗi xảy ra khi thêm sản phẩm");
      res.redirect("/products/create");
    }
  }

  static async showEdit(req, res) {
    try {
      const product = await ProductService.findById(req.params.id);
      if (!product) {
        req.flash("error_msg", "Không tìm thấy sản phẩm");
        return res.redirect("/products");
      }

      res.render("products/edit", {
        title: "Chỉnh sửa sản phẩm",
        product,
      });
    } catch (error) {
      console.error("Show edit product error:", error);
      req.flash("error_msg", "Có lỗi xảy ra");
      res.redirect("/products");
    }
  }

  static async update(req, res) {
    try {
      const { name, description, price, category, status } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : undefined;

      const data = { name, description, price, category, status };
      if (image !== undefined) data.image = image;

      await ProductService.update(req.params.id, data);

      req.flash("success_msg", "Cập nhật sản phẩm thành công");
      res.redirect("/products");
    } catch (error) {
      console.error("Update product error:", error);
      req.flash("error_msg", "Có lỗi xảy ra khi cập nhật sản phẩm");
      res.redirect(`/products/${req.params.id}/edit`);
    }
  }

  static async delete(req, res) {
    try {
      await ProductService.delete(req.params.id);
      req.flash("success_msg", "Xóa sản phẩm thành công");
      res.redirect("/products");
    } catch (error) {
      console.error("Delete product error:", error);
      req.flash("error_msg", "Có lỗi xảy ra khi xóa sản phẩm");
      res.redirect("/products");
    }
  }
}

module.exports = ProductController;
