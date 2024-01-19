import Login2 from './Login2';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HeroSection2() {
  const userRole = useSelector((state) => state.auth.user?.role);
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

  return (
    <div className="hero-section">
      {userRole ? (
        renderContentBasedOnRole(userRole, filteredStudents, searchQuery, handleSearchChange)
      ) : (
        <Login2 />
      )}
    </div>
  );
}


// Helper function to render content based on role
function renderContentBasedOnRole(userRole, students, searchQuery, handleSearchChange) {
  switch (userRole) {
    case 'Admin':
      return (
        <div className="main-container">
<input
  type="text"
  placeholder="Search students..."
  className="input input-bordered w-full max-w-xs text-black placeholder-black dark:text-white dark:placeholder-white"
  value={searchQuery}
  onChange={handleSearchChange}
/>

          
          <div className="overflow-x-auto mt-3">
            <h2 className="text-2xl font-bold text-black-500 mb-4">Student Data</h2>
            
            <table className="min-w-full " style={{ backgroundColor: '#E0FFFF' }}>
            <thead style={{ backgroundColor: '#2D5990' }}>
                <tr>
                  <th className="px-4 py-2 text-black">First Name</th>
                  <th className="px-4 py-2 text-black">SurName</th>
                  <th className="px-4 py-2 text-black">Father's Name</th>
                  <th className="px-4 py-2 text-black">Primary Contact</th>
                  <th className="px-4 py-2 text-black">Branch</th>
                  <th className="px-4 py-2 text-black">Secondary Contact</th>
                  <th className="px-4 py-2 text-black">Gender</th>
                  <th className="px-4 py-2 text-black">Batch</th>
                  <th className="px-4 py-2 text-black">Date of Joining</th>
                  <th className="px-4 py-2 text-black">Course</th>
                  <th className="px-4 py-2 text-black">Mode of Residence</th>
                  <th className="px-4 py-2 text-black">1st Year Tuition Fee</th>
                  <th className="px-4 py-2 text-black">1st Year Hostel Fee</th>
                  <th className="px-4 py-2 text-black">2nd Year Tuition Fee</th>
                  <th className="px-4 py-2 text-black">2nd Year Hostel Fee</th>
                  <th className="px-4 py-2 text-black">Paid 1st Year Tuition Fee</th>
                  <th className="px-4 py-2 text-black">Paid 1st Year Hostel Fee</th>
                  <th className="px-4 py-2 text-black">Paid 2nd Year Tuition Fee</th>
                  <th className="px-4 py-2 text-black">Paid 2nd Year Hostel Fee</th>
                  <th className="px-4 py-2 text-black">Pending 1st Year Tuition Fee</th>
                  <th className="px-4 py-2 text-black">Pending 1st Year Hostel Fee</th>
                  <th className="px-4 py-2 text-black">Pending 2nd Year Tuition Fee</th>
                  <th className="px-4 py-2 text-black">Pending 2nd Year Hostel Fee</th>
                </tr>
              </thead>
              <tbody className="">
                {students.map((student, index) => (
                  <tr className="hover:bg-gray-50" key={index} style={{ backgroundColor: '#00A0E3' }}>
                    <td className="border px-4 py-2 text-black">{student.firstName}</td>
                    <td className="border px-4 py-2 text-black">{student.surName}</td>
                    <td className="border px-4 py-2 text-black">{student.fatherName}</td>
                    <td className="border px-4 py-2 text-black">{student.branch}</td>
                    <td className="border px-4 py-2 text-black">{student.primaryContact}</td>
                    <td className="border px-4 py-2 text-black">{student.secondaryContact}</td>
                    <td className="border px-4 py-2 text-black">{student.gender}</td>
                    <td className="border px-4 py-2 text-black">{student.batch}</td>
                    <td className="border px-4 py-2 text-black">{student.dateOfJoining ? new Date(student.dateOfJoining).toLocaleDateString() : ''}</td>
                    <td className="border px-4 py-2 text-black">{student.course}</td>
                    <td className="border px-4 py-2 text-black">{student.modeOfResidence}</td>
                    <td className="border px-4 py-2 text-black">{student.firstYearTuitionFee}</td>
                    <td className="border px-4 py-2 text-black">{student.firstYearHostelFee}</td>
                    <td className="border px-4 py-2 text-black">{student.secondYearTuitionFee}</td>
                    <td className="border px-4 py-2 text-black">{student.secondYearHostelFee}</td>
                    <td className="border px-4 py-2 text-black">{student.paidFirstYearTuitionFee}</td>
                    <td className="border px-4 py-2 text-black">{student.paidFirstYearHostelFee}</td>
                    <td className="border px-4 py-2 text-black">{student.paidSecondYearTuitionFee}</td>
                    <td className="border px-4 py-2 text-black">{student.paidSecondYearHostelFee}</td>
                    <td className="border px-4 py-2 text-black">{student.pendingFirstYearTuitionFee}</td>
                    <td className="border px-4 py-2 text-black">{student.pendingFirstYearHostelFee}</td>
                    <td className="border px-4 py-2 text-black">{student.pendingSecondYearTuitionFee}</td>
                    <td className="border px-4 py-2 text-black">{student.pendingSecondYearHostelFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case 'Accountant':
      return (
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
            </div>
          </div>
        </div>
      );
    default:
      // Default case, for unknown roles
      return <div>Welcome! You have default content here.</div>;
  }
}

export default HeroSection2;
