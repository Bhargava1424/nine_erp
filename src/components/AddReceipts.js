// AddReceipts.js
import Navbar from './Navbar';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { useSelector } from 'react-redux';  

function AddReceipts() {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 100;

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const user = JSON.parse(localStorage.getItem('user'));

      
    
  useEffect(() => {
    // Function to fetch students data from the backend
    const fetchStudents = async () => {
      try {
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.DbApi();
        const isManager = user.role==="Manager";
        console.log("Testing concession:",user.branch);
        const query = isManager?{"studentStatus": "Active"} : {"studentStatus": "Active", "branch": user.branch};        
        const opts = {
          body: {
            "collectionName": "students",
            "query": query,
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
        (student.firstName?.toLowerCase().includes(term) || "") ||
        (student.surName?.toLowerCase().includes(term) || "") ||
        (student.batch?.includes(term) || "")
      );
    });
  };
  

  

  const userRole = user?.role; // Assuming your user object has a role property

  // If user role is undefined, return an empty div or redirect logic
  if (userRole === undefined) {
    return <div />;
  }


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

  const filteredStudents = handleSearch(searchQuery);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const renderPageNumbers = () => {
    let pages = [];

    // Always add the first page
    pages.push(
      <button key={1} className={`btn ${currentPage === 1 ? 'btn-active' : ''}`} onClick={() => setCurrentPage(1)}>1</button>
    );

    // Ellipsis for skipping pages between
    if (currentPage > 3) {
      pages.push(<span key="left-ellipsis">...</span>);
    }

    // Current page and its adjacent ones
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} className={`btn ${currentPage === i ? 'btn-active' : ''}`} onClick={() => setCurrentPage(i)}>{i}</button>
      );
    }

    // Second ellipsis
    if (currentPage < totalPages - 2) {
      pages.push(<span key="right-ellipsis">...</span>);
    }

    // Always add the last page
    if (totalPages > 1) {
      pages.push(
        <button key={totalPages} className={`btn ${currentPage === totalPages ? 'btn-active' : ''}`} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
      );
    }

    return (
      <div className="pagination">{pages}</div>
    );
  };








    return (
        <div className="main-container root-container">
          <Navbar />
          <div className="flex justify-center items-center">
            <div className="flex items-center">
              <p>
              <button onClick={exportToExcel} className="btn btn-primary" style={{backgroundColor: '#00A0E3', margin: '20px'}}>
                Export to Excel
              </button>
              </p>
                  
            </div>
            <div className="rm-10 flex-grow"></div> {/* Empty div with left margin */}
            <div className="card bg-slate-600 text-black px-4 py-2"> {/* Added padding here */}
            <h2 className="text-2xl font-bold text-white">ADD RECEIPTS</h2>
            </div>
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

          
          <div className="flex flex-col items-center justify-center"> {/* Aligns children to the start of the flex container, effectively pushing the table to the left */}
          <div className="pagination">
            {renderPageNumbers()}
          </div>          
            <table className="border border-gray-800 border-collapse ">
              <thead>
                <tr style={{backgroundColor: '#2D5990', color:'#FFFFFF'}}>
                  <th className="px-4 py-2 text-white border-r-2 border-gray-800 text-sm">Student Name</th>
                  <th className="px-4 py-2 text-white border-r-2 border-gray-800 text-sm">Parent Name</th>
                  <th className="px-4 py-2 text-white border-r-2 border-gray-800 text-sm">Primary Contact</th>
                  <th className="px-4 py-2 text-white border-r-2 border-gray-800 text-sm">Batch</th>
                  <th className="px-4 py-2 text-white border-r-2 border-gray-800 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student, index) => (
                  <tr className="odd:bg-[#FFFFFF] even:bg-[#F2F2F2]" key={index}>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black text-sm">
                      <a href={`/AddStudentReceipt?applicationNumber=${student.applicationNumber}`} target="_blank" rel="noopener noreferrer">
                        {`${student.firstName} ${student.surName}`.trim()}
                      </a>
                    </td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black text-sm">{student.parentName}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black text-sm">{student.primaryContact}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black text-sm">{student.batch}</td>
                    <td className="border-2 border-gray-800 px-4 py-2 text-black text-sm">
                    <button style={{backgroundColor: '#2D5990', margin: '2px'}}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                      onClick={() => window.location.href = `/AddStudentReceipt?applicationNumber=${student.applicationNumber}`}
                    >
                      Add Receipt
                  </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {renderPageNumbers()}
            </div>
          </div>


      
        </div>
      );
}

export default AddReceipts;
