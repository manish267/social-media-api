const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.json({ status: "error", message: error.message });
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        status: "success",
        message: "your acccount details have been updated successfully",
      });
    } catch (error) {
      return res.json({ status: "error", message: error.message });
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId == req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndRemove(req.params.id);
      if (!user)
        return res
          .status(403)
          .json(
            "You can delete only your account or this account does not exist"
          );
      res.status(200).json({
        status: "success",
        message: "your acccount successfully got deleted",
      });
    } catch (error) {
      return res.json({ status: "error", message: error.message });
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});

// get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -updatedAt"
    );
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res
          .status(200)
          .json({ status: "success", message: "user has been followed" });
      } else {
        res
          .status(403)
          .json({ status: "error", message: "You already follow this user" });
      }
    } catch (error) {}
  } else {
    res
      .status(403)
      .json({ status: "error", message: "You cant follow yourself " });
  }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res
          .status(200)
          .json({ status: "success", message: "user has been Unfollowed" });
      } else {
        res
          .status(403)
          .json({ status: "error", message: "You already Unfollow this user" });
      }
    } catch (error) {}
  } else {
    res
      .status(403)
      .json({ status: "error", message: "You cant Unfollow yourself " });
  }
});

module.exports = router;
