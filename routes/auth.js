const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validation = require('../validation');

router.post('/signup', async (req, res) => {
    const { error } = validation.signupValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists!');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send({token, user_data: user});
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/signin', async (req, res) => {
    const { error } = validation.signinValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email or password is wrong!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Email or password is wrong!');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({token, user_data: user});
});

module.exports = router;