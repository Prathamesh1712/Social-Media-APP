const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


router.get("/", (req, res) => {
    res.send("Hello Auth API");
});

router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        });


        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);

    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        !user && res.status(404).json("User Not Found");
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Wrong Password");

        res.status(200).json(user);
    } catch (err) {
        console.log(err);

    }
})



module.exports = router;