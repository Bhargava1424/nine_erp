const router = require('express').Router();
const Student = require('../models/studentModels'); 

// POST route to add a new student
router.route('/add').post((req, res) => {
    const newStudent = new Student(req.body);

    newStudent.save()
        .then(() => res.json('Student added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// GET route to retrieve all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find(); // Fetch all documents from the 'students' collection
        res.json(students);
    } catch (error) {
        res.status(500).send("Error retrieving students data: " + error.message);
    }
});

router.get('/name/:firstName', async (req, res) => {
    try {
        const student = await Student.findOne({ firstName: req.params.firstName });
        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.json(student);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

router.post('/update-fees/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { paidFirstYearTuitionFee, pendingFirstYearTuitionFee } = req.body;

        // Find the student by ID and update their fees
        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).send('Student not found');
        }

        // Update the fees
        student.paidFirstYearTuitionFee += paidFirstYearTuitionFee;
        student.pendingFirstYearTuitionFee -= paidFirstYearTuitionFee;

        // Save the updated student document
        await student.save();

        res.status(200).json(student);
    } catch (error) {
        res.status(500).send('Error updating fees: ' + error.message);
    }
});

router.get('/latest', async (req, res) => {
    try {
      const branch = req.query.branch;
      const latestStudent = await StudentModel.findOne({ branch: branch }).sort({ createdAt: -1 }); // Adjust the query as per your schema
      res.json({ lastApplicationNumber: latestStudent ? latestStudent.applicationNumber : null });
    } catch (error) {
      res.status(500).send("Error fetching latest application number: " + error.message);
    }
  });
  

// Additional routes can be added here

module.exports = router;
