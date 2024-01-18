const express = require('express');
const router = express.Router();
const Branch = require('../models/branchModel');

// Route to add a new branch
router.post('/add', async (req, res) => {
    try {
        const newBranch = new Branch(req.body);
        await newBranch.save();
        res.status(201).send({ message: 'Branch added successfully', data: newBranch });
    } catch (error) {
        res.status(500).send({ message: 'Error adding branch', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const branches = await Branch.find({});
        res.status(200).json(branches);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching branches', error: error.message });
    }
});

module.exports = router;
