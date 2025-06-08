const UserService = require("../services/UserService");

class UserController {
  static async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const { users, totalCount } = await UserService.getPaged(limit, offset);
      const totalPages = Math.ceil(totalCount / limit);

      res.render("users/index", {
        title: "Quản lý người dùng",
        users,
        pagination: {
          currentPage: page,
          totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
          prevPage: page - 1,
          nextPage: page + 1,
        },
        user: req.session.user,
      });
    } catch (error) {
      console.error("Users index error:", error);
      req.flash("error_msg", "Có lỗi xảy ra khi tải danh sách người dùng");
      res.render("users/index", {
        title: "Quản lý người dùng",
        users: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasPrev: false,
          hasNext: false,
        },
        user: req.session.user,
      });
    }
  }

  static showCreate(req, res) {
    res.render("users/create", {
      title: "Thêm người dùng mới",
      user: req.session.user,
    });
  }

  static async create(req, res) {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        req.flash("error_msg", "Vui lòng nhập đầy đủ thông tin");
        return res.redirect("/users/create");
      }

      const existingUser = await UserService.findByUsername(username);
      if (existingUser) {
        req.flash("error_msg", "Tên đăng nhập đã tồn tại");
        return res.redirect("/users/create");
      }

      const existingEmail = await UserService.findByEmail(email);
      if (existingEmail) {
        req.flash("error_msg", "Email đã tồn tại");
        return res.redirect("/users/create");
      }

      await UserService.create({ username, email, password, role });
      req.flash("success_msg", "Thêm người dùng thành công");
      res.redirect("/users");
    } catch (error) {
      console.error("Create user error:", error);
      req.flash("error_msg", "Có lỗi xảy ra khi thêm người dùng");
      res.redirect("/users/create");
    }
  }

  static async showEdit(req, res) {
    try {
      const user = await UserService.findById(req.params.id);
      if (!user) {
        req.flash("error_msg", "Không tìm thấy người dùng");
        return res.redirect("/users");
      }

      res.render("users/edit", {
        title: "Chỉnh sửa người dùng",
        user,
      });
    } catch (error) {
      console.error("Show edit user error:", error);
      req.flash("error_msg", "Có lỗi xảy ra");
      res.redirect("/users");
    }
  }

  static async update(req, res) {
    try {
      const { username, email, role } = req.body;
      const userId = req.params.id;

      if (!username || !email) {
        req.flash("error_msg", "Vui lòng nhập đầy đủ thông tin");
        return res.redirect(`/users/${userId}/edit`);
      }

      await UserService.update(userId, { username, email, role });
      req.flash("success_msg", "Cập nhật người dùng thành công");
      res.redirect("/users");
    } catch (error) {
      console.error("Update user error:", error);
      req.flash("error_msg", "Có lỗi xảy ra khi cập nhật người dùng");
      res.redirect(`/users/${req.params.id}/edit`);
    }
  }

  static async delete(req, res) {
    try {
      const userId = req.params.id;

      if (parseInt(userId) === req.session.user.id) {
        req.flash("error_msg", "Không thể xóa tài khoản của chính mình");
        return res.redirect("/users");
      }

      await UserService.delete(userId);
      req.flash("success_msg", "Xóa người dùng thành công");
      res.redirect("/users");
    } catch (error) {
      console.error("Delete user error:", error);
      req.flash("error_msg", "Có lỗi xảy ra khi xóa người dùng");
      res.redirect("/users");
    }
  }
}

module.exports = UserController;
