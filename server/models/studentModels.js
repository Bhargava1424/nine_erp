const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    firstName: { type: String, required: true }, 
    surName: { type: String, required: true }, 
    fatherName: { type: String, required: true },
    primaryContact: { type: String, required: true },
    secondaryContact: { type: String, required: false },
    gender: { type: String, required: true },
    batch: { type: String, required: true },
    branch: { type: String, required: true },
    dateOfJoining: { type: Date, required: true },
    course: { type: String, required: true },
    modeOfResidence: { type: String, required: true },
    firstYearTuitionFee: { type: Number, required: true },
    firstYearHostelFee: { type: Number, required: true },
    secondYearTuitionFee: { type: Number, required: true },
    secondYearHostelFee: { type: Number, required: true },
    pendingFirstYearTuitionFee: { type: Number, required: true },
    pendingFirstYearHostelFee: { type: Number, required: true },
    pendingSecondYearTuitionFee: { type: Number, required: true },
    pendingSecondYearHostelFee: { type: Number, required: true },
    paidFirstYearTuitionFee: { type: Number, required: true },
    paidFirstYearHostelFee: { type: Number, required: true },
    paidSecondYearTuitionFee: { type: Number, required: true },
    paidSecondYearHostelFee: { type: Number, required: true },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
