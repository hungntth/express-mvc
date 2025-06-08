const UserService = require("../services/UserService");

class AuthController {
  static showLogin(req, res) {
    res.render("auth/login", {
      title: "Đăng nhập",
      layout: "auth",
    });
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        req.flash("error_msg", "Vui lòng nhập đầy đủ thông tin");
        return res.redirect("/auth/login");
      }

      const user = await UserService.findByUsername(username);
      if (!user) {
        req.flash("error_msg", "Tên đăng nhập không tồn tại");
        return res.redirect("/auth/login");
      }

      if (!UserService.validatePassword(password, user.password, user.salt)) {
        req.flash("error_msg", "Mật khẩu không chính xác");
        return res.redirect("/auth/login");
      }

      // Lưu thông tin user vào session
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      // Explicitly save session before using req.flash()
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      req.flash("success_msg", "Đăng nhập thành công");
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      req.flash("error_msg", "Có lỗi xảy ra, vui lòng thử lại");
      res.redirect("/auth/login");
    }
  }

  static logout(req, res) {
    req.flash("success_msg", "Đăng xuất thành công");

    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        req.flash("error_msg", "Có lỗi xảy ra khi đăng xuất");
        return res.redirect("/dashboard");
      }

      res.clearCookie("connect.sid");
      res.redirect("/auth/login");
    });
  }
}

module.exports = AuthController;
