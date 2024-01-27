// AddReceipts.js
import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { useSelector } from 'react-redux';  

function AddReceipts() {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
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
        student.parentName.toLowerCase().includes(term) ||
        student.branch.toLowerCase().includes(term) ||
        student.primaryContact.includes(term) ||
        student.secondaryContact.includes(term) ||
        student.gender.toLowerCase().includes(term) ||
        student.batch.includes(term) ||
        student.course.toLowerCase().includes(term) ||
        student.modeOfResidence.toLowerCase().includes(term) ||
        // Excluding fields related to Tuition and hostel fees
        student.pendingFirstYearTuitionFee.toString().includes(term) ||
        student.pendingFirstYearHostelFee.toString().includes(term) ||
        student.pendingSecondYearTuitionFee.toString().includes(term) ||
        student.pendingSecondYearHostelFee.toString().includes(term)
      );
    });
  };

  

  const user = useSelector((state) => state.auth.user);
  const userRole = user?.role; // Assuming your user object has a role property

  // If user role is undefined, return an empty div or redirect logic
  if (userRole === undefined) {
    return <div />;
  }
  const filteredStudents = handleSearch(searchQuery);


  const exportToExcel = () => {
    const dataToExport = mapDataToSchema(handleSearch(searchQuery));// Fetch the data to be exported
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    
    // Use FileSaver to save the file
    saveAs(data, 'students_data.xlsx');
  };

  const mapDataToSchema = (data) => {
    return data.map(student => ({
      'Name': `${student.firstName} ${student.surName}`,
      'Batch': student.batch,
    }));
  };
    return (
        <div className="main-container">
          <Navbar />
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <p>
              <button onClick={exportToExcel} className="btn btn-primary" style={{backgroundColor: '#2D5990', margin: '20px'}}>
                Export to Excel
              </button>
              </p>
                  
            </div>
            <div className="rm-10 flex-grow"></div> {/* Empty div with left margin */}
              <h2 className="text-2xl font-bold text-black-500 mb-4">ADD RECEIPTS</h2>
              <div className="flex-grow flex justify-end">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="input input-bordered max-w-xs text-black placeholder-black"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
          </div>
          <div className="flex flex-col items-start"> {/* Aligns children to the start of the flex container, effectively pushing the table to the left */}
            <table className="border border-gray-800 border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Student Name</th>
                  <th className="px-4 py-2 text-black border-r-2 border-gray-800">Batch</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr className="hover:bg-[#00A0E3]" key={index}>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">
                      <a href={`/AddStudentReceipt?applicationNumber=${student.applicationNumber}`} target="_blank" rel="noopener noreferrer">
                        {`${student.firstName} ${student.surName}`.trim()}
                      </a>
                    </td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">{student.batch}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black">
                    <button style={{backgroundColor: '#2D5990', margin: '2px'}}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => window.location.href = `/AddStudentReceipt?applicationNumber=${student.applicationNumber}`}
                    >
                      Add Receipt
                  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


      
        </div>
      );
}

export default AddReceipts;
