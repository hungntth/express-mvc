const express = require("express");
const { engine } = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const path = require("path");
const { AppDataSource } = require("./data-source");

// Import TypeORM store for session management
const SQLiteStore = require("connect-sqlite3")(session);

// Import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/users");
const { initAdminUser } = require("./inits/InitAdmin");

// Import database

const app = express();
const PORT = process.env.PORT || 3000;

// Handlebars setup
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      eq: (a, b) => a === b,
      formatDate: (date) => {
        return new Date(date).toLocaleDateString("vi-VN");
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

// Session configuration
app.use(
  session({
    store: new SQLiteStore({
      db: "database.sqlite",
      dir: "./",
    }),
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Flash middleware
app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", userRoutes);

// Home route
app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/auth/login");
  }
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
    await initAdminUser();
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
    // app.listen... hoặc start server ở đây
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
