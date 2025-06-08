const User = require('../models/User');

class UserController {
  static async index(req, res) {
    try {
      const users = await User.getAll();
      res.render('users/index', {
        title: 'Quản lý người dùng',
        users,
        user: req.session.user
      });
    } catch (error) {
      console.error('Users index error:', error);
      req.flash('error_msg', 'Có lỗi xảy ra khi tải danh sách người dùng');
      res.render('users/index', {
        title: 'Quản lý người dùng',
        users: [],
        user: req.session.user
      });
    }
  }

  static showCreate(req, res) {
    res.render('users/create', {
      title: 'Thêm người dùng mới',
      user: req.session.user
    });
  }

  static async create(req, res) {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        req.flash('error_msg', 'Vui lòng nhập đầy đủ thông tin');
        return res.redirect('/users/create');
      }

      // Kiểm tra username đã tồn tại
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        req.flash('error_msg', 'Tên đăng nhập đã tồn tại');
        return res.redirect('/users/create');
      }

      // Kiểm tra email đã tồn tại
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        req.flash('error_msg', 'Email đã tồn tại');
        return res.redirect('/users/create');
      }

      await User.create({ username, email, password, role });
      req.flash('success_msg', 'Thêm người dùng thành công');
      res.redirect('/users');

    } catch (error) {
      console.error('Create user error:', error);
      req.flash('error_msg', 'Có lỗi xảy ra khi thêm người dùng');
      res.redirect('/users/create');
    }
  }

  static async showEdit(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        req.flash('error_msg', 'Không tìm thấy người dùng');
        return res.redirect('/users');
      }

      res.render('users/edit', {
        title: 'Chỉnh sửa người dùng',
        user,
      });
    } catch (error) {
      console.error('Show edit user error:', error);
      req.flash('error_msg', 'Có lỗi xảy ra');
      res.redirect('/users');
    }
  }

  static async update(req, res) {
    try {
      const { username, email, role } = req.body;
      const userId = req.params.id;

      if (!username || !email) {
        req.flash('error_msg', 'Vui lòng nhập đầy đủ thông tin');
        return res.redirect(`/users/${userId}/edit`);
      }

      await User.update(userId, { username, email, role });
      req.flash('success_msg', 'Cập nhật người dùng thành công');
      res.redirect('/users');

    } catch (error) {
      console.error('Update user error:', error);
      req.flash('error_msg', 'Có lỗi xảy ra khi cập nhật người dùng');
      res.redirect(`/users/${req.params.id}/edit`);
    }
  }

  static async delete(req, res) {
    try {
      const userId = req.params.id;
      
      // Không cho phép xóa chính mình
      if (parseInt(userId) === req.session.user.id) {
        req.flash('error_msg', 'Không thể xóa tài khoản của chính mình');
        return res.redirect('/users');
      }

      await User.delete(userId);
      req.flash('success_msg', 'Xóa người dùng thành công');
      res.redirect('/users');

    } catch (error) {
      console.error('Delete user error:', error);
      req.flash('error_msg', 'Có lỗi xảy ra khi xóa người dùng');
      res.redirect('/users');
    }
  }
}

module.exports = UserController;