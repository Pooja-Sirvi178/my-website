const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

//POST /api/auth/register
router.post('/auth/register', async(req, res) => {
    try {
        const {username, password} = req.body;

        if(!username || !password) {
            return res.status(400).json({error: 'Username and password are required.'});
        }

        const existing = await User.findOne({username});
        if(existing) {
            return res.status(409).json({error: 'Username already taken.'});
        }

        //Hash the password before saving - never store plain text
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({username, password: hashedPassword});

        res.status(201).json({message :'User registered successfully.', username: user.username});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

//POST /api/auth/login
router.post('/auth/login', async (req, res) => {
    try {
        const {username , password} = req.body;

        if(!username || !password) {
            return res.status(400).json({error: 'Username and password are required.'});
        }

        const user = await User.findOne({username});
        if(!user) {
            return res.status(401).json({error: 'Invalid username or password.'});
        }

        //create a token containing the user's id, signed with our secret
        const token = jwt.sign({ id: user._id, username: user.username},
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        );

        res.json({token, username: user.username});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;