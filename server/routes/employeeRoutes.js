const express = require('express');
const router = express.Router();
const Employee = require('../models/employeeModel'); // Adjust the path as needed

router.post('/add', async (req, res) => {
    console.log('Received request to add employee:', req.body); // Log the incoming request
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json({ message: 'Employee added successfully', data: newEmployee });
  } catch (error) {
    res.status(500).json({ message: 'Error adding employee', error: error });
  }
});

module.exports = router;
