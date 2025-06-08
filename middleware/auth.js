const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash('error_msg', 'Vui lòng đăng nhập để truy cập trang này');
    res.redirect('/auth/login');
  }
};

const requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    req.flash('error_msg', 'Bạn không có quyền truy cập trang này');
    res.redirect('/dashboard');
  }
};

const redirectIfAuth = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    next();
  }
};

module.exports = {
  requireAuth,
  requireAdmin,
  redirectIfAuth
};