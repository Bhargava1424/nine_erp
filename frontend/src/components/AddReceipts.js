// AddReceipts.js
import axios from 'axios';
import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
            <table className="min-w-full " style={{ backgroundColor: '#00A0E3'  }}>
              <thead className="bg-cyan-200" style={{ backgroundColor:'#2D5990'  }}>
                <tr>
                <th className="px-4 py-2 text-black">First Name</th>
                  <th className="px-4 py-2 text-black">SurName</th>
                  <th className="px-4 py-2 text-black">Father's Name</th>
                  <th className="px-4 py-2 text-black">Primary Contact</th>
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
                  <tr className="hover:bg-gray-50" key={index}>
                    <td className="border px-4 py-2 text-black"><Link to={`/AddStudentReceipt/${student.firstName}`}>
                                                        {student.firstName}
                                                      </Link>
                                                      </td>
                    <td className="border px-4 py-2 text-black">{student.surName}</td>
                    <td className="border px-4 py-2 text-black">{student.fatherName}</td>
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
}

export default AddReceipts;
