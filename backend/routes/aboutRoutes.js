const express = require('express');
const router = express.Router();
const About = require('../models/About.js');

//GET
router.get('/about', async(req, res) => {
    try {
        let about = await About.findOne();

        if(!about) {
            about = await About.create({bio : 'This is a simple website built to learn full-stack developement.'});
        }

        res.json({bio: about.bio});
    } catch(err) {
        res.status(500).json({error : err.message});
    }
});

//PUT
router.put('/about', async(req, res) => {
    try {
        const {bio} = req.body;

        if(!bio || bio.trim() === '') {
            return res.status(400).json({error : 'Bio is required.'});
        }

        let about = await About.findOne();

        if(!about) {
            about = await About.create({bio});
        } else {
            about.bio = bio;
            about.updatedAt = Date.now();
            await about.save();
        }

        res.json({bio : about.bio});
    } catch(err) {
        res.status(500).json({error : err.message});
    }
});

module.exports = router;