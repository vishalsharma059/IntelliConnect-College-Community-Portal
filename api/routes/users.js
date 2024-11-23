const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// routes/users.js
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json("User not found");
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  });
 

//update user

// router.put("/:id", async (req, res) => {
//     if (req.body.userId === req.params.id || req.body.isAdmin) {
//         if (req.body.password) {
//             try {
//                 const salt = await bcrypt.genSalt(10);
//                 req.body.password = await bcrypt.hash(req.body.password, salt);
//             } catch (err) {
//                 return res.status(403).json(err);
//             }
//         }
//         try {
//             const user = await User.findByIdAndUpdate(req.params.id, {
//                 $set: req.body
//             }, { new: true });
//             res.status(200).json("Account has been updated")
//         } catch (err) {
//             return res.status(403).json(err);
//         }
        
//     } else {
//         return res.status(403).json("You can update only your account!");
//     }
// });

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(403).json(err);
            }
        }

        // Prepare the data for update
        const updatedFields = {};

        // Only update fields that have been changed
        if (req.body.desc) updatedFields.desc = req.body.desc;
        if (req.body.college) updatedFields.college = req.body.college;
        if (req.body.role) updatedFields.role = req.body.role;
        if (req.body.course) updatedFields.course = req.body.course;
        if (req.body.city) updatedFields.city = req.body.city;
        if (req.body.profilePicture) updatedFields.profilePicture = req.body.profilePicture;
        if (req.body.coverPicture) updatedFields.coverPicture = req.body.coverPicture;

        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { $set: updatedFields },
                { new: true }
            );
            res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(403).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
});

//delete user

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {  
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted")
        } catch (err) {
            return req.status(403).json(err);
        }
        
    } else {
        return res.status(403).json("You can delete only your account!");
    }
});

//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      const { password, updatedAt, ...other } = user._doc;
      res.status(200).json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// get a friends
router.get("/friends/:userId", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.following.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList)
    } catch (err) {
      res.status(500).json(err);
    }
  });

//follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId
                    }
                });
                await currentUser.updateOne({
                    $push: {
                        following: req.params.id
                    }
                });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you allready follow this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you can't follow yourself");
    }
});

//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId
                    }
                });
                await currentUser.updateOne({
                    $pull: {
                        following: req.params.id
                    }
                });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you don't follow this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you can't unfollow yourself");
    }
});


module.exports = router