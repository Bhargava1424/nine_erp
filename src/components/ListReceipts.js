import Navbar from './Navbar'; // Adjust the import path if necessary
import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



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
    const [sortConfig, setSortConfig] = useState({ key: 'dateOfPayment', direction: 'descending' });

    const user = JSON.parse(localStorage.getItem('user'));
    
    const isAccountant = ['Accountant'].includes(user.role);
    const isExecutive = ['Executive'].includes(user.role);
    const isManager = ['Manager'].includes(user.role);

    const fetchReceipts = async () => {
      try {
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.DbApi();
        let query = {};
        
        console.log(user.role);
        if (user.role === 'Accountant' || user.role === 'Executive') {
          query = {
            'dateOfPayment': {'$gte': fourDaysAgo},
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

    const sortedAndFilteredReceipts = useMemo(() => {
      const filteredReceipts = receipts.filter(receipt => {
          if (!searchTerm) return true; // If no search term, don't filter
          return Object.values(receipt).some(value =>
              String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
      });

      return filteredReceipts.sort((a, b) => {
          if (sortConfig === null) return 0;
          if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
      });
  }, [receipts, searchTerm, sortConfig]);

  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1); // Reset to first page
  };


    const openEditModal = (receipt) => {
      setEditingReceipt({ ...receipt });
      setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'modeOfPayment' && value !== 'Cheque') {
        // If mode of payment is changed from 'Cheque' to something else, set chequeNumber to null
        setEditingReceipt({ ...editingReceipt, [name]: value, chequeNumber: null });
    } else {
        setEditingReceipt({ ...editingReceipt, [name]: value });
    }
};



const handleEditSubmit = () => {

  const updatedReceipt = {
    ...editingReceipt,
    chequeNumber: editingReceipt.modeOfPayment !== 'Cheque' ? null : editingReceipt.chequeNumber,
};

if (updatedReceipt.modeOfPayment === 'Cheque' && !updatedReceipt.chequeNumber) {
    alert("Please enter the Cheque Number.");
    return;
}

// Assuming amountPaid is always related to tuition fees
const amountDifference = parseFloat(updatedReceipt.amountPaid) - parseFloat(editingReceipt[PaidfeeType]);

let totalPaidField, pendingField, studentFeePaid, studentFeePending;

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

// Update the dynamic field and calculate new totals and pendings
const updateData = {
    modeOfPayment: editingReceipt.modeOfPayment,
    chequeNumber: editingReceipt.chequeNumber,
    [PaidfeeType]: parseInt(updatedReceipt.amountPaid),
    [totalPaidField]: (parseFloat(editingReceipt[totalPaidField]) || 0) + amountDifference,
    [pendingField]: Math.max(0, (parseFloat(editingReceipt[pendingField]) || 0) - amountDifference),
};

const updateStudentData = {
    [studentFeePaid]: (parseFloat(editingReceipt[totalPaidField]) || 0) + amountDifference,
    [studentFeePending]: Math.max(0, (parseFloat(editingReceipt[pendingField]) || 0) - amountDifference),
};

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
};






  
    const filteredReceipts = handleSearch(searchTerm);

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


      amountPaid = determineAmountPaid(receipt);
      // Redirect to DownloadReceipt component or specific URL
      // For example, using window.location:

      amountPaid = determineAmountPaid(receipt);
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
      'Batch': receipt.batch,
      'Amount Paid': determineAmountPaid(receipt),
      'Fee Type': determineFeeType(receipt),
      'Mode of Payment': receipt.modeOfPayment,
      'Cheque Number': receipt.chequeNumber || 'N/A', // Assuming chequeNumber might be null or not applicable
      // Add other fields if necessary
    }));
  };
  

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes} ${day}-${month}-${year}`;
  };
  


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
 
const sortedReceipts = useMemo(() => {
  let sortableItems = [...receipts];
  if (sortConfig !== null) {
    sortableItems.sort((a, b) => {
      if (a[sortConfig.key] === b[sortConfig.key]) {
        return 0;
      }
      const order = (sortConfig.direction === 'ascending') ? 1 : -1;
      // For date comparison, convert strings to date objects
      let comparison = 0;
      if (sortConfig.key === 'dateOfPayment') {
        comparison = new Date(a[sortConfig.key]) < new Date(b[sortConfig.key]) ? -1 : 1;
      } else {
        comparison = a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
      }
      return comparison * order;
    });
  }
  return sortableItems;
}, [receipts, sortConfig]);

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
  const receiptDate = new Date(dateOfPayment);
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000)); // Calculate one hour ago from current time

  return receiptDate > oneHourAgo;
};

  
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
                {!isAccountant && <th>Action</th>}
                <th className="px-4 py-2 text-white border-r-2 border-gray-800">Download</th>
              </tr>
            </thead>



                <tbody>
                {sortedAndFilteredReceipts.slice(indexOfFirstReceipt, indexOfLastReceipt).map((receipt, index) => (
                        <tr className="odd:bg-[#FFFFFF] even:bg-[#F2F2F2] " key={index}>                          
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.receiptNumber}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{formatDate(receipt.dateOfPayment)}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.studentName}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.batch}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{determineAmountPaid(receipt)}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{determineFeeType(receipt)}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.modeOfPayment}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">{receipt.chequeNumber}</td>
                          <td className="border-2 text-sm border-gray-800 px-4 py-2">
                            {!isAccountant && (
                              (isManager || (isExecutive && isRecentlyAdded(receipt.dateOfPayment))) ? (
                                <button onClick={() => openEditModal(receipt)} style={{ color: "#2D5990" }}>
                                  <i className="fas fa-edit"></i> Edit
                                </button>
                              ) : <p></p> // Empty paragraph for maintaining cell layout
                            )}
                          </td>
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
        {editingReceipt.modeOfPayment === 'Cheque' && (
            <label className="form-control">
                <span className="label-text">Cheque Number</span>
                <input type="text" name="chequeNumber" value={editingReceipt.chequeNumber || ''} onChange={handleEditChange} required />
            </label>
        )}
        <label className="form-control">
            <div className='label-text'>Current Amount Paid:{determineAmountPaid(editingReceipt)}</div>
            <div className='label-text'>Current Fee Type:{determineFeeType(editingReceipt)}</div>
            <span className="label-text">Enter Updated Amount Paid</span>
            <input type="text" name="amountPaid" value={editingReceipt.amountPaid} onChange={handleEditChange} />
        </label>
        <button className="btn btn-outline  text-white" style={{ backgroundColor: '#2D5990' }} onClick={handleEditSubmit}>Save Changes</button>
        <button className="btn btn-outline  text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
    </div>
)}
      
      </div>
    );
  }
  
  export default ListReceipts;
  