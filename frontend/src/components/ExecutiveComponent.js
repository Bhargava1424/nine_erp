import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExecutiveComponent() {
  const [students, setStudents] = useState([]);
  const [editableStudentId, setEditableStudentId] = useState(null);
  const [editedStudentData, setEditedStudentData] = useState({});
  const [updateMessage, setUpdateMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
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

  const handleEditClick = (studentId, studentData) => {
    setEditableStudentId(studentId);
    setEditedStudentData({ ...studentData });
  };

  const handleFieldChange = (field, value) => {
    if (field === 'name') {
      const [firstName, surName] = value.split(' ').map(s => s.trim());
      setEditedStudentData({ ...editedStudentData, firstName, surName });
    } else {
      setEditedStudentData({ ...editedStudentData, [field]: value });
    }
  };

  const handleSubmitChanges = async () => {
    try {
      const response = await axios.put(`http://your-api-endpoint/students/${editableStudentId}`, editedStudentData);
      if (response.status === 200) {
        const changes = Object.entries(editedStudentData)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        setUpdateMessage(`Updated student data: ${changes}`);
        setEditableStudentId(null);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
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
            student.secondaryContact.includes(term) ||
            student.gender.toLowerCase().includes(term) ||
            student.batch.includes(term) ||
            student.course.toLowerCase().includes(term) ||
            student.modeOfResidence.toLowerCase().includes(term)||
            student.pendingFirstYearTuitionFee.toString().includes(term) ||
            student.pendingFirstYearHostelFee.toString().includes(term) ||
            student.pendingSecondYearTuitionFee.toString().includes(term) ||
            student.pendingSecondYearHostelFee.toString().includes(term)             
          );
    });
  };

  const filteredStudents = handleSearch(searchQuery);

  const renderEditableRow = (student) => {
    return (
      <tr className="hover:bg-[#00A0E3]" key={student.id}>
        {/* Editable fields */}
        <td className="border-2 border-gray-800 px-4 py-2 text-black">
          <input 
            type="text" 
            value={`${editedStudentData.firstName || ''} ${editedStudentData.surName || ''}`.trim()} 
            onChange={(e) => handleFieldChange('name', e.target.value)} 
          />
        </td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.fatherName || ''} onChange={(e) => handleFieldChange('fatherName', e.target.value)} /></td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.branch || ''} onChange={(e) => handleFieldChange('branch', e.target.value)} /></td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.primaryContact || ''} onChange={(e) => handleFieldChange('primaryContact', e.target.value)} /></td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.secondaryContact || ''} onChange={(e) => handleFieldChange('secondaryContact', e.target.value)} /></td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.gender || ''} onChange={(e) => handleFieldChange('gender', e.target.value)} /></td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.batch || ''} onChange={(e) => handleFieldChange('batch', e.target.value)} /></td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.dateOfJoining || ''} onChange={(e) => handleFieldChange('dateOfJoining', e.target.value)} /></td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.course || ''} onChange={(e) => handleFieldChange('course', e.target.value)} /></td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black"><input type="text" value={editedStudentData.modeOfResidence || ''} onChange={(e) => handleFieldChange('modeOfResidence', e.target.value)} /></td>
        
        {/* Non-editable (fee-related) fields */}
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.firstYearTuitionFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.firstYearHostelFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.secondYearTuitionFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.secondYearHostelFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingFirstYearTuitionFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingFirstYearHostelFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingSecondYearTuitionFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingSecondYearHostelFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.paidFirstYearTuitionFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.paidFirstYearHostelFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.paidSecondYearTuitionFee}</td>
        <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.paidSecondYearHostelFee}</td>
        {/* ... Add other non-editable fee-related fields ... */}
      </tr>
    );
  };

  const renderReadOnlyRow = (student) => {
    return (
      <tr className="hover:bg-[#00A0E3]" key={student.id} onClick={() => handleEditClick(student.id, student)}>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">
                      {`${student.firstName} ${student.surName}`.trim()}
                    </td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.fatherName}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.branch}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.primaryContact}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.secondaryContact}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.gender}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.batch}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.dateOfJoining ? new Date(student.dateOfJoining).toLocaleDateString() : ''}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.course}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.modeOfResidence}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingFirstYearTuitionFee}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingFirstYearHostelFee}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingSecondYearTuitionFee}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.pendingSecondYearHostelFee}</td>
      </tr>
    );
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
          <th className="px-4 py-2 text-black border-r-2 border-gray-800">Student Name</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Father's Name</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Branch</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Primary Contact</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Secondary Contact</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Gender</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Batch</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Date of Joining</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Course</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Mode of Residence</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Pending 1st Year Tuition Fee</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Pending 1st Year Hostel Fee</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Pending 2nd Year Tuition Fee</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Pending 2nd Year Hostel Fee</th>
      </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) =>
              editableStudentId === student.id
                ? renderEditableRow(student)
                : renderReadOnlyRow(student)
            )}
          </tbody>
        </table>
        {editableStudentId && (
          <div className="mt-4">
            <button onClick={handleSubmitChanges} className="btn btn-primary">Submit Changes</button>
          </div>
        )}
      </div>
      {updateMessage && <div className="alert alert-success mt-4">{updateMessage}</div>}
    </div>
  );
}

export default ExecutiveComponent;
