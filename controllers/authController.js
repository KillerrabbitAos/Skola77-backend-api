const authService = require("../services/authService");

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Logged out successfully" });
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", email, password);
  try {
    await authService.login({
      email,
      password,
      session: req.session,
    });
    res.json({ message: "Login successful", token: "Stored in session" });
  } catch (error) {
    res.status(401).json({ message: error.message || "Internal server error" });
  }
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Register request:", name, email, password);
    try {
      const token = await authService.register({
        name,
        email,
        password,
        file: req.file,
        session: req.session,
      });
      res
        .status(201)
        .json({ message: "Registration successful", token: "Stored in session" });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };