// AddReceipts.js
import axios from 'axios';
import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';

function AddReceipts() {
    const [students, setStudents] = useState([]);

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



    return (
        <div className="main-container">
          <Navbar />
      
          <div className="overflow-x-auto mt-3">
            <h2 className="text-2xl font-bold text-black-500 mb-4">Student Data</h2>
            <table className="min-w-full border border-gray-800 border-collapse">
              <thead>
              <tr>
                <th className="px-4 py-2 text-black border-r-2 border-gray-800">First Name</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">SurName</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Father's Name</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Primary Contact</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Secondary Contact</th>
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
                {students.map((student, index) => (
                  <tr className="hover:bg-[#00A0E3]" key={index}>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black"><a href={`/AddStudentReceipt/${student.firstName}`} target="_blank" rel="noopener noreferrer">
                                                        {student.firstName}
                                                      </a>
                                                      </td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.surName}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.fatherName}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.primaryContact}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.secondaryContact}</td>
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
      
        </div>
      );
}

export default AddReceipts;
