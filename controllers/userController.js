const userService = require("../services/user");
const authService = require("../services/authService");
const { processAndSaveImage } = require("../services/uploadService");

exports.createOrganization = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const { name, memberIds } = req.body;
    const userId = req.user.id;

    const organization = await userService.createOrganization(
      userId,
      name,
      memberIds
    );

    res.json({
      organization,
      message: "Organization created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.shareToOrganization = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const type = req.params.type;
    const { id, organizationId } = req.body;

    if (!id || !organizationId) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const { entity, members } = await userService.shareEntityToOrganization(
      req.user.id,
      type,
      id,
      organizationId
    );

    res.json({
      message: `${type} shared successfully with organization`,
      [type]: entity,
      sharedWith: members.map((user) => user.name),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.share = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const type = req.params.type;
    let { id, userIds, permissions } = req.body;

    if (!id || !userIds || !permissions) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    const { entity, sharedWith } = await userService.shareEntityWithUsers(
      req.user.id,
      type,
      id,
      userIds,
      permissions
    );

    res.json({
      message: `${type} shared successfully`,
      [type]: entity,
      sharedWith: sharedWith.map((user) => user.name),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.update = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const userId = req.user.id;
    const jsData = JSON.parse(req.body.jsData);

    const updatedData = await userService.updateUserEntities(userId, jsData);

    res.json({ data: updatedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.create = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const type = req.params.type;
    const { name, jsData } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Invalid parameters" });
    }
    const userId = req.user.id;

    const { entity } = await userService.createEntity(
      userId,
      type,
      name,
      jsData
    );

    res.json({ js: JSON.parse(jsData) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.userAccess = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userData, user } = await userService.getUserAccess(userId);
    res.json({ userData, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.deleteEntity = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const type = req.params.type;
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Invalid parameters" });
    }
    const userId = req.user.id;

    const entityName = await userService.deleteEntity(userId, type, id);

    res.json({ message: `${entityName} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await userService.getUserProfile(userId);
    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.user || !req.user.id) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const result = await processAndSaveImage(req.user.id, req.file);

    res.status(200).json({
      message: "Image uploaded and converted successfully",
      imageUrl: result.imageUrl,
    });
  } catch (error) {
    console.error("Error processing image:", error.message);
    res.status(500).json({
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

exports.searchUsers = async (req, res) => {
  const { query } = req.query;
  const userId = req.user.id;

  try {
    const result = await userService.search.users(query, userId);
    res.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};
