const UserService = require("../services/UserService");

class DashboardController {
  static async index(req, res) {
    try {
      const users = await UserService.getAll();
      const stats = {
        totalUsers: users.length,
        adminUsers: users.filter(user => user.role === 'admin').length,
        regularUsers: users.filter(user => user.role === 'user').length
      };

      res.render('dashboard/index', {
        title: 'Dashboard',
        stats,
        recentUsers: users.slice(0, 5),
        user: req.session.user
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      req.flash('error_msg', 'Có lỗi xảy ra khi tải dashboard');
      res.render('dashboard/index', {
        title: 'Dashboard',
        stats: { totalUsers: 0, adminUsers: 0, regularUsers: 0 },
        recentUsers: [],
        user: req.session.user
      });
    }
  }
}

module.exports = DashboardController;