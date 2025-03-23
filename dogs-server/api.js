const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User.js");
const Favorite = require("./models/Favorite.js");

const mongoUri = process.env.MONGODB_URI
mongoose.connect(mongoUri);
const router = new express.Router();

router.post("/user", async (req, res) => {
    try {
        if (!req.body.name) {
            return res
                .status(401)
                .json({ success: false, error: "Name is missing" });
        }
        const user = new User({ name: req.body.name });
        await user.save();
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.get("/user", async (req, res) => {
    try {
        const all = await User.find();
        res.status(200).json({ success: true, data: all });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.get("/user/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.patch("/user/:id/name", async (req, res) => {
    try {
        if (!req.body.name) {
            return res
                .status(401)
                .json({ success: false, error: "Name is missing" });
        }
        const user = await User.findOne({ _id: req.params.id });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }
        user.name = req.body.name;
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.patch("/user/:id/profile", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }
        if (req.body.profilePic) {
            const favorite = await Favorite.findOne({
                _id: req.body.profilePic,
                user: req.params.id,
            });
            if (!favorite) {
                return res
                    .status(404)
                    .json({ success: false, error: "Favorite not found" });
            }
            user.profilePic = req.body.profilePic;
        } else {
            delete user.profilePic;
        }
        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.delete("/user/:id", async (req, res) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        if (!result.deletedCount) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }
        res.status(204).json({ success: true });
        Favorite.deleteMany({ user: req.params.id });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.get("/user/:id/favorite", async (req, res) => {
    const query = { user: req.params.id };
    const options = {};
    if (req.query.name) {
        query.name = { $regex: req.query.name };
    }
    if (req.query.limit) {
        options.limit = +req.query.limit;
    }
    if (req.query.skip) {
        options.skip = +req.query.skip;
    }
    try {
        const data = await Favorite.find(query, {}, options);
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.post("/user/:id/favorite", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }
        if (!req.body.imgSrc) {
            return res
                .status(401)
                .json({ success: false, error: "Missing imgSrc" });
        }
        const oldFavorite = await Favorite.findOne({
            imgSrc: req.body.imgSrc,
            user: req.params.id,
        });
        if (oldFavorite) {
            return res
                .status(400)
                .json({ success: false, data: "The user already liked it" });
        }
        const newFavorite = new Favorite({
            imgSrc: req.body.imgSrc,
            user: req.params.id,
        });
        await newFavorite.save();
        res.status(201).json({ success: true, data: newFavorite });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.patch("/user/:id/favorite/:favId/name", async (req, res) => {
    try {
        const favorite = await Favorite.findOne({
            _id: req.params.favId,
            user: req.params.id,
        });
        if (!favorite) {
            return res
                .status(404)
                .json({ success: false, error: "Favorite not found" });
        }
        favorite.name = req.body.name;
        await favorite.save();
        res.status(200).json({ success: true, data: favorite });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

router.delete("/user/:id/favorite/:favId", async (req, res) => {
    try {
        const result = await Favorite.deleteOne({
            _id: req.params.favId,
            user: req.params.id,
        });
        if (!result.deletedCount) {
            await res
                .status(404)
                .json({ success: false, error: "Favorite not found" });
        }
        const user = await User.findById(req.params.id);
        if (user.profilePic == req.params.favId) {
            delete user.profilePic;
            await user.save();
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).json({ success: false, error });
    }
});

module.exports = router;

// ?
// router.post("/user", (req, res) => {
//   const newUser = new User(req.body);
//   newUser
//     .save()
//     .then(
//       res.status(201).json({
//         status: "success",
//         data: newUser,
//       })
//     )
//     .catch((err) => {
//       res.status(400).json({
//         status: "fail",
//         message: err,
//       });
//     });
// });

// router.get("/users", (req, res) => {
//   User.find({})
//     .then((data) => {
//       res.status(200).json({
//         status: "success",
//         data,
//       });
//     })
//     .catch((err) => {
//       res.status(404).json({
//         status: "fail",
//         message: err,
//       });
//     });
// });

// router.get("/user/:id", (req, res) => {
//   User.findOne({ _id: req.params.id })
//     .then((data) => {
//       res.status(200).json({
//         status: "success",
//         data,
//       });
//     })
//     .catch((err) => {
//       res.status(404).json({
//         status: "fail",
//         message: err,
//       });
//     });
// });

// router.patch("/user/:id/name", (req, res) => {
//   User.updateOne({ _id: req.params.id }, { $set: { name: req.body.name } })
//     .then((data) => {
//       res.status(201).json({
//         status: "success",
//         data,
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         status: "fail",
//         message: err,
//       });
//     });
// });

// router.patch("/user/:id/profile", (req, res) => {
//   User.updateOne(
//     { _id: req.params.id },
//     { $set: { profilePic: req.body.profilePic } }
//   )
//     .then((data) => {
//       res.status(201).json({
//         status: "success",
//         data,
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         status: "fail",
//         message: err,
//       });
//     });
// });

// router.delete("/user/:id", (req, res) => {
//   User.deleteOne({ _id: req.params.id })
//     .then(
//       res.status(404).json({
//         status: "success",
//         data: null,
//       })
//     )
//     .catch((err) => {
//       res.status(404).json({
//         status: "fail",
//         message: "error:😱" + err,
//       });
//     });
// });

// router.post("/user/:id/favorite", (req, res) => {
//   const newFavorite = new Favorite({ ...req.body, user: req.params.id });
//   newFavorite
//     .save()
//     .then(
//       res.status(201).json({
//         status: "success",
//         data: newFavorite,
//       })
//     )
//     .catch((err) => {
//       res.status(400).json({
//         status: "fail",
//         message: err,
//       });
//     });
// });

// router.delete("/user/:id/favorite/:favId", () => {
//   Favorite.deleteOne({ _id: req.params.favId })
//     .then(
//       res.status(404).json({
//         status: "success",
//         data: null,
//       })
//     )
//     .catch((err) => {
//       res.status(404).json({
//         status: "fail",
//         message: "error:😱" + err,
//       });
//     });
// });

// router.get("/user/:id/favorite", () => {
//   Favorite.find({ user: req.params.id })
//     .then((data) => {
//       res.status(200).json({
//         status: "success",
//         data,
//       });
//     })
//     .catch((err) => {
//       res.status(404).json({
//         status: "fail",
//         message: err,
//       });
//     });
// });

// router.patch("/user/:id/favorite/:favId/name", () => {
//   Favorite.updateOne(
//     { _id: req.params.favId },
//     { $set: { name: req.body.name } }
//   )
//     .then((data) => {
//       res.status(201).json({
//         status: "success",
//         data,
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({
//         status: "fail",
//         message: err,
//       });
//     });
// });

// module.exports = router;
