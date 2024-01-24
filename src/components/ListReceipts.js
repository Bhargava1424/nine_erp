import Navbar from './Navbar'; // Adjust the import path if necessary
import React, { useState, useEffect } from 'react';


function ListReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [amountPaid, setAmountPaid] = useState("");
    const [feeType, setFeeType] = useState("");
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

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page on row change
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


    const handleDownload = (receiptNumber) => {
      // Redirect to DownloadReceipt component or specific URL
      // For example, using window.location:
      const receiptUrl = `/DownloadReceipt?amountPaid=${amountPaid}&receiptNumber=${receipts.receiptNumber}&feeType=${feeType}`;
      window.open(receiptUrl, '_blank');
  };

    

    
  
    return (
      <div className="main-container">
        <Navbar/>


        {/* Render your receipts table here */}
        <div> 
            <input
                type="text"
                placeholder="Search..."
                className="input input-bordered w-full max-w-xs"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="flex items-center">
                <label htmlFor="rowsPerPage" className="mr-2 text-lg">Rows per page:</label>
                <select 
                    id="rowsPerPage"
                    value={rowsPerPage} 
                    onChange={handleRowsPerPageChange}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                >
                    {[5, 10, 20, 30, 40, 50, 100, 200].map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </div>


            <table className="min-w-full border border-gray-800 border-collapse">
            <thead>
                <tr >
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
  