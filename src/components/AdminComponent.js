import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccountantComponent() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // New state for managing edit functionality
  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Function to fetch students data from the backend
    const fetchStudents = async () => {
      try {
        // Replace with the correct URL of your backend API
        const response = await axios.get('http://localhost:5000/api/students');
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchStudents();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSearch = (searchQuery) => {
    if (!searchQuery) {
      return students; // Return all students if the search query is empty
    }
  
    const searchTerms = searchQuery.split(',').map(term => term.trim().toLowerCase());
  
    return students.filter(student => {
        return searchTerms.every(term =>
            student.firstName.toLowerCase().includes(term) ||
            student.surName.toLowerCase().includes(term) ||
            student.fatherName.toLowerCase().includes(term) ||
            student.branch.toLowerCase().includes(term) ||
            student.primaryContact.includes(term) ||
            student.gender.toLowerCase().includes(term) ||
            student.batch.includes(term) ||
            student.course.toLowerCase().includes(term) ||
            student.modeOfResidence.toLowerCase().includes(term) ||
            student.firstYearTuitionFee.toString().includes(term) ||
            student.firstYearHostelFee.toString().includes(term) ||
            student.secondYearTuitionFee.toString().includes(term) ||
            student.secondYearHostelFee.toString().includes(term) ||
            student.pendingFirstYearTuitionFee.toString().includes(term) ||
            student.pendingFirstYearHostelFee.toString().includes(term) ||
            student.pendingSecondYearTuitionFee.toString().includes(term) ||
            student.pendingSecondYearHostelFee.toString().includes(term) ||
            student.paidFirstYearTuitionFee.toString().includes(term) ||
            student.paidFirstYearHostelFee.toString().includes(term) ||
            student.paidSecondYearTuitionFee.toString().includes(term) ||
            student.paidSecondYearHostelFee.toString().includes(term)
            // Add any additional fields that you might have in your data structure
          );
    });
  };

  const filteredStudents = handleSearch(searchQuery);
  // New function to open the edit modal
  const openEditModal = (student) => {
    setEditingStudent({ ...student });
    setIsEditModalOpen(true);
  };
  // New function to handle field change in the edit modal
  const [validationErrors, setValidationErrors] = useState({ primaryContact: '', secondaryContact: '' });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let newValidationErrors = { ...validationErrors };
  
    // Validation for names
    if (name === 'firstName' || name === 'surName' || name === 'fatherName') {
      updatedValue = value.toUpperCase().replace(/[^A-Z\s]/g, '');
    }
  
    // Validation for contacts
    if (name === 'primaryContact' || name === 'secondaryContact') {
      updatedValue = value.replace(/[^0-9]/g, '');
  
      // Check for 10 digit length
      if (updatedValue.length !== 10) {
        newValidationErrors[name] = 'Contact number must be 10 digits.';
      } else {
        newValidationErrors[name] = '';
      }
    }
  
    // Check if primary and secondary contacts are not the same
    const newPrimaryContact = name === 'primaryContact' ? updatedValue : editingStudent.primaryContact;
    const newSecondaryContact = name === 'secondaryContact' ? updatedValue : editingStudent.secondaryContact;
  
    if (newPrimaryContact === newSecondaryContact && newPrimaryContact.length === 10 && newSecondaryContact.length === 10) {
      newValidationErrors.primaryContact = 'Primary and Secondary contacts must be different.';
      newValidationErrors.secondaryContact = 'Primary and Secondary contacts must be different.';
    } else {
      if (newPrimaryContact.length === 10) newValidationErrors.primaryContact = '';
      if (newSecondaryContact.length === 10) newValidationErrors.secondaryContact = '';
    }
  
    setValidationErrors(newValidationErrors);
    setEditingStudent({ ...editingStudent, [name]: updatedValue });
  };
  
  
   
  // New function to submit edited data without actual backend update
  const handleEditSubmit = () => {
    // Check for validation errors
    const hasValidationErrors = Object.values(validationErrors).some(error => error !== '');
  
    if (hasValidationErrors) {
      alert("Please correct the errors before submitting.");
      return;
    }
  
    try {
      // Update the students array with the edited student locally
      const updatedStudents = students.map(student => {
        return student ;
      });
  
      setStudents(updatedStudents);
      console.log("Updated Students:", updatedStudents); // Debugging
  
      // Close the modal and reset editingStudent
      setIsEditModalOpen(false);
      
      // Display success message with changes
      alert(`Student updated successfully: ${JSON.stringify(editingStudent)}`);
  
      setEditingStudent(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating student: ", error);
    }
  };
  
  
  

  const generateBatchOptions = () => {
    const startYear = 2022;
    const endYear = 2048;
    const options = [];

    for (let year = startYear; year <= endYear; year++) {
      options.push(`${year}-${year + 2}`);
    }

    return options;
  };   

  return (
    <div className="main-container">
      <input
        type="text"
        placeholder="Search students..."
        className="input input-bordered w-full max-w-xs text-black placeholder-black"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      

<div className="overflow-x-auto mt-3">
  <h2 className="text-2xl font-bold text-black-500 mb-4">Student Data</h2>
  
  <table className="min-w-full border border-gray-800 border-collapse">
    <thead>
      <tr>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Edit</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Student Name</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Parent Name</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Branch</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Primary Contact</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Gender</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Batch</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Date of Joining</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Course</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Mode of Residence</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Tuition Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Hostel Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Tuition Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Hostel Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Paid 1st Year Tuition Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Paid 1st Year Hostel Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Paid 2nd Year Tuition Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Paid 2nd Year Hostel Fee</th>        
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Pending 1st Year Tuition Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Pending 1st Year Hostel Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Pending 2nd Year Tuition Fee</th>
        <th className="px-4 py-2 text-black border-r-2 border-gray-800">Pending 2nd Year Hostel Fee</th>
      </tr>
    </thead>
    <tbody>
      {filteredStudents.map((student, index) => (
        <tr className="hover:bg-[#00A0E3]" key={index}>
         <td className="border-2 border-gray-800 px-4 py-2 text-black">
         <button onClick={() => openEditModal(student)} style={{ color: "#2D5990" }}>
  <i className="fas fa-edit"></i>
</button>

</td>

                    <td className="border-2 border-gray-800 px-4 py-2 text-black">
                      {`${student.firstName} ${student.surName}`.trim()}
                    </td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.fatherName}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.branch}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.primaryContact}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.gender}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.batch}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.dateOfJoining ? new Date(student.dateOfJoining).toLocaleDateString() : ''}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.course}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.modeOfResidence}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.firstYearTuitionFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.firstYearHostelFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.secondYearTuitionFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.secondYearHostelFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.paidFirstYearTuitionFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.paidFirstYearHostelFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.paidSecondYearTuitionFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.paidSecondYearHostelFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingFirstYearTuitionFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingFirstYearHostelFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingSecondYearTuitionFee}</td>
          <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingSecondYearHostelFee}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{isEditModalOpen && (
  <div className="edit-modal">
    <h3 className="text-lg font-semibold mb-4">Editing Student Details</h3>

    <label className="form-control">
      <span className="label-text">First Name</span>
      <input type="text" name="firstName" value={editingStudent.firstName} onChange={handleEditChange} />
    </label>
    <label className="form-control">
      <span className="label-text">Surname</span>
      <input type="text" name="surName" value={editingStudent.surName} onChange={handleEditChange} />
    </label>
    <label className="form-control">
      <span className="label-text">Parent Name</span>
      <input type="text" name="fatherName" value={editingStudent.fatherName} onChange={handleEditChange} />
    </label>
    <label className="form-control">
      <span className="label-text">Primary Contact</span>
      <input type="text" name="primaryContact" value={editingStudent.primaryContact} onChange={handleEditChange} />
      {validationErrors.primaryContact && <span className="text-red-500">{validationErrors.primaryContact}</span>}
    </label>
    <label className="form-control">
      <span className="label-text">Secondary Contact</span>
      <input type="text" name="secondaryContact" value={editingStudent.secondaryContact} onChange={handleEditChange} />
      {validationErrors.secondaryContact && <span className="text-red-500">{validationErrors.secondaryContact}</span>}
    </label>


    <label className="form-control">
      <span className="label-text">Gender</span>
      <select name="gender" value={editingStudent.gender} onChange={handleEditChange}>
        <option value="" disabled>Choose Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </label>

    <label className="form-control">
      <span className="label-text">Batch</span>
      <select name="batch" value={editingStudent.batch} onChange={handleEditChange}>
        {generateBatchOptions().map(batch => (
          <option key={batch} value={batch}>{batch}</option>
        ))}
      </select>
    </label>

    <label className="form-control">
      <span className="label-text">Course</span>
      <select name="course" value={editingStudent.course} onChange={handleEditChange}>
        <option value="" disabled>Select Course</option>
        <option value="MPC">MPC</option>
        <option value="BiPC">BiPC</option>
      </select>
    </label>

    <label className="form-control">
      <span className="label-text">Mode of Residence</span>
      <select name="modeOfResidence" value={editingStudent.modeOfResidence} onChange={handleEditChange}>
        <option value="" disabled>Select Mode of Residence</option>
        <option value="Day Scholar">Day Scholar</option>
        <option value="Hostel">Hostel</option>
      </select>
    </label>

    <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={handleEditSubmit}>Submit</button>
    <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => setIsEditModalOpen(false)}>Close</button>
  </div>
)}

    </div>
  );
}

export default AccountantComponent;
