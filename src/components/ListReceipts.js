import Navbar from './Navbar'; // Adjust the import path if necessary
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



function ListReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(100);
    
    const currentDate = new Date();
    const fourDaysAgo = new Date(currentDate);
    fourDaysAgo.setDate(currentDate.getDate() - 4);


    const fetchReceipts = async () => {
      try {
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.DbApi();
        let query = {};
        const userRole = localStorage.getItem('userRole');
        console.log(userRole);
        if (userRole === 'Accountant' || userRole === 'Executive') {
          query = {
            'dateOfPayment': {'$gte': fourDaysAgo}
          }
        };
        const opts = {
          body: {
            "collectionName": "receipts",
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
              setReceipts(responseBody); // Assuming the actual data is in responseBody
            } catch (parseError) {
              console.error('Error parsing response:', parseError);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    useEffect(() => {
      fetchReceipts();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    const handleSearch = (searchQuery) => {
        if (!searchQuery) {
            return receipts;
        }

        const searchTerms = searchQuery.split(',').map(term => term.trim().toLowerCase());

        return receipts.filter(receipt => {
            return searchTerms.every(term =>
                Object.values(receipt).some(value => 
                    value && value.toString().toLowerCase().includes(term)
                )
            );
        });
    };

    const filteredReceipts = handleSearch(searchTerm);

    // Calculate the pagination
    const indexOfLastReceipt = currentPage * rowsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - rowsPerPage;
    const currentReceipts = filteredReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt);

    // Calculate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredReceipts.length / rowsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
        return (
            <button 
                key={number} 
                onClick={() => setCurrentPage(number)}
                className={`btn ${currentPage === number ? 'btn-active' : ''}`}
            >
                {number}
            </button>
        );
    });


    const handleDownload = (receipt) => {

      let feeType = '';
    let amountPaid = 0;

    if (receipt.firstYearTuitionFeePayable != null) {
        feeType = 'FirstYearTuitionFee';
        amountPaid = receipt.firstYearTuitionFeePaid;
    } else if (receipt.firstYearHostelFeePayable != null) {
        feeType = 'FirstYearHostelFee';
        amountPaid = receipt.firstYearHostelFeePaid;
    } else if (receipt.secondYearTuitionFeePayable != null) {
        feeType = 'SecondYearTuitionFee';
        amountPaid = receipt.secondYearTuitionFeePaid;
    } else if (receipt.secondYearHostelFeePayable != null) {
        feeType = 'SecondYearHostelFee';
        amountPaid = receipt.secondYearHostelFeePaid;
    }

      // Redirect to DownloadReceipt component or specific URL
      // For example, using window.location:
      const receiptUrl = `/DownloadReceipt?amountPaid=${amountPaid}&receiptNumber=${receipt.receiptNumber}&feeType=${feeType}`;
      window.open(receiptUrl, '_blank');
  };

  const exportToExcel = () => {
    const dataToExport = mapDataToSchema(handleSearch(searchTerm));// Fetch the data to be exported
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
      '1st Year Tuition Fee': student.firstYearTuitionFee,
      '1st Year Hostel Fee': student.firstYearHostelFee,
      '2nd Year Tuition Fee': student.secondYearTuitionFee,
      '2nd Year Hostel Fee': student.secondYearHostelFee,
      'Paid 1st Year Tuition Fee': student.paidFirstYearTuitionFee,
      'Paid 1st Year Hostel Fee': student.paidFirstYearHostelFee,
      'Paid 2nd Year Tuition Fee': student.paidSecondYearTuitionFee,
      'Paid 2nd Year Hostel Fee': student.paidSecondYearHostelFee,
      'Pending 1st Year Tuition Fee': student.pendingFirstYearTuitionFee,
      'Pending 1st Year Hostel Fee': student.pendingFirstYearHostelFee,
      'Pending 2nd Year Tuition Fee': student.pendingSecondYearTuitionFee,
      'Pending 2nd Year Hostel Fee': student.pendingSecondYearHostelFee,
      // Add other fields if necessary
    }));
  };

    
  
    return (
      <div className="main-container">
        <Navbar/>

        {/* Render your receipts table here */}
        <div> 
        <div className="flex justify-center items-center">
          <div className="flex items-center">
            <p>
            <button onClick={exportToExcel} className="btn btn-primary" style={{backgroundColor: '#2D5990', margin: '20px'}}>
              Export to Excel
            </button>
            </p>
                
          </div>
          <div className="rm-10 flex-grow"></div> {/* Empty div with left margin */}
            <h2 className="text-2xl font-bold text-black-500 mb-4">LIST RECEIPTS</h2>
            <div className="flex-grow flex justify-end">
            <input
                      type="text"
                      placeholder="Search..."
                      className="input input-bordered w-full max-w-xs"
                      value={searchTerm}
                      onChange={handleSearchChange}
                  />
            </div>
        </div>


            <table className="min-w-full border border-gray-800 border-collapse">
            <thead>
                <tr >
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Download</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Receipt Number</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Date of Payment</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Student Name</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Parent Name</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Application Number</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Registered Mobile Number</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Batch</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Date of Joining</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Stream</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Gender</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Branch</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Residence Type</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Tuition Fee Payable</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Tuition Fee Paid</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Hostel Fee Payable</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Hostel Fee Paid</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Tuition Fee Payable</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Tuition Fee Paid</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Hostel Fee Payable</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Hostel Fee Paid</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Total Tuition Fee Paid</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Total Tuition Fee Pending</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Total Hostel Fee Paid</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">1st Year Total Hostel Fee Pending</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Total Tuition Fee Paid</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Total Tuition Fee Pending</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Total Hostel Fee Paid</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">2nd Year Total Hostel Fee Pending</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Mode of Payment</th>
                    <th className="px-4 py-2 text-black border-r-2 border-gray-800">Cheque Number</th>
                </tr>
                </thead>

                <tbody>
                    {currentReceipts.map((receipt, index)  => (
                        <tr className="hover:bg-[#00A0E3]" key={index}>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">
                                <button onClick={() => handleDownload(receipt)} className="btn btn-blue">
                                    Download
                                </button>
                          </td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.receiptNumber}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.dateOfPayment}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.studentName}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.parentName}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.applicationNumber}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.registeredMobileNumber}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.batch}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.dateOfJoining}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.stream}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.gender}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.branch}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.residenceType}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.firstYearTuitionFeePayable}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.firstYearTuitionFeePaid}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.firstYearHostelFeePayable}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.firstYearHostelFeePaid}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.secondYearTuitionFeePayable}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.secondYearTuitionFeePaid}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.secondYearHostelFeePayable}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.secondYearHostelFeePaid}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.firstYearTotalTuitionFeePaid}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.firstYearTotalTuitionFeePending}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.firstYearTotalHostelFeePaid}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.firstYearTotalHostelFeePending}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.secondYearTotalTuitionFeePaid}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.secondYearTotalTuitionFeePending}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.secondYearTotalHostelFeePaid}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.secondYearTotalHostelFeePending}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.modeOfPayment}</td>
                          <td className="border-2 border-gray-800 px-4 py-2 text-black">{receipt.chequeNumber}</td>
                        </tr>
                    ))}
                    </tbody>
            </table>
            <div>
                {renderPageNumbers}
            </div>
        </div>
        
      </div>
    );
  }
  
  export default ListReceipts;
  