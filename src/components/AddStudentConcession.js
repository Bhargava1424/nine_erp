import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import Navbar from './Navbar';

function AddStudentConcession() {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amountPaid, setAmountPaid] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');
    const [ConcessionNumber, setConcessionNumber] = useState(''); // Add Concession number to the state
    const [selectedFeeType, setSelectedFeeType] = useState(null);



    const handleAddConcessionClick = (feeTypeKey) => {
        setSelectedFeeType(feeTypeKey); // Set the selected fee type
    };


    const handleAmountChange = (e) => {
        setAmountPaid(e.target.value);
    };

    const handleModeOfPaymentChange = (e) => {
        setModeOfPayment(e.target.value);
        if (e.target.value !== 'CHEQUE') {
            setChequeNumber('');
        }
    };

    const handleChequeNumberChange = (e) => {
        setChequeNumber(e.target.value);
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
        if (!amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            // Assuming the backend expects an object with the payment details
            const paymentDetails = {
                amountPaid: parseFloat(amountPaid),
                modeOfPayment: modeOfPayment,
                chequeNumber: modeOfPayment === 'CHEQUE' ? chequeNumber : undefined,
            };

            const updatedFees = {
                paidFirstYearTuitionFee: studentData.paidFirstYearTuitionFee + paymentDetails.amountPaid,
                pendingFirstYearTuitionFee: studentData.pendingFirstYearTuitionFee - paymentDetails.amountPaid,
            };

            // Replace with the correct URL and adjust according to your API and data structure
            // const response = await axios.post(`http://localhost:5000/api/students/update-fees/${studentData._id}`, updatedFees);
            var SchoolManagementSystemApi = require('school_management_system_api');
            var api = new SchoolManagementSystemApi.ConcessionsApi();
            var body = new SchoolManagementSystemApi.ConcessionCreateRequest();
            
            body.applicationNumber = applicationNumber;
            body.feeTypeKey = feeTypeKey;
            body.amount = paymentDetails.amountPaid;
            body.modeOfPayment = paymentDetails.modeOfPayment;
            body.chequeNumber = paymentDetails.chequeNumber;

            console.log(body);
            
                    api.ConcessionPost(body, function(error, response) {
                        if (error) {
                            console.error('API Error:', error);
                        } else {
                            // console.log('API Response:', response); // Log the full HTTP response
                            try {
                                var responseBody = JSON.parse(response.text); // Parsing the response text to JSON
                                if (responseBody && responseBody.message) {
                                    console.log('Message:', responseBody.message); // Logging the message from the response
                                    setStudentData(prevState => ({
                                        ...prevState,
                                        ...updatedFees,
                                    }));
                                    setConcessionNumber(responseBody.data.ConcessionNumber); // Set the Concession number
                                    setAmountPaid(''); // Reset the amount
                                    setModeOfPayment(''); // Reset the mode of payment
                                    setChequeNumber(''); // Reset the cheque number
                                }
                            } catch (parseError) {
                                console.error('Error parsing response:', parseError);
                            }
                        }
                        if (response.status === 200) {
                            // Include the amountPaid in the URL
                            const ConcessionUrl = `/DownloadConcession?amountPaid=${amountPaid}&ConcessionNumber=${ConcessionNumber}`;
                            window.open(ConcessionUrl, '_blank');

                        }
                    });
                } catch (err) {
                    console.error('Error:', err);
                }
            };

    if (loading) {
        return <div>Loading...</div>;
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

    

    return (
        <div className="main-container">
            <Navbar />
            
            {feeTypes.map((fee, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold text-black mb-4'>{fee.label}:</h2>
                    <table className="table border border-black">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-lg border border-black text-black">Applied Fee</th>
                                <th className="px-4 py-2 text-lg border border-black text-black">Paid Fee</th>
                                <th className="px-4 py-2 text-lg border border-black text-black">Pending Fee</th>
                                <th className="px-4 py-2 text-lg border border-black text-black">Add Concession</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-[#00A0E3]">
                                <td className="text-lg text-black font-bold border border-black">{fee.fee}</td>
                                <td className="text-lg text-black font-bold border border-black">{fee.paidFee}</td>
                                <td className="text-lg text-black font-bold border border-black">{fee.pendingFee}</td>
                                <td className="text-lg text-black font-bold border border-black">
                                    <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => handleAddConcessionClick(fee.key)}>
                                        Add Concession
                                    </button>
                                    {selectedFeeType === fee.key && (
                                    <div>
                                        <h2>{studentData.firstName}'s 1st Year Tuition Fee:</h2>
                                        <label>
                                            Amount Paid:
                                            <input type="number" value={amountPaid} onChange={handleAmountChange} />
                                        </label>
                                        <div>
                                            <p>Mode of Payment:</p>
                                            <label>
                                                <input type="radio" value="BANK TRANSFER/UPI" checked={modeOfPayment === 'BANK TRANSFER/UPI'} onChange={handleModeOfPaymentChange} />
                                                Bank Transfer/UPI
                                            </label><p></p>
                                            <label>
                                                <input type="radio" value="CARD" checked={modeOfPayment === 'CARD'} onChange={handleModeOfPaymentChange} />
                                                Card
                                            </label><p></p>
                                            <label>
                                                <input type="radio" value="CASH" checked={modeOfPayment === 'CASH'} onChange={handleModeOfPaymentChange} />
                                                Cash
                                            </label><p></p>
                                            <label>
                                                <input type="radio" value="CHEQUE" checked={modeOfPayment === 'CHEQUE'} onChange={handleModeOfPaymentChange} />
                                                Cheque
                                            </label><p></p>
                                            {modeOfPayment === 'CHEQUE' && (
                                                <input type="text" placeholder="Enter cheque number" value={chequeNumber} onChange={handleChequeNumberChange} maxLength={6} />
                                            )}
                                            <button onClick={() => handleSubmit(fee.feeTypeKey)} className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
                                                Submit Payment
                                            </button>                    

                                            
                                        </div>
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
