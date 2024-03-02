import Navbar from './Navbar'; // Adjust the import path if necessary
import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { BlobProvider } from '@react-pdf/renderer'; 




function ListReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [editingReceipt, setEditingReceipt] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const currentDate = new Date();
    const fourDaysAgo = new Date(currentDate);
    fourDaysAgo.setDate(currentDate.getDate() - 4);
    
    
    console.log('---->', fourDaysAgo);

    const [sortConfig, setSortConfig] = useState({ key: 'dateOfPayment', direction: 'descending' });

    const user = JSON.parse(localStorage.getItem('user'));
    
    const isAccountant = ['Accountant'].includes(user.role);
    const isExecutive = ['Executive'].includes(user.role);
    const isManager = ['Manager'].includes(user.role);
    const isDirector = ['Director'].includes(user.role);

    const fetchReceipts = async () => {
      try {
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.DbApi();
        let query = {};
        
        console.log(user.role);
        if (user.role === 'Accountant') {
          query = {
            'dateIso': {'$gte': fourDaysAgo},
            'branch':user.branch
          }
        };
        if (user.role === 'Executive') {
          query = { 
            'branch':user.branch
          }
        };
        if (user.role === 'Director') {
          query = { 
            'branch':user.branch
          }
        };
        const opts = {
          body: {
            "collectionName": "receipts",
            "query": query,
            "type": "findMany"
          }
        };
        
        function getFeeType(feeType) {
          if (feeType === 'First Year Tuition Fee') {
            return 'firstYearTuitionFeePaid';
          } 
          else if (feeType === 'First Year Hostel Fee') {
            return 'firstYearHostelFeePaid';
          }
          else if (feeType === 'Second Year Tuition Fee') {
            return 'secondYearTuitionFeePaid';
          }
          else if (feeType === 'Second Year Hostel Fee') {
            return 'secondYearHostelFeePaid';
          }
        };
  
        console.log(opts.body);
  
        api.dbGet(opts, function(error, data, response) {
          if (error) {
            console.error('API Error:', error);
          } else {
            try {
              const responseBody = response.body; // Assuming response.body is already in JSON format
              console.log('Response:', responseBody);
              const updatedReceipts = responseBody.map(receipt => {
                const feeType = determineFeeType(receipt);
                console.log('Fee Type:', feeType);
                const amountPaid = determineAmountPaid(receipt);
                const amountFeeType = getFeeType(feeType);
                const updatedAmount = amountPaid;
                return { ...receipt, feeType, amountPaid, amountFeeType, updatedAmount };
              });
              console.log('Updated Receipts:', updatedReceipts);
              setReceipts(updatedReceipts); // Assuming the actual data is in responseBody
              
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
      if(receipts.length === 0)
      {
        fetchReceipts();
      }
    }, );


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

    const filteredReceipts = useMemo(() => {
        if (!searchTerm) return receipts;
        const searchTerms = searchTerm.split(',').map(term => term.trim().toLowerCase());
        return receipts.filter(receipt =>
            searchTerms.every(term =>
                Object.keys(receipt).some(key =>
                    receipt[key] && receipt[key].toString().toLowerCase().includes(term)
                  )
              )
          );
      }, [searchTerm, receipts]);

    const sortedAndFilteredReceipts = useMemo(() => {
      
    
      return filteredReceipts.sort((a, b) => {
          if (sortConfig === null) return 0;
    
          // Special handling for dateOfPayment
          if (sortConfig.key === 'dateOfPayment') {
              const parseDate = (dateStr) => {
                  // Split the date and time parts
                  const [time, date] = dateStr.split(' ');
                  const [hours, minutes] = time.split('-').map(Number);
                  const [day, month, year] = date.split('-').map(Number);
                  // Return a Date object
                  return new Date(year, month - 1, day, hours, minutes);
              };
    
              const dateA = parseDate(a.dateOfPayment);
              const dateB = parseDate(b.dateOfPayment);
              // Compare the Date objects
              return (dateA - dateB) * (sortConfig.direction === 'ascending' ? 1 : -1);
          }
    
          // Handle other fields generically
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
      });
    }, [filteredReceipts, receipts, searchTerm, sortConfig]);
    
  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // Reset to first page
  };
  const [originalReceiptData, setOriginalReceiptData] = useState(null);

    const openEditModal = (receipt) => {
      setEditingReceipt({ ...receipt });

      setOriginalReceiptData({ ...receipt }); 
      setIsEditModalOpen(true);
  };

  // New function to handle field change in the edit modal
  const [changesToConfirm, setChangesToConfirm] = useState({});

  const handleEditChange = (e) => {
    const { name, value } = e.target;
      // Use the original value from originalStudentData for comparison
  const originalValue = originalReceiptData[name];
    if (name === 'modeOfPayment' && value !== 'CHEQUE') {
        console.log('Mode of Payment:', value);
        // If mode of payment is changed from 'Cheque' to something else, set chequeNumber to null
        setEditingReceipt({ ...editingReceipt, [name]: value, chequeNumber: null, amountPaid: editingReceipt.amountPaid });
    } else {
        console.log(value);
        setEditingReceipt({ ...editingReceipt, [name]: value });
    }
      // Track changes for confirmation
  if (originalValue !== editingReceipt) {
    setChangesToConfirm((prev) => ({ ...prev, [name]: value }));
  } else {
    // If the value was changed back to the original, remove it from changesToConfirm
    const updatedChanges = { ...changesToConfirm };
    delete updatedChanges[name];
    setChangesToConfirm(updatedChanges);
  }
};

const getPendingAmountFeeType = (amountFeeType) => {
  let pendingAmountFeeType = amountFeeType;

  if (amountFeeType === 'firstYearTuitionFeePaid') {
    pendingAmountFeeType = 'firstYearTotalTuitionFeePending';
  } else if (amountFeeType === 'firstYearHostelFeePaid') {
    pendingAmountFeeType = 'firstYearTotalHostelFeePending';
  } else if (amountFeeType === 'secondYearTuitionFeePaid') {
    pendingAmountFeeType = 'secondYearTotalTuitionFeePending';
  } else if (amountFeeType === 'secondYearHostelFeePaid') {
    pendingAmountFeeType = 'secondYearTotalHostelFeePending';
  }

  return pendingAmountFeeType;
};


const [isConfirmed, setIsConfirmed] = useState(false); 
const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

const handleEditSubmit = () => {
  console.log(isConfirmed);
  if (isConfirmed) {
    // If already confirmed through some logic, directly perform submission
    performSubmission(editingReceipt);
  } else {
        // If not confirmed, open the confirmation modal and close the edit modal
        setIsEditModalOpen(false);
        setIsConfirmModalOpen(true);

  }
};

 // Adjust the confirmation and cancellation handlers accordingly
 const handleConfirmationAccept = async (editingReceipt) => {
  setIsConfirmed(true);
  setIsConfirmModalOpen(false); // Ensure confirmation modal is closed
// Directly perform the submission logic here
await performSubmission(editingReceipt);
};

const handleConfirmationCancel = () => {
  setIsConfirmModalOpen(false);
  setIsEditModalOpen(true); // Reopen the editing modal if the user cancels
  setIsConfirmed(false);
};


// Extracted submission logic into a separate function for clarity
const performSubmission = async (editingReceipt) => {

console.log('---->', editingReceipt);
if (editingReceipt.modeOfPayment === 'CHEQUE' && !editingReceipt.chequeNumber) {
    alert("Please enter the Cheque Number.");
    return;
}

// Assuming amountPaid is always related to tuition fees
const amountDifference = parseFloat(editingReceipt.updatedAmount) - parseFloat(editingReceipt.amountPaid);

let totalPaidField, pendingField, studentFeePaid, studentFeePending;
console.log(editingReceipt.amountFeeType);
const PaidfeeType = editingReceipt.amountFeeType;
switch (PaidfeeType) {
    case 'firstYearTuitionFeePaid':
        totalPaidField = 'firstYearTotalTuitionFeePaid';
        pendingField = 'firstYearTotalTuitionFeePending';
        studentFeePaid = 'paidFirstYearTuitionFee';
        studentFeePending = 'pendingFirstYearTuitionFee';
        break;
    case 'firstYearHostelFeePaid':
        totalPaidField = 'firstYearTotalHostelFeePaid';
        pendingField = 'firstYearTotalHostelFeePending';
        studentFeePaid = 'paidFirstYearHostelFee';
        studentFeePending = 'pendingFirstYearHostelFee';
        break;
    case 'secondYearTuitionFeePaid':
        totalPaidField = 'secondYearTotalTuitionFeePaid';
        pendingField = 'secondYearTotalTuitionFeePending';
        studentFeePaid = 'paidSecondYearTuitionFee';
        studentFeePending = 'pendingSecondYearTuitionFee';
        break;
    case 'secondYearHostelFeePaid':
        totalPaidField = 'secondYearTotalHostelFeePaid';
        pendingField = 'secondYearTotalHostelFeePending';
        studentFeePaid = 'paidSecondYearHostelFee';
        studentFeePending = 'pendingSecondYearHostelFee';
        break;
    default:
        console.error("Invalid PaidfeeType.");
        return;
}

console.log('amountDifference:', amountDifference);

// Update the dynamic field and calculate new totals and pendings
const updateData = {
    modeOfPayment: editingReceipt.modeOfPayment,
    chequeNumber: editingReceipt.chequeNumber,
    [PaidfeeType]: parseInt(editingReceipt.updatedAmount),
    [totalPaidField]: (parseFloat(editingReceipt[totalPaidField]) || 0) + amountDifference,
    [pendingField]: Math.max(0, (parseFloat(editingReceipt[pendingField]) || 0) - amountDifference),
};

console.log('updateData:', updateData);

const updateStudentData = {
    [studentFeePaid]: (parseFloat(editingReceipt[totalPaidField]) || 0) + amountDifference,
    [studentFeePending]: Math.max(0, (parseFloat(editingReceipt[pendingField]) || 0) - amountDifference),
};

console.log('updateStudentData:', updateStudentData);
  try {
    var SchoolManagementSystemApi = require('school_management_system_api');
    var api = new SchoolManagementSystemApi.DbApi();
    const opts = {
      body: {
        "collectionName": "receipts",
        "query": { 'receiptNumber': editingReceipt.receiptNumber },
        "type": 'updateOne',
        "update": updateData
      }
    };

    const opts2 = {
      body: {
        "collectionName": "students",
        "query": { 'applicationNumber': editingReceipt.applicationNumber },
        "type": 'updateOne',
        "update": updateStudentData
      }
    };

    api.dbUpdate(opts, function (error, data, response) {
      if (error) {
        console.error('API Error:', error);
      } else {
        api.dbUpdate(opts2, function (error, data, response) {
          if (error) {
            console.error('API Error:', error);
          } else {
            console.log('Update successful:', response.body);
            setIsEditModalOpen(false);
            setIsConfirmed(false);
            setEditingReceipt(null);
            fetchReceipts();
          }
        }
        );
      }
    });
  } catch (error) {
    console.error("Error updating receipt: ", error);
  }
  console.log("Performing submission with the edited data...");
};
 
    // const filteredReceipts = handleSearch(searchTerm);

    // Calculate the pagination
    const indexOfLastReceipt = currentPage * rowsPerPage;
    const indexOfFirstReceipt = indexOfLastReceipt - rowsPerPage; 

    // Calculate page numbers
    const pageNumbers = [];
    const totalPages = Math.ceil(filteredReceipts.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(i);
      }
    }

    const renderPageNumbers = (
      <div>
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className="btn"
          disabled={currentPage === 1}
        >
          Prev
        </button>
    
        {pageNumbers.map((number, index) => {
          if (index > 0 && pageNumbers[index] - pageNumbers[index - 1] > 1) {
            return <React.Fragment key={number}>
                     <span>...</span>
                     <button 
                       onClick={() => setCurrentPage(number)}
                       className={`btn ${currentPage === number ? 'btn-active' : ''}`}
                     >
                       {number}
                     </button>
                   </React.Fragment>;
          }
    
          return (
            <button 
              key={number} 
              onClick={() => setCurrentPage(number)}
              className={`btn ${currentPage === number ? 'btn-active' : ''}`}
            >
              {number}
            </button>
          );
        })}
    
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          className="btn"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
    

    const determineAmountPaid = (receipt) => {
      const fees = [
        receipt?.secondYearHostelFeePaid, 
        receipt?.secondYearTuitionFeePaid, 
        receipt?.firstYearHostelFeePaid, 
        receipt?.firstYearTuitionFeePaid
      ];
    
      // Log to inspect the values you're working with
      console.log('Fees:', fees);
    
      // Find the first non-null and non-zero value, providing a default of 0 if none is found
      const amountPaid = fees.find(fee => fee != null && fee !== 0) ?? 0;
    
      console.log('Determined amountPaid:', amountPaid);
      return amountPaid;
    };
    

    const handleDownload = (receipt) => {

      let feeType = '';
    let amountPaid = 0;



      amountPaid = receipt.amountPaid;
      feeType = receipt.feeType;
      // Redirect to DownloadReceipt component or specific URL
      // For example, using window.location:

      console.log('Amount Paid for download:', amountPaid); // Ensure this logs a valid number

      
      const receiptUrl = `/DownloadReceipt?amountPaid=${amountPaid}&receiptNumber=${receipt.receiptNumber}&feeType=${feeType}`;
      console.log(amountPaid); 
      window.open(receiptUrl, '_blank');
  };

  const exportToExcel = () => {
    const dataToExport = mapDataToSchema(handleSearch(searchTerm)); // Fetch the data to be exported
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");
  
    // Generate buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  
    const now = new Date();
    const formattedDate = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
  
    // Create a Blob
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  
    // Use FileSaver to save the file
    saveAs(data, `Receipts ${formattedDate}.xlsx`);
  };
  

  const mapDataToSchema = (data) => {
    return data.map(receipt => ({
      'Receipt Number': receipt.receiptNumber,
      'Date of Payment': formatDate(receipt.dateOfPayment),
      'Student Name': receipt.studentName,
      'Parent Name' :receipt.parentName,
      'Primary Contact' :receipt.registeredMobileNumber,
      'Batch': receipt.batch,
      'Amount Paid': receipt.amountPaid,
      'Fee Type': receipt.feeType,
      'Mode of Payment': receipt.modeOfPayment,
      'Cheque Number': receipt.chequeNumber || 'N/A', // Assuming chequeNumber might be null or not applicable
      // Add other fields if necessary
    }));
  };
  

  
  function formatDate(dateString) {
    // Split the date and time parts
    const [time, date] = dateString.split(' ');
    // Reorder to DD-MM-YYYY HH-mm format
    return `${date} ${time}`;
}
  


  let PaidfeeType; // This will hold the field name of the paid fee

const determineFeeType = (receipt) => {
  if (receipt.firstYearTuitionFeePaid != null && receipt.firstYearTuitionFeePaid !== 0) {
    PaidfeeType = "firstYearTuitionFeePaid"; // Set the field name
    return 'First Year Tuition Fee';
  } else if (receipt.firstYearHostelFeePaid != null && receipt.firstYearHostelFeePaid !== 0) {
    PaidfeeType = "firstYearHostelFeePaid"; // Set the field name
    return 'First Year Hostel Fee';
  } else if (receipt.secondYearTuitionFeePaid != null && receipt.secondYearTuitionFeePaid !== 0) {
    PaidfeeType = "secondYearTuitionFeePaid"; // Set the field name
    return 'Second Year Tuition Fee';
  } else if (receipt.secondYearHostelFeePaid != null && receipt.secondYearHostelFeePaid !== 0) {
    PaidfeeType = "secondYearHostelFeePaid"; // Set the field name
    return 'Second Year Hostel Fee';
  }
  PaidfeeType = null; // If none of the conditions are met, reset PaidfeeType
  return 'N/A';
 // Default value if none of the fees are paid
};
 


const requestSort = (key) => {
  let direction = 'ascending';
  if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  setSortConfig({ key, direction });
};
const getSortIndicator = (columnName) => {
  if (sortConfig && sortConfig.key === columnName) {
    return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
  }
  return ''; // Return nothing if the column is not being sorted
};

const isRecentlyAdded = (dateOfPayment) => {
  // Split the dateOfPayment string into time and date components
  const [timePart, datePart] = dateOfPayment.split(' ');
  const [hours, minutes] = timePart.split('-').map(num => parseInt(num, 10));
  const [day, month, year] = datePart.split('-').map(num => parseInt(num, 10));

  // Create a new Date object using the local time zone
  const receiptDate = new Date(year, month - 1, day, hours, minutes);

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000)); // Calculate one hour ago from current time

  return receiptDate > oneHourAgo;
};

function formatNumberIndia(num) {
  // Check if num is null or undefined before proceeding
  if (num === null || num === undefined) {
      return "0"; // Or any other fallback value you prefer
  }

  var x = num.toString();
  var lastThree = x.substring(x.length - 3);
  var otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
  }
  var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return res;
}



  
    return (
      <div className="main-container root-container">
        <Navbar/>
 

        {/* Render your receipts table here */}
        <div> 
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
            <h2 className="text-2xl font-bold text-white">RECEIPTS LIST</h2>
          </div>
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

        <div>
                {renderPageNumbers}
            </div>


            <table className="min-w-full border border-gray-800 border-collapse">
              
            <thead>
              <tr className="text-sm" style={{backgroundColor: '#2D5990', color:'#FFFFFF'}}>
                <th onClick={() => requestSort('receiptNumber')}>
                  Receipt Number{getSortIndicator('receiptNumber')}
                </th>
                <th onClick={() => requestSort('dateOfPayment')}>
                  Date of Payment{getSortIndicator('dateOfPayment')}
                </th>
                <th onClick={() => requestSort('studentName')}>
                  Student Name{getSortIndicator('studentName')}
                </th>
                <th onClick={() => requestSort('parentName')}>
                  Parent Name{getSortIndicator('parentName')}
                </th>
                <th onClick={() => requestSort('registeredMobileNumber')}>
                  Primary Contact{getSortIndicator('registeredMobileNumber')}
                </th>
                <th onClick={() => requestSort('batch')}>
                  Batch{getSortIndicator('batch')}
                </th>
                <th onClick={() => requestSort('amountPaid')}>
                  Amount Paid{getSortIndicator('amountPaid')}
                </th>
                <th>
                  Fee Type
                </th>
                <th onClick={() => requestSort('modeOfPayment')}>
                  Mode of Payment{getSortIndicator('modeOfPayment')}
                </th>
                <th onClick={() => requestSort('chequeNumber')}>
                  Cheque Number{getSortIndicator('chequeNumber')}
                </th>
                {!isAccountant && (isManager || isExecutive || isDirector) && <th>Action</th>}
                <th className="px-4 py-2 text-white border-r-2 border-gray-800">Download</th>
              </tr>
            </thead>



                <tbody>
                {sortedAndFilteredReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt).map((receipt, index) => (
                        <tr className="odd:bg-[#FFFFFF] even:bg-[#F2F2F2] " key={index}>                          
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.receiptNumber}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{formatDate(receipt.dateOfPayment)}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.studentName}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.parentName}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.registeredMobileNumber}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.batch}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.amountPaid}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.feeType}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.modeOfPayment}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.chequeNumber}</td>
                          {!isAccountant && (isManager || ((isExecutive || isDirector) && isRecentlyAdded(receipt.dateOfPayment))) && (
                            <td className="border-2 text-sm border-gray-800 px-4 py-2">
                              <button onClick={() => openEditModal(receipt)} style={{ color: "#2D5990" }}>
                                <i className="fas fa-edit"></i> Edit
                              </button>
                            </td>
                          )}
                          {!isAccountant && (((isExecutive || isDirector) && !isRecentlyAdded(receipt.dateOfPayment))) && (
                            <td className="border-2 text-sm border-gray-800 px-4 py-2">
                              <p></p>
                            </td>
                          )}
                            <td className="border-2 border-gray-800 px-4 py-2">
                                <button style={{backgroundColor: '#2D5990'}} onClick={() => handleDownload(receipt)} className="btn btn-blue text-white">
                                    Download
                                </button>
                          </td>


                        </tr>
                    ))}
                    </tbody>
            </table>
            <div>
                {renderPageNumbers}
            </div>
        </div>
        {isEditModalOpen && (
    <div className="edit-modal">
        <h3 className="text-lg font-semibold mb-4">Edit Receipt</h3>
        <p><strong>Student Name:</strong> {editingReceipt.studentName}</p>
        <p><strong>Receipt Number:</strong> {editingReceipt.receiptNumber}</p>
        <p><strong>Type of Payment:</strong> {editingReceipt.typeOfPayment}</p>
        <label className="form-control">
          <span className="label-text">Mode of Payment</span>
          <select name="modeOfPayment" value={editingReceipt.modeOfPayment} onChange={handleEditChange}>
            <option value="">Select Mode of Payment</option>
            <option value="BANK TRANSFER/UPI">Bank Transfer/UPI</option>
            <option value="CARD">Card</option>
            <option value="CASH">Cash</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </label>
        {editingReceipt.modeOfPayment === 'CHEQUE' && (
          <label className="form-control">
            <span className="label-text">Cheque Number</span>
            <input type="text" name="chequeNumber" value={editingReceipt.chequeNumber || ''} onChange={handleEditChange} required />
          </label>
        )}
        <label className="form-control">
            <div className='label-text'>Current Amount Paid:{editingReceipt.amountPaid}</div>
            <div className='label-text'>Current Fee Type:{editingReceipt.feeType}</div>
            <span className="label-text">Enter Updated Amount Paid</span>    
            <input
              type="text"
              name="updatedAmount"
              value={editingReceipt.updatedAmount}
              onChange={(e) => {
                const updatedAmount = e.target.value;
                const maxAmount = editingReceipt[getPendingAmountFeeType(editingReceipt.amountFeeType)] + editingReceipt.amountPaid;
                if (updatedAmount > maxAmount) {
                  alert("Value cannot be greater than the Pending fee: " + maxAmount);
                } else {
                  handleEditChange(e);
                }
              }}
            />
            <h1 className='text-green-500 text-lg '>You have entered: {formatNumberIndia(editingReceipt.updatedAmount)}</h1>
            <p>Max Amount: {editingReceipt[getPendingAmountFeeType(editingReceipt.amountFeeType)] + editingReceipt.amountPaid}</p>
        </label>
        <button className="btn btn-outline  text-white" style={{ backgroundColor: '#2D5990' }} onClick={handleEditSubmit}>Save Changes</button>
        <button className="btn btn-outline  text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
    </div>
)}
{isConfirmModalOpen && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div className="mt-3 text-center">
        <h3 className="text-lg leading-6 font-medium text-black-900">Confirm Changes</h3>
        <div className="mt-2">
          {Object.keys(changesToConfirm).length > 0 ? (
            <>
              <p className="text-sm text-black-500">Are you sure you want to save these changes?</p>
              <ul className="text-sm text-black-500 list-disc list-inside">
                {Object.entries(changesToConfirm).map(([key, value]) => (
                  <li key={key}>{`${key}: ${value}`}</li>
                ))}
              </ul>
              <div className="items-center gap-4 mt-4">
                <button className="btn btn-outline text-white text-xs" style={{ backgroundColor: '#2D5990' }}
                    onClick={() => {
                      handleConfirmationAccept(editingReceipt);
                    }}>
                  Confirm
                </button>
                <button className="btn btn-outline text-white text-xs" style={{ backgroundColor: '#2D5990' }}
                  onClick={handleConfirmationCancel}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-black-500">No changes made.</p>
              <div className="items-center gap-4 mt-4">
                <button className="btn btn-outline text-white text-xs" style={{ backgroundColor: '#2D5990' }}
                  onClick={handleConfirmationCancel}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)}
      
      </div>
    );
  }
  
  export default ListReceipts;
  