import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function AccountantComponent() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // New state for managing edit functionality
  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);

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
            student.applicationNumber.toLowerCase().includes(term) ||
            student.surName.toLowerCase().includes(term) ||
            student.parentName.toLowerCase().includes(term) ||
            student.branch.toLowerCase().includes(term) ||
            student.primaryContact.includes(term) ||
            student.gender.toLowerCase().includes(term) ||
            student.batch.includes(term) ||
            student.course.toLowerCase().includes(term) ||
            student.modeOfResidence.toLowerCase().includes(term) ||
            student.pendingFirstYearTuitionFee.toString().includes(term) ||
            student.pendingFirstYearHostelFee.toString().includes(term) ||
            student.pendingSecondYearTuitionFee.toString().includes(term) ||
            student.pendingSecondYearHostelFee.toString().includes(term)
            // Add any additional fields that you might have in your data structure
          );
    });
  };

  const filteredStudents = handleSearch(searchQuery);

  let totalPages = 0;
  let currentStudents = []; 
  if (filteredStudents) {
    totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const indexOfLastStudent = currentPage * rowsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - rowsPerPage;
    currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  }

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle change in rows per page

  // Render pagination
  const renderPageNumbers = () => {
    let pageNumbers = [];
    const totalPages = Math.ceil(sortedAndFilteredStudents.length / rowsPerPage);
    const pageBuffer = 3; // Number of pages to show before and after current page
  
    for (let i = 1; i <= totalPages; i++) {
      // Always add the first and last few pages
      if (i === 1 || i === totalPages || i === currentPage || (i >= currentPage - pageBuffer && i <= currentPage + pageBuffer)) {
        pageNumbers.push(
          <button key={i} onClick={() => paginate(i)} className={`btn ${currentPage === i ? 'btn-active' : ''}`}>
            {i}
          </button>
        );
      }
    }
  
    // Insert ellipses where there are gaps in the page numbers
    const withEllipses = [];
    let prevPage = null;
    for (const page of pageNumbers) {
      if (prevPage) {
        // If there's a gap between this page and the previous page, insert ellipses
        if (page.key - prevPage.key > 1) {
          withEllipses.push(<span key={`ellipsis-${prevPage.key}`} className="px-2">...</span>);
        }
      }
      withEllipses.push(page);
      prevPage = page;
    }
  
    return withEllipses;
  };


  // New function to open the edit modal
  
  // New function to handle field change in the edit modal
  const [validationErrors, setValidationErrors] = useState({ primaryContact: '', secondaryContact: '' });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let newValidationErrors = { ...validationErrors };
  
    // Validation for names
    if (name === 'firstName' || name === 'surName' || name === 'parentName') {
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
      var SchoolManagementSystemApi = require('school_management_system_api');
      var api = new SchoolManagementSystemApi.DbApi();
      const opts = {
        body: {
          "collectionName": "students",
          "query": {
            'applicationNumber': editingStudent.applicationNumber
          },
          "type": 'updateOne',
          "update": {
            "firstName": editingStudent.firstName,
            "surName": editingStudent.surName,
            "parentName": editingStudent.parentName,
            "primaryContact": editingStudent.primaryContact,
            "secondaryContact": editingStudent.secondaryContact,
            "gender": editingStudent.gender,
            "batch": editingStudent.batch,
            "course": editingStudent.course,
            "modeOfResidence": editingStudent.modeOfResidence,
            "studentStatus": editingStudent.studentStatus,
          }
        }
      };
  
      api.dbUpdate(opts, function(error, data, response) {
        if (error) {
          console.error('API Error:', error);
        } else {
          try {
            const responseBody = response.body; // Assuming response.body is already in JSON format
            console.log(responseBody);
            setStudents(responseBody.data); // Assuming the actual data is in responseBody.data
  
            // Close the modal and reset editingStudent
            setIsEditModalOpen(false);
            setEditingStudent(null);
  
            // Display success message with changes
            console.log(`Student updated successfully: ${JSON.stringify(editingStudent)}`);
  
            // Reload the page
            window.location.reload();
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
          }
        }
      });
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
      'Application Number': student.applicationNumber,
      'Parent Name': student.parentName,
      'Branch': student.branch,
      'Primary Contact': student.primaryContact,
      'Gender': student.gender,
      'Batch': student.batch,
      'Date of Joining': student.dateOfJoining ? new Date(student.dateOfJoining).toLocaleDateString() : '',
      'Course': student.course,
      'Mode of Residence': student.modeOfResidence,
      'Pending 1st Year Tuition Fee': student.pendingFirstYearTuitionFee,
      'Pending 1st Year Hostel Fee': student.pendingFirstYearHostelFee,
      'Pending 2nd Year Tuition Fee': student.pendingSecondYearTuitionFee,
      'Pending 2nd Year Hostel Fee': student.pendingSecondYearHostelFee,
      // Add other fields if necessary
    }));
  };
  


  return (

    
    <div className="main-container">

        <div className="bg-gray-100 border border-gray-300 rounded-lg p-5 text-center my-5">
          <h1 className="text-gray-800 text-2xl font-bold mb-3">NINE EDUCATION FEE MANAGEMENT SYSTEM</h1>
          <p className="text-red-600 text-lg font-semibold">
            ⚠️ The activity on this page is being logged by the admin. Any fraudulent activity is liable for prosecution.
          </p>
        </div>
        
      

<div className="overflow-x-auto mt-3">
  <div className="flex justify-center items-center">
    <div className="flex items-center">
      <p>
      <button onClick={exportToExcel} className="btn btn-primary" style={{backgroundColor: '#00A0E3', margin: '20px'}}>
        Export to Excel
      </button>
      </p>
           
    </div>
    <div className="rm-10 flex-grow"></div> {/* Empty div with left margin */}
        <div className="card bg-slate-600 text-black p-2"> {/* Added padding here */}
            <h2 className="text-2xl font-bold text-white">DASHBOARD</h2>
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



  
  
  <table className="min-w-full border border-gray-800 border-collapse">
    <thead>
      <tr style={{backgroundColor: '#2D5990', color:'#FFFFFF'}}>
        <th className="px-4 py-2  border-r-2 border-gray-800">Student Name</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Application Number</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Parent Name</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Primary Contact</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Gender</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Batch</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Course</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Mode of Residence</th>     
        <th className="px-4 py-2  border-r-2 border-gray-800">Pending 1st Year Tuition Fee</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Pending 1st Year Hostel Fee</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Pending 2nd Year Tuition Fee</th>
        <th className="px-4 py-2  border-r-2 border-gray-800">Pending 2nd Year Hostel Fee</th>
      </tr>
    </thead>
    <tbody>
      {currentStudents.map((student, index) => (
        <tr className="odd:bg-[#FFFFFF] even:bg-[#F2F2F2]" key={index}>
    <td className="border-2 border-gray-800 px-4 py-2">{`${student.firstName} ${student.surName}`.trim()}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.applicationNumber}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.parentName}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.primaryContact}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.gender}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.batch}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.course}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.modeOfResidence}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.pendingFirstYearTuitionFee}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.pendingFirstYearHostelFee}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.pendingSecondYearTuitionFee}</td>
    <td className="border-2 border-gray-800 px-4 py-2">{student.pendingSecondYearHostelFee}</td>
</tr>

      ))}
    </tbody>
  </table>
</div>

    {isEditModalOpen && (
      <div className="edit-modal">
        <h3 className="text-lg font-semibold mb-4">Editing Student Details</h3>
        <h3 className="text-lg font-semibold mb-4">{editingStudent.applicationNumber}</h3>


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
          <input type="text" name="parentName" value={editingStudent.parentName} onChange={handleEditChange} />
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

        <label className="form-control">
          <span className="label-text">Student Status</span>
          <select name="studentStatus" value={editingStudent.studentStatus} onChange={handleEditChange}>
            <option value="Active">ACTIVE</option>
            <option value="Cancelled">CANCELLED</option>
          </select>
        </label>

        <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={handleEditSubmit}>Submit</button>
        <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => setIsEditModalOpen(false)}>Close</button>
      </div>
    )}
      <div className="pagination">
        {renderPageNumbers()}
      </div>

      

</div>
  );
}

export default AccountantComponent;
