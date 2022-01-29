const router = require ('express').Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {registerValidation, loginValidation}= require('../validation');

router.post('/register', async (req, res) => {
    //Lets Validate the data
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Check if the user already exists
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send({user: user._id})
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //Lets Validate the data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if the e-mail exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is wrong');

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!password) return res.status(400).send("Invalid password")

    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})

module.exports = router;