const express = require('express');
const router = express.Router();
const Message = require('../models/Message.js');
const protect = require('../middleware/authMiddleware.js');

//GET 
router.get('/home', async (req, res) => {
    try {
        let latest = await Message.findOne().sort({createdAt : -1});

        if(!latest) {
            latest = await Message.create({text : "Hello from mongoDB."});
        }

        res.json({message : latest.text});
    } catch(error) {
        res.status(500).json({message : error.message});
    }
});

//GET all
router.get('/home/all', async (req, res) => {
    try {
        const messages = await Message.find().sort({createdAt : -1});
        res.json({messages});
    } catch(error) {
        res.status(500).json({error : error.message})
    }
});

//POST
router.post('/home', protect, async (req, res) => {
    try {
        const {text} = req.body;

        if(!text || text.trim() === '') {
            return res.status(400).json({error : 'Message text is required.'});
        }

        const newMessage = await Message.create({text});
        res.status(201).json({message : newMessage.text});
    } catch(error) {
        res.status(500).json({ error : error.message});
    }
});

//DELETE 
router.delete('/home/:id', protect,async(req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Message.findByIdAndDelete(id);

        if(!deleted) {
            return res.status(404).json({error: 'Message not found.'});
        }

        res.json({message : 'Deleted successfully.', id});
    } catch(error) {
        res.status(500).json({error: error.message})
    }
});

//PUT
router.put('/home/:id', protect,async(req, res) => {
    try {
        const {id} = req.params;
        const {text} = req.body;

        if(!text || text.trim() === '') {
            return res.status(400).json({error: 'Message text is required.'});
        }

        const updated = await Message.findByIdAndUpdate(
            id,
            {text},
            {new : true}
        );

        if(!updated) {
            return res.status(404).json({error: 'Message not found.'});
        }

        res.json({message: updated.text, id: updated._id});
    } catch(error) {
        res.status(500).json({error : error.message});
    }
});

module.exports = router;