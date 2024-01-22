import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AccountantComponent() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
        student.secondaryContact.includes(term) ||
        student.gender.toLowerCase().includes(term) ||
        student.batch.includes(term) ||
        student.course.toLowerCase().includes(term) ||
        student.modeOfResidence.toLowerCase().includes(term) ||
        // Excluding fields related to tuition and hostel fees
        student.pendingFirstYearTuitionFee.toString().includes(term) ||
        student.pendingFirstYearHostelFee.toString().includes(term) ||
        student.pendingSecondYearTuitionFee.toString().includes(term) ||
        student.pendingSecondYearHostelFee.toString().includes(term)
      );
    });
  };

  const filteredStudents = handleSearch(searchQuery);

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
      {filteredStudents.map((student, index) => (
        <tr className="hover:bg-[#00A0E3]" key={index}>
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
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default AccountantComponent;
