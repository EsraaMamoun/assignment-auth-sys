const router = require("express").Router();
const Joi = require("@hapi/joi");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../model/User");
const sendEmail = require('../functions/sendEmail');


router.post("/", async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Email doesn't exist");

        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

        const link = `http://localhost:3000/api/password/reset/${user._id}/${token}`;

        const resetMsg = `
          <h2>New Update</h2>
      
          <p>
          <h3>Your Password resert link is: <a href=${link}>reset</a>.</h3>
          </p>
        `;
      
        await sendEmail(user.email, "Password reset", resetMsg);

        res.status(201).send({message: "password reset link sent to your email account", link});
        
    } catch (error) {
        console.log(error);
        res.send('An error occured');
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        if (!token) return res.status(400).send("Invalid link or expired");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;

        await user.save();

        res.send('Your password has been successfully changed.');

    } catch (error) {
        console.log(error);
        res.send("An error occured");
    }
});

module.exports = router;