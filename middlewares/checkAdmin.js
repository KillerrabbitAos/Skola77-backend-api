const checkAdmin = async (req, res, next) => {
  const user = req.user;
  try {
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error("Error checking admin:", error);
    res.status(401).json({ message: "Not admin" });
  }
  next();
};

module.exports = checkAdmin;
