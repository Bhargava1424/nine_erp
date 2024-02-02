import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import Navbar from './Navbar';

function AddStudentConcession() {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amountWaived, setAmountWaived] = useState('');
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [reason, setReason] = useState(''); 




    const handleAddConcessionClick = (feeTypeKey) => {
        setSelectedFeeType(feeTypeKey); 
    };


    const handleAmountChange = (e, fee) => {
        const amount = parseFloat(e.target.value);
        if (amount > fee.pendingFee) {
            alert(`The amount cannot be greater than the pending fee of ${fee.pendingFee}`);
            setAmountWaived(''); // Reset the amount field
        } else {
            setAmountWaived(amount);
        }

    };


    


    // Function to get the application number from the URL
    function getApplicationNumber() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('applicationNumber');
    }

    // Using the function to get the application number
    const applicationNumber = getApplicationNumber();

    // Now you can use applicationNumber in your script
    console.log(applicationNumber); // For testing purposes


    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                var SchoolManagementSystemApi = require('school_management_system_api');
                var api = new SchoolManagementSystemApi.DbApi();
                const opts = {
                    body: {
                        "collectionName": "students",
                        "query": {
                            'applicationNumber': applicationNumber
                        },
                        "type": 'findOne'
                    }
                };
                
                api.dbGet(opts, function(error, data, response) {
                    if (error) {
                        console.error('API Error', error);
                        setError(error.message);
                        setLoading(false);
                    } else {
                        try {
                            const responseBody = response.body; // Assuming response.body needs to be parsed
                            console.log(responseBody);
                            setStudentData(responseBody); // Adjust according to the structure of responseBody
                        } catch (parseError) {
                            console.error('Error parsing response:', parseError);
                            setError(parseError.message);
                        }
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (applicationNumber) {
            fetchStudentData();
        }
    }, [applicationNumber]);


    const handleSubmit = async (feeTypeKey) => {
        if (!amountWaived || isNaN(amountWaived) || amountWaived <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (!reason) {
            alert("Please provide a reason for the concession.");
            return;
        }

    
        try {
            var SchoolManagementSystemApi = require('school_management_system_api');
            var api = new SchoolManagementSystemApi.DbApi();
            let update={}
            if(selectedFeeType === 'firstYearTuitionFee')
            {
                update={
                    'firstYearTuitionFee': studentData.firstYearTuitionFee - amountWaived,
                    'pendingFirstYearTuitionFee': studentData.pendingFirstYearTuitionFee - amountWaived
                }
            } else if(selectedFeeType === 'secondYearHostelFee') {
                update = {
                    'secondYearHostelFee': Math.max(0, studentData.secondYearHostelFee - amountWaived),
                    'pendingSecondYearHostelFee': Math.max(0, studentData.pendingSecondYearHostelFee - amountWaived)
                };
            } else if(selectedFeeType === 'secondYearTuitionFee') {
                update = {
                    'secondYearTuitionFee': Math.max(0, studentData.secondYearTuitionFee - amountWaived),
                    'pendingSecondYearTuitionFee': Math.max(0, studentData.pendingSecondYearTuitionFee - amountWaived)
                };
            } else if(selectedFeeType === 'firstYearHostelFee') {
                update = {
                    'firstYearHostelFee': Math.max(0, studentData.firstYearHostelFee - amountWaived),
                    'pendingFirstYearHostelFee': Math.max(0, studentData.pendingFirstYearHostelFee - amountWaived)
                };
            }
            const opts = {
                
              body: {
                "collectionName": "students",
                "query": {
                  'applicationNumber': studentData.applicationNumber
                },
                "type": 'updateOne',
                "update": update
              }
            };
        
            api.dbUpdate(opts, function(error, data, response) {
              if (error) {
                console.error('API Error:', error);
              } else {
                try {
                  const responseBody = response.body; // Assuming response.body is already in JSON format
                  console.log(responseBody);
                  // Reload the page
                //   window.location.reload();
                } catch (parseError) {
                  console.error('Error parsing response:', parseError);
                }
              }
            });

            const authorizationApi = new SchoolManagementSystemApi.AuthorizationApi();
            let body = {
                "subject": "Concession Added",
                "message": "Concession :" + amountWaived + "\n" + 
                    "Name :" + studentData.firstName + " " + studentData.surName + "\n"  +
                    "Fee Type :" + selectedFeeType + "\n" +
                    "for the following reason :" + reason + "\n",
            };
            authorizationApi.sendMail(body, function(error, response) {
                if (error) {
                    console.error('API Error:', error);
                } else {
                    try {
                        const responseBody = response.body; // Assuming response.body is already in JSON format
                        console.log(responseBody);
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
            <span className="loading loading-bars loading-lg"></span>
            </div>
            )
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!studentData) {
        return <div>Student not found</div>;
    }

    const feeTypes = [
        { label: '1st Year Tuition Fee', key: 'firstYearTuitionFee', fee: studentData.firstYearTuitionFee , pendingFee: studentData.pendingFirstYearTuitionFee , paidFee: studentData.paidFirstYearTuitionFee},
        { label: '1st Year Hostel Fee', key: 'firstYearHostelFee', fee: studentData.firstYearHostelFee , pendingFee: studentData.pendingFirstYearHostelFee , paidFee: studentData.paidFirstYearHostelFee },
        { label: '2nd Year Tuition Fee', key: 'secondYearTuitionFee', fee: studentData.secondYearTuitionFee , pendingFee: studentData.pendingSecondYearTuitionFee , paidFee: studentData.paidSecondYearTuitionFee },
        { label: '2nd Year Hostel Fee', key: 'secondYearHostelFee', fee: studentData.secondYearHostelFee , pendingFee: studentData.pendingSecondYearHostelFee , paidFee: studentData.paidSecondYearHostelFee }
    ];

    

    const handleReasonChange = (e) => { // Add this function
        setReason(e.target.value);
    };

    return (
        <div className="main-container">
            <Navbar />
            
            {feeTypes.map((fee, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold text-black mb-4'>{fee.label}:</h2>
                    <table className="table border border-black">
                        <thead>
                            <tr style={{backgroundColor: '#2D5990', color:'#FFFFFF'}}>
                                <th className="px-4 py-2 text-sm border border-black text-white">Applied Fee</th>
                                <th className="px-4 py-2 text-sm border border-black text-white">Paid Fee</th>
                                <th className="px-4 py-2 text-sm border border-black text-white">Pending Fee</th>
                                <th className="px-4 py-2 text-sm border border-black text-white">Add Concession</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-[#F2F2F2]">
                                <td className="text-sm text-black font-bold border border-black">{fee.fee}</td>
                                <td className="text-sm text-black font-bold border border-black">{fee.paidFee}</td>
                                <td className="text-sm text-black font-bold border border-black">{fee.pendingFee}</td>
                                <td className="text-sm text-black font-bold border border-black">
                                    <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => handleAddConcessionClick(fee.key)}>
                                        Add Concession
                                    </button>
                                    {selectedFeeType === fee.key && (
                                    <div>
                                        <h2>{studentData.firstName}'s 1st Year Tuition Fee:</h2>
                                        <label>
                                            Amount Waived:
                                            <input type="number" value={amountWaived} onChange={(e) => handleAmountChange(e, fee)} />
                                        </label>
                                        <label className="block mt-4">
                                            <span className="text-gray-700">Reason:</span>
                                            <textarea
                                                className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                rows="3"
                                                placeholder="Enter reason here"
                                                value={reason} // Add a state variable 'reason' to handle this
                                                onChange={handleReasonChange} // Implement handleReasonChange to update 'reason'
                                            ></textarea>
                                        </label>
                                        
                                        
                                        <button onClick={() => handleSubmit(fee.feeTypeKey)} className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
                                                Submit Concession 
                                            </button>  
                                        {/* Add submission button or form handlers as needed */}
                                    </div>
                                )} 
                                    {/* The form section should go here */}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
            {/* Repeat the above block for each fee type */}
        </div>
    );
}

export default AddStudentConcession;
