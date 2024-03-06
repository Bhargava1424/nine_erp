
  import React, { useState, useEffect } from 'react';
  import Navbar from './Navbar';
import * as XLSX from 'xlsx';

  const Analytics = () => {
  
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [selectedModeOfPayment, setSelectedModeOfPayment] = useState(null);
    const [receipts, setReceipts] = useState([]); 

    const feeTypes = {
      '1st Year Tuition Fee': 'firstYearTuitionFeePayable',
      '1st Year Hostel Fee': 'firstYearHostelFeePayable',
      '2nd Year Tuition Fee': 'secondYearTuitionFeePayable',
      '2nd Year Hostel Fee': 'secondYearHostelFeePayable'
    };

    const modeOfPayments = {
      'CASH': 'CASH',
      'Credit Card': 'CARD',
      'Bank Transfer': 'BANK TRANSFER/UPI',
      'Cheque': 'CHEQUE'
    };

    const handleModeOfPaymentChange = (event) => {
      const modeOfPaymentLabel = event.target.value;
      setSelectedModeOfPayment(modeOfPayments[modeOfPaymentLabel]);
    };

    const handleFeeTypeChange = (e) => {
      const selectedValue = e.target.value;
      // Assuming you want to map the readable value to a key in your `feeTypes` object
      const feeTypeKey = Object.keys(feeTypes).find(key => feeTypes[key] === selectedValue);
      setSelectedFeeType(feeTypeKey); // Or directly use the value if that's what you need
    };
    
  

      const handleBranchChange = (event) => {
      setSelectedBranch(event.target.value);
      
      };


      const fetchBranches = async () => {
          try {
            var SchoolManagementSystemApi = require('school_management_system_api');
            var api = new SchoolManagementSystemApi.DbApi();
            const opts = {
              body: {
                collectionName: 'branches',
                query: {},
                type: 'findMany',
              },
            };
      
            console.log(opts.body);
      
            api.dbGet(opts, function (error, data, response) {
              if (error) {
                console.error('API Error:', error);
              } else {
                try {
                  const responseBody = response.body; // Assuming response.body is already in JSON format
                  console.log(responseBody);
                  setBranches(responseBody); // Assuming the actual data is in responseBody.data 
                } catch (parseError) {
                  console.error('Error parsing response:', parseError);
                }
              }
            });
          } catch (error) {
            console.error('Error:', error);
          }
        };
      
        useEffect(() => {
          fetchBranches();
        }, []);

        function SelectField({ label, name, options, value, handleChange }) {
          return (
            <div>
              <label htmlFor={name} className="form-label">{label}</label>
              <select
                required
                name={name}
                id={name}
                value={value}
                onChange={handleChange}
                className="select select-bordered w-full max-w-xs"
              >
                <option value="">Select {label}</option>
                {options.map((option, index) => (
                  // Use a combination of option value and index if necessary to ensure uniqueness
                  <option key={option.value + index} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          );
        }
        

        const generateBatches = () => {
          const startYear = 2022;
          const endYear = 2098;
          const batches = [];
          
          for (let year = startYear; year <= endYear; year += 1) {
            batches.push(`${year}-${year + 2}`);
          }
          
          return batches;
        };
        
        const batchOptions = generateBatches();

        const handleFetchClick = () => {
          if(!selectedBranch || (selectedBranch ==='ANY') )
          {
            setSelectedBranch(null);
          }
          else if(!selectedBatch || (selectedBatch ==='ANY') )
          {
            setSelectedBatch(null);
          }
          else if(!selectedModeOfPayment || (selectedModeOfPayment ==='ANY') )
          {
            setSelectedModeOfPayment(null);
          }
          else {
            fetchReceipts();
          }
          fetchReceipts();
        };


        const fetchReceipts = async () => {
          try {
            const SchoolManagementSystemApi = require('school_management_system_api');
            const api = new SchoolManagementSystemApi.DbApi();
            
            let query = {};

            if (selectedBranch !== null) {
              query.branch = selectedBranch;
            }

            if (selectedBatch !== null) {
              query.batch = selectedBatch;
            }

            if (selectedModeOfPayment !== null) {
              query.modeOfPayment = selectedModeOfPayment;
            }

            console.log(query);
            const opts = {
              body: {
                collectionName: 'receipts',
                query: query,
                type: 'findMany',
              },
            };
        
            console.log(opts.body);
        
            api.dbGet(opts, function(error, data, response) {
              if (error) {
                console.error('API Error:', error);
              } else {
                try {
                  const responseBody = response.body; // Assuming response.body is already in JSON format
                  console.log(responseBody);
                  setReceipts  (responseBody); // Assuming the actual data is in responseBody.data
                } catch (parseError) {
                  console.error('Error parsing response:', parseError);
                }
              }
            });
            
            
            
            
          } catch (error) {
            console.error('Error during fetch:', error);
          }
        };
        
        // Make sure to call fetchReceipts appropriately, for example, in an useEffect hook
        useEffect(() => {
          // Ensure all selections are made before attempting to fetch receipts
          if (selectedBranch && selectedBatch && selectedModeOfPayment) {
            fetchReceipts();
          }
        }, [selectedBranch, selectedBatch, selectedModeOfPayment]);

        //All Sum Logic

        const calculateSum = (receipts, field) => {
          const sum = receipts.reduce((sum, receipt) => sum + (receipt[field] || 0), 0);
          return new Intl.NumberFormat('en-IN').format(sum);
        };
        
        // Use the above generic function to calculate each of the sums you need
        const sumOfFirstYearHostelFeePayable = calculateSum(receipts, 'firstYearHostelFeePayable');
        const sumOfFirstYearTotalHostelFeePaid = calculateSum(receipts, 'firstYearTotalHostelFeePaid');
        const sumOfFirstYearTotalHostelFeePending = calculateSum(receipts, 'firstYearTotalHostelFeePending');
        const sumOfFirstYearTuitionFeePayable = calculateSum(receipts, 'firstYearTuitionFeePayable');
        const sumOfFirstYearTotalTuitionFeePaid = calculateSum(receipts, 'firstYearTotalTuitionFeePaid');
        const sumOfFirstYearTotalTuitionFeePending = calculateSum(receipts, 'firstYearTotalTuitionFeePending');
        const sumOfSecondYearHostelFeePayable = calculateSum(receipts, 'secondYearHostelFeePayable');
        const sumOfSecondYearTotalHostelFeePaid = calculateSum(receipts, 'secondYearTotalHostelFeePaid');
        const sumOfSecondYearTotalHostelFeePending = calculateSum(receipts, 'secondYearTotalHostelFeePending');
        const sumOfSecondYearTuitionFeePayable = calculateSum(receipts, 'secondYearTuitionFeePayable');
        const sumOfSecondYearTotalTuitionFeePaid = calculateSum(receipts, 'secondYearTotalTuitionFeePaid');
        const sumOfSecondYearTotalTuitionFeePending = calculateSum(receipts, 'secondYearTotalTuitionFeePending');
        

        const exportSumsToExcel = () => {
          // Prepare data in the desired format
          const dataForExcel = [
            {
              Category: "Category",
              Paid: "Paid",
              Pending: "Pending",
              Total: "Total",
            },
            {
              Category: "1st Year Tuition",
              Paid: sumOfFirstYearTotalTuitionFeePaid,
              Pending: sumOfFirstYearTotalTuitionFeePending,
              Total: sumOfFirstYearTuitionFeePayable,
            },
            {
              Category: "1st Year Hostel",
              Paid: sumOfFirstYearTotalHostelFeePaid,
              Pending: sumOfFirstYearTotalHostelFeePending,
              Total: sumOfFirstYearHostelFeePayable,
            },
            {
              Category: "2nd Year Tuition",
              Paid: sumOfSecondYearTotalTuitionFeePaid,
              Pending: sumOfSecondYearTotalTuitionFeePending,
              Total: sumOfSecondYearTuitionFeePayable,
            },
            {
              Category: "2nd Year Hostel",
              Paid: sumOfSecondYearTotalHostelFeePaid,
              Pending: sumOfSecondYearTotalHostelFeePending,
              Total: sumOfSecondYearHostelFeePayable,
            },
          ];

          // Convert data to worksheet
          const ws = XLSX.utils.json_to_sheet(dataForExcel, { header: ["Category", "Paid", "Pending", "Total"], skipHeader: true });
          ws['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]; // Optional: Adjust column widths
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, "Fee Summary");
          XLSX.writeFile(wb, "FeeSummary.xlsx");
        };
        



      return (
          <div className="min-h-screen bg-gray-100">
              <Navbar />
              <div className="flex flex-col items-center justify-center space-y-4 mt-10">
                <div className="w-full max-w-xs text-black">
                  <label htmlFor="branch" className="form-label">Branch</label>
                  <select
                    required
                    name="branch"
                    id="branch"
                    value={selectedBranch}
                    onChange={(event) => {
                      handleBranchChange(event); // Passes the event to handleBranchChange
                    }}
                
                    className="select select-bordered w-full max-w-xs"
                  >
                    <option value="">Select Branch</option>
                    <option value="ANY">ANY</option>
                    {branches.map((branch, index) => (
                      <option key={index} value={branch.branchCode}>
                        {`${branch.branchName} (${branch.branchCode})`}
                      </option>
                    ))}
                  </select>
                </div>

                  <div className="w-full max-w-xs">
                    
                  <label htmlFor="branch" className="form-label">Batch</label>
                      <select
                          value={selectedBatch} // Controlled by React state
                          onChange={(e) => {
                            setSelectedBatch(e.target.value)
                          }}
                          className="select select-bordered w-full hover:border-blue-500 focus:outline-none focus:ring transition duration-300 ease-in-out"
                      >
                          
                          <option value="" disabled>Select Batch</option>
                          <option value="ANY">ANY</option>
                          {batchOptions.map((batch, index) => (
                          <option key={index} value={batch}>
                              {batch}
                          </option>
                          ))}
                      </select>
                  </div>
                  <div className="w-full max-w-xs">
                    
                  <label htmlFor="branch" className="form-label">Mode of Payment</label>
                    <select 
                      className="select select-bordered w-full hover:border-blue-500 focus:outline-none focus:ring transition duration-300 ease-in-out"
                      onChange={(e) => {
                        setSelectedModeOfPayment(e.target.value)
                      }} // Pass the event to the function
                    >
                      <option value="" disabled>MODE OF PAYMENT</option>
                      <option value="ANY">ANY</option>
                      <option value="BANK TRANSFER/UPI">BANK TRANSFER/UPI</option>
                      <option value="CASH">CASH</option>
                      <option value="CARD">CARD</option>
                      <option value="CHEQUE">CHEQUE</option>
                    </select>
                  </div>

                <button
                  onClick={handleFetchClick}
                  className="btn  mt-4"
                  style={{backgroundColor: '#00A0E3', color:'#FFFFFF'}}
                >
                  Fetch Report
                </button>
              </div>
              {/* Display selected values */}
          <div className="w-full max-w-xs bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Selected Criteria:</h3>
            <p>Selected Branch: <strong>{selectedBranch }</strong></p>
            <p>Selected Batch: <strong>{selectedBatch || "None"}</strong></p> 
            <p>Selected Mode of Payment: <strong>{ selectedModeOfPayment|| "None"}</strong></p>
          </div>
             {/* Display fetched receipts */}
          <div className="w-full max-w-4xl mt-5">
            <p>==================================</p>
            <div className="w-full max-w-4xl mt-5">
            {
              receipts.length > 0 ? (
                receipts.map((receipt) => (
                  <div key={receipt.receiptNumber}> {/* Use receiptNumber as key */}
                    <p>Name: {receipt.studentName} Receipt ID: {receipt.receiptNumber}</p>
                  </div>
                ))
              ) : (
                <p>No receipts found.</p>
              )
            }
          </div>
          <p>==================================</p>
            <div>
              
            </div>

          </div>  

          <div className="card bg-slate-600 text-black px-8 py-2 mx-6  text-center"> {/* Increased padding */}
            <h2 className="text-2xl font-bold text-white text-center">REPORTS</h2>
          </div>

          <div className='flex justify-center mt-4'>
            <button onClick={exportSumsToExcel} style={{backgroundColor: '#00A0E3', color:'#FFFFFF'}} className="btn">
            Export to Excel
          </button>
          </div>
          
          <div className="grid grid-rows-4 grid-cols-3 gap-4 p-6 m-4">
            {/* <!-- Row 1 --> */}
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL TUITION FEE (1ST YEAR) APPLIED:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfFirstYearTuitionFeePayable.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL TUITION FEE (1ST YEAR) PAID:</div>
              <p className="text-white text-lg text-lg font-bold">Sum: {sumOfFirstYearTotalTuitionFeePaid.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL TUITION FEE (1ST YEAR) PENDING:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfFirstYearTotalTuitionFeePending.toLocaleString()}</p>
            </div>
            
            {/* <!-- Row 2 --> */}
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL HOSTEL FEE (1ST YEAR) APPLIED:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfFirstYearHostelFeePayable.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL HOSTEL FEE (1ST YEAR) PAID:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfFirstYearTotalHostelFeePaid.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL HOSTEL FEE (1ST YEAR) PENDING:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfFirstYearTotalHostelFeePending.toLocaleString()}</p>
            </div>
            
            {/* <!-- Row 3 --> */}
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL TUITION FEE (2ND YEAR) APPLIED:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfSecondYearTuitionFeePayable.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL TUITION FEE (2ND YEAR) PAID:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfSecondYearTotalTuitionFeePaid.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL TUITION FEE (2ND YEAR) PENDING:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfSecondYearTotalTuitionFeePending.toLocaleString()}</p>
            </div>
            
            {/* <!-- Row 4 --> */}
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL HOSTEL FEE (2ND YEAR) APPLIED:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfSecondYearHostelFeePayable.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">
              <div className="text-lg font-medium text-white mb-2">TOTAL HOSTEL FEE (2ND YEAR) PAID:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfSecondYearTotalHostelFeePaid.toLocaleString()}</p>
            </div>
            <div style={{backgroundColor: '#2D5990', color:'#FFFFFF'}} className="text-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-4 max-w-sm mx-auto">              <div className="text-lg font-medium text-white mb-2">TOTAL HOSTEL FEE (2ND YEAR) PENDING:</div>
              <p className="text-white text-lg font-bold">Sum: {sumOfSecondYearTotalHostelFeePending.toLocaleString()}</p>
            </div>
          </div>

          <div className="card bg-slate-600 text-black px-8 py-2 mx-6  text-center"> {/* Increased padding */}
            <h2 className="text-2xl font-bold text-white text-center">ANALYTICS</h2>
          </div>

          <div className="grid">

          </div>



        </div>
      );
      
  };

  export default Analytics;
