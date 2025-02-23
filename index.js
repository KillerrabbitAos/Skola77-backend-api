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
  const PORT = config.port || process.env.PORT || 5051;
  const logStream = config.logStream || process.stdout;

  // CORS Configuration
  const corsOptions = {
    origin: config.corsOrigin || process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Static files
  app.use(
    "/uploads",
    express.static(path.join(__dirname, process.env.UPLOAD_PATH || "uploads"))
  );
  app.use("/uploads/*", express.static("images/default_avatar.png"));
  app.use(express.static(path.join(__dirname, "public")));

  // Session Configuration
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

  // Middleware
  app.use(express.json());

  // Routes
  app.use(authRoutes);
  app.use("/admin", adminRoutes);
  app.use(authenticate);
  app.use("/user", userRoutes);

  // Default Route
  app.get("/", (req, res) => {
    res.status(200).json({ status: true, message: "API is running" });
  });

  // Error Handling Middleware
  app.use((err, res) => {
    console.error("Error:", err);
    res.status(500).json({ status: false, error: err.message || "Internal Server Error" });
  });

  // Start the server only if no external app is provided
  if (!config.noStart) {
    app.listen(PORT, () => {
      const message = `Server is running on port ${PORT}.`;
      console.log(message);
      logStream.write(`${message}\n`);
    });
  }

  return app;
}

module.exports = createServer;
