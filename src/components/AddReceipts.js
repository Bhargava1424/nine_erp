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
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.DbApi();
        const opts = {
          body: {
            "collectionName": "students",
            "query": {
              "studentStatus": "Active"
            },
            "type": "findMany"
          }
        };
        
        console.log(opts.body);
    
        api.dbGet(opts, function(error, data, response) {
          if (error) {
            console.error('API Error:', error);
          } else {
            try {
              const responseBody = response.body; // Assuming response.body is already in JSON format
              console.log(responseBody);
              setStudents(responseBody) // Assuming the actual data is in responseBody.data
            } catch (parseError) {
              console.error('Error parsing response:', parseError);
            }
          }
        });

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
            <h2 className="text-2xl font-bold text-gray-500 mb-4">Student Data</h2>
            <table className="min-w-full " style={{ backgroundColor: '#00A0E3'  }}>
              <thead className="bg-cyan-200" style={{ backgroundColor:'#2D5990'  }}>
                <tr>
                <th className="px-4 py-2">First Name</th>
                  <th className="px-4 py-2">SurName</th>
                  <th className="px-4 py-2">Parent's Name</th>
                  <th className="px-4 py-2">Primary Contact</th>
                  <th className="px-4 py-2">Secondary Contact</th>
                  <th className="px-4 py-2">Gender</th>
                  <th className="px-4 py-2">Batch</th>
                  <th className="px-4 py-2">Date of Joining</th>
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Mode of Residence</th>
                  <th className="px-4 py-2">1st Year Tuition Fee</th>
                  <th className="px-4 py-2">1st Year Hostel Fee</th>
                  <th className="px-4 py-2">2nd Year Tuition Fee</th>
                  <th className="px-4 py-2">2nd Year Hostel Fee</th>
                  <th className="px-4 py-2">Paid 1st Year Tuition Fee</th>
                  <th className="px-4 py-2">Paid 1st Year Hostel Fee</th>
                  <th className="px-4 py-2">Paid 2nd Year Tuition Fee</th>
                  <th className="px-4 py-2">Paid 2nd Year Hostel Fee</th>
                  <th className="px-4 py-2">Pending 1st Year Tuition Fee</th>
                  <th className="px-4 py-2">Pending 1st Year Hostel Fee</th>
                  <th className="px-4 py-2">Pending 2nd Year Tuition Fee</th>
                  <th className="px-4 py-2">Pending 2nd Year Hostel Fee</th>
                </tr>
              </thead>
              <tbody className="">
                {students.map((student, index) => (
                  <tr className="hover:bg-gray-50" key={index}>
                    <td className="border px-4 py-2"><Link to={`/AddStudentReceipt/${student.applicationNumber}`}>
                                                        {student.applicationNumber}
                                                      </Link>
                                                      </td>
                    <td className="border px-4 py-2">{student.surName}</td>
                    <td className="border px-4 py-2">{student.parentName}</td>
                    <td className="border px-4 py-2">{student.primaryContact}</td>
                    <td className="border px-4 py-2">{student.secondaryContact}</td>
                    <td className="border px-4 py-2">{student.gender}</td>
                    <td className="border px-4 py-2">{student.batch}</td>
                    <td className="border px-4 py-2">{student.dateOfJoining ? new Date(student.dateOfJoining).toLocaleDateString() : ''}</td>
                    <td className="border px-4 py-2">{student.course}</td>
                    <td className="border px-4 py-2">{student.modeOfResidence}</td>
                    <td className="border px-4 py-2">{student.firstYearTuitionFee}</td>
                    <td className="border px-4 py-2">{student.firstYearHostelFee}</td>
                    <td className="border px-4 py-2">{student.secondYearTuitionFee}</td>
                    <td className="border px-4 py-2">{student.secondYearHostelFee}</td>
                    <td className="border px-4 py-2">{student.paidFirstYearTuitionFee}</td>
                    <td className="border px-4 py-2">{student.paidFirstYearHostelFee}</td>
                    <td className="border px-4 py-2">{student.paidSecondYearTuitionFee}</td>
                    <td className="border px-4 py-2">{student.paidSecondYearHostelFee}</td>
                    <td className="border px-4 py-2">{student.pendingFirstYearTuitionFee}</td>
                    <td className="border px-4 py-2">{student.pendingFirstYearHostelFee}</td>
                    <td className="border px-4 py-2">{student.pendingSecondYearTuitionFee}</td>
                    <td className="border px-4 py-2">{student.pendingSecondYearHostelFee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      
        </div>
      );
}

export default AddReceipts;
