require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authenticate = require("./middlewares/authenticate");

function createServer(config = {}) {
  const app = express();

  const corsOptions = {
    origin:
      config.corsOrigin || process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(
    "/uploads",
    express.static(path.join(__dirname, process.env.UPLOAD_PATH || "uploads"))
  );
  app.use("/uploads/*", express.static("images/default_avatar.png"));
  app.use(express.static(path.join(__dirname, "public")));

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
      },
    })
  );

  app.use(express.json());

  app.use(authRoutes);
  app.use("/admin", adminRoutes);
  app.use(authenticate);
  app.use("/user", userRoutes);

  app.get("/", (req, res) => {
    res.status(200).json({ status: true, message: "API is running" });
  });

  app.use((err, res) => {
    console.error("Error:", err);
    res
      .status(500)
      .json({ status: false, error: err.message || "Internal Server Error" });
  });

  return app;
}

module.exports = createServer;
