import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import Navbar from './Navbar';

function AddStudentReceipt() {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amountPaid, setAmountPaid] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');
    const [selectedFeeType, setSelectedFeeType] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);



    const handleAddReceiptClick = (feeType) => {
        setSelectedFeeType(feeType); // Set the selected fee type
    };


    
    const handleAmountChange = (e, fee) => {
        const value = e.target.value;
    
        // Allow only numeric input
        const regex = /^[0-9]*\.?[0-9]*$/; // Updated regex to allow decimal points
        if (value === '' || regex.test(value)) {
            const amount = parseFloat(value); // Convert to float for comparison
            // Check if the converted amount exceeds the pending fee, 
            // and ensure it's not NaN (which happens if the input is empty or incomplete)
            if (!isNaN(amount) && amount > fee.pendingFee) {
                alert(`The amount cannot be greater than the pending fee of ${fee.pendingFee}`);
                setAmountPaid(''); // Reset the amount field if invalid
            } else {
                setAmountPaid(value); // Keep as string for input field
            }
        }
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

        if (isSubmitted) {
            // Reset the form or fetch the latest data as required
            // Reset the submission status
            setIsSubmitted(false);
        }

        if (applicationNumber) {
            fetchStudentData();
        }
    }, [applicationNumber]);

    function getISTTime() {
        // Indian Standard Time is 5 hours 30 minutes ahead of UTC
        const offset = 5.5;
        let now = new Date(new Date().getTime() + offset * 3600 * 1000);
      
        // Format the date and time in the desired format: "HH-MM DD-MM-YYYY"
        let hours = String(now.getUTCHours()).padStart(2, '0');
        let minutes = String(now.getUTCMinutes()).padStart(2, '0');
        let date = String(now.getUTCDate()).padStart(2, '0');
        let month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        let year = now.getUTCFullYear();
      
        return `${hours}-${minutes} ${date}-${month}-${year}`;
      }

      console.log(getISTTime())


    const handleSubmit = async (feeType) => {
        if (!amountPaid || isNaN(amountPaid) || amountPaid <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        if (modeOfPayment === '') {
            alert("Please select a mode of payment.");
            return;
        }
        if (modeOfPayment === 'CHEQUE' && !chequeNumber) {
            alert("Please enter a cheque number.");
            return;
        }

        try {
            // Assuming the backend expects an object with the payment details
            const paymentDetails = {
                amountPaid: Number(parseFloat(amountPaid)),
                modeOfPayment: modeOfPayment,
                chequeNumber: modeOfPayment === 'CHEQUE' ? chequeNumber : undefined,
            };

            // const updatedFees = {
            //     paidFirstYearTuitionFee: studentData.paidFirstYearTuitionFee + paymentDetails.amountPaid,
            //     pendingFirstYearTuitionFee: studentData.pendingFirstYearTuitionFee - paymentDetails.amountPaid,
            // };

            // Replace with the correct URL and adjust according to your API and data structure
            // const response = await axios.post(`http://localhost:5000/api/students/update-fees/${studentData._id}`, updatedFees);
            var SchoolManagementSystemApi = require('school_management_system_api');
            var api = new SchoolManagementSystemApi.ReceiptsApi();
            var body = new SchoolManagementSystemApi.ReceiptCreateRequest();
            const now = new Date();
            body.applicationNumber = applicationNumber;
            body.feeType = feeType;
            body.amount = paymentDetails.amountPaid;
            body.modeOfPayment = paymentDetails.modeOfPayment;
            body.chequeNumber = paymentDetails.chequeNumber;
            body.dateOfPayment= getISTTime();    
            // body.dateOfPayment= `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

            console.log(body);
            
                    api.receiptsPost(body, function(error, response) {
                        if (error) {
                            console.error('API Error:', error);
                        } else {
                            // console.log('API Response:', response); // Log the full HTTP response
                            try {
                                console.log(response);
                                if (response && response.message) {
                                    console.log('Message:', response.message); // Logging the message from the response
                                    setStudentData(prevState => ({
                                        ...prevState,
                                        // ...updatedFees,
                                    }));
                                    setAmountPaid(''); // Reset the amount
                                    setModeOfPayment(''); // Reset the mode of payment
                                    setChequeNumber(''); // Reset the cheque number
                                    console.log(response.data[feeType + 'Paid']);
                                    console.log(paymentDetails.amountPaid);
                                    if (response.data[feeType + 'Paid'] === paymentDetails.amountPaid) {
                                        console.log('Receipt generated');
                                        feeType=getFeeDisplayName(feeType);
                                        // Include the amountPaid in the URL
                                        const receiptUrl = `/DownloadReceipt?amountPaid=${amountPaid}&receiptNumber=${response.data.receiptNumber}&feeType=${feeType}`;
                                        console.log(amountPaid)
                                        window.open(receiptUrl, '_blank');
                                    }
                                }
                                window.location.reload();
                            } catch (parseError) {
                                console.error('Error parsing response:', parseError);
                            }
                        }
                    });
                } catch (err) {
                    console.error('Error:', err);
                }

                setIsSubmitted(true);
            
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

    const user = JSON.parse(localStorage.getItem('user'));
    const getFeeDisplayName = (key) => {
        switch(key) {
            case 'firstYearTuitionFee':
                return 'First Year Tuition Fee';
            case 'firstYearHostelFee':
                return 'First Year Hostel Fee';
            case 'secondYearTuitionFee':
                return 'Second Year Tuition Fee';
            case 'secondYearHostelFee':
                return 'Second Year Hostel Fee';
            default:
                return 'Unknown Fee'; // Fallback for unknown keys
        }
    };

    function formatNumberIndia(num) {
        var x = num.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers !== '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res;
    } 


    return (
        <div className="main-container root-container">
            <Navbar />
            <h2 className="font-bold text-2xl mt-8 mb-4">{studentData.firstName} {studentData.surName}</h2>
            <div className="flex flex-col space-y-8">
            {feeTypes.map((fee, index) => (
    <div key={index} className="hover:bg-gray-400 p-4 transition duration-300 ease-in-out bg-gray-200">
        <h2 className='text-xl font-bold text-black mb-4 '>{fee.label}:</h2>
        <table className="table border border-black min-w-full divide-y divide-gray-300 shadow-lg">
            <thead className="bg-gray-200">
                <tr style={{backgroundColor: '#2D5990', color:'#FFFFFF'}}>
                {user.role === 'Manager' && (
                    <>
                    <th className="px-4 py-2 text-sm border border-black text-white">Applied Fee</th>
                    <th className="px-4 py-2 text-sm border border-black text-white">Paid Fee</th>
                    </>
                )}
                    <th className="px-4 py-2 text-sm border border-black text-white">Pending Fee</th>
                    {/* Conditionally render Add Receipt header based on fee type and condition */}
                    {!(fee.key.includes('secondYear') && (studentData.pendingFirstYearTuitionFee > 0 || studentData.pendingFirstYearHostelFee > 0)) && (
                        <th className="px-4 py-2 text-sm border border-black text-white">Add Receipt</th>
                    )}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
                <tr className="bg-[#F2F2F2]">
                    {user.role === 'Manager' && (
                        <>
                        <td className="text-sm text-black font-bold border border-black">{fee.fee}</td>
                        <td className="text-sm text-black font-bold border border-black">{fee.paidFee}</td>
                        </>
                    )}
                    <td className="text-sm text-black font-bold border border-black">{fee.pendingFee}</td>
                    {/* Conditionally render Add Receipt button based on fee type and condition */}
                    {!(fee.key.includes('secondYear') && (studentData.pendingFirstYearTuitionFee > 0 || studentData.pendingFirstYearHostelFee > 0)) && (
                        <td className="text-sm text-black font-bold border border-black">
                            <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => handleAddReceiptClick(fee.key)}>
                                Add Receipt
                            </button>
                            {selectedFeeType === fee.key && (
                                    <div>
                                         <h2>{studentData.firstName}'s {getFeeDisplayName(fee.key)}:</h2>
                                        <label>
                                            Amount Paid:
                                            <input
                                                className='ml-2'
                                                type="text"
                                                value={amountPaid}
                                                onChange={(e) => handleAmountChange(e, fee)}
                                                max={fee.pendingFee}
                                            />
                                            <h1 className='text-green-500 text-lg'>Verify Amount Entered:{formatNumberIndia(amountPaid)}</h1>
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
                                            <button onClick={() => handleSubmit(fee.key)} className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
                                                Submit Payment
                                            </button>                    

                                            
                                        </div>
                                        {/* Add submission button or form handlers as needed */}
                                    </div>
                                )} 
                        </td>
                    )}
                </tr>
            </tbody>
        </table>
    </div>
))}

            </div>
            
            {/* Repeat the above block for each fee type */}
        </div>
    );
}

export default AddStudentReceipt;
