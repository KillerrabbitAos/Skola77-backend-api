const express = require("express");
const router = express.Router();
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { processAndSaveImage, upload } = require("../services/uploadService");
const checkAdmin = require("../middlewares/checkAdmin");

router.use(checkAdmin);

router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, email, isAdmin });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.post("/users/:id/ban", async (req, res) => {
  try {
    const { bannedAt, bannedDurationInSeconds, bannedForever } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({
      bannedAt: bannedForever ? new Date() : bannedAt,
      bannedDurationInSeconds: bannedForever ? null : bannedDurationInSeconds,
      bannedForever: bannedForever || false,
    });

    res.json({ message: "User banned successfully" });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ message: "Failed to ban user" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "email",
        "is_admin",
        "created_at",
        "last_login",
        "banned_at",
        "banned_duration_in_seconds",
        "banned_forever",
      ],
    });

    const usersWithLinkToAvatar = users
      .map((user) => user.get({ plain: true }))
      .map((user) => {
        user.avatar = `${req.protocol}://${req.get("host")}/uploads/${
          user.id
        }/pfp.png`;
        return user;
      });

    res.json(usersWithLinkToAvatar);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    res.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, isAdmin } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, email, isAdmin });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
