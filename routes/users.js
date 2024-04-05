const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const axios=require("axios");
router.get("/", (req, res) => {
    res.send("Hello User API");
})

// Update user profile
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You can update only your profile");
    }
})
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been Deleted");
        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You can Delete only your profile");
    }
})

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {
            password,
            updatedAt,
            ...other
        } = user._doc
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
})

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
                res.status(200).json("User has been followed");
            } else {
                res.status(403).json("You already follow this person");
            }
        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You can not follow yourself");
    }
})

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
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You don't follow this person so you cannot unnfollow them");
            }
        } catch (err) {
            res.status(500).json(err);
        }

    } else {
        return res.status(403).json("You can not follow yourself");
    }
})

const loadUser=async()=>{
    e.preventDefault();
    await axios.put(`http://localhost:8000/emp/${id}`, user);
    navigate("/");

    const result=await axios.get(  `http://localhost:8000/emp/${id}`, user);
    navigate("/");

}
<div>
<div className="mb-3">



</div>

</div>


module.exports = router;