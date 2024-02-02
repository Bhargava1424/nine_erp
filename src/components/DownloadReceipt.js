
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';



function DownloadReceipt() {

    const [amountPaid, setAmountPaid] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [feeType, setFeeType] = useState('');
    const [receiptsData, setReceiptsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const amount = queryParams.get('amountPaid');
        const receiptNumber = queryParams.get('receiptNumber');
        const feeType = queryParams.get('feeType');
    
        if (amount) setAmountPaid(amount);
        if (receiptNumber) setReceiptNumber(receiptNumber);
        if (feeType) setFeeType(feeType);
    }, [location]);

    console.log(feeType);

    useEffect(() => {

        const fetchReceiptData = async () => {
            // try {
            //     const response = await axios.get(`http://34.125.142.249:5000/api/students/name/${receiptNumber}`);
            //     setreceiptsData(response.data);
            //     setLoading(false);
            // } catch (err) {
            //     setError(err.message);
            //     setLoading(false);
            // }
            try {
                var SchoolManagementSystemApi = require('school_management_system_api');
                var api = new SchoolManagementSystemApi.DbApi();
                const opts = {
                body: {
                    "collectionName": "receipts",
                    "query": {
                        'receiptNumber': receiptNumber
                    },
                    "type": 'findOne'
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
                    setReceiptsData(responseBody); // Assuming the actual data is in responseBody.data
                    setLoading(false);
                    } catch (parseError) {
                    console.error('Error parsing response:', parseError);
                    setLoading(false);
                    }
                }
                });
            } catch (error) {
                console.error('Error during fetch:', error);
            }
            };

        if (receiptNumber) {
            fetchReceiptData();
        }
    }, [receiptNumber]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
            <span className="loading loading-bars loading-lg"></span>
            </div>
            )
    }

    if (!receiptsData) {
        return <div>Student not found</div>;
    }
    
    return (
        <div className="bg-white p-8" id="download-receipt-content">
            <div className="border-b-2 border-black mb-4">
                <h1 className="text-4xl font-bold text-center">NINE EDUCATION</h1>
                <h1 className="text-3xl font-bold text-center">Receipt</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                <div>
                    <p className="text-xs">Receipt No: <span className="font-bold">{receiptNumber}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-xs">Date: <span className="font-bold">{new Date().toISOString().split('T')[0]}</span></p> 
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">STUDENT DETAILS</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
            <div>
                <p className="text-xs">Student's Name : <span className="font-bold">{receiptsData.studentName} {receiptsData.surName}</span></p>
                <p className="text-xs">Parent's Name : <span className="font-bold">{receiptsData.parentName}</span></p>
                <p className="text-xs">Application Number : <span className="font-bold">{receiptsData.applicationNumber}</span></p>
                <p className="text-xs">Registered Mobile Number : <span className="font-bold">{receiptsData.registeredMobileNumber}</span></p>
            </div>

            </div>
            <h1 className="text-2xl font-bold text-center">REGISTRATION DETAIL</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-xs">Batch :{receiptsData.batch}</p>
                    <p className="text-xs">Stream :{receiptsData.stream}</p>
                    <p className="text-xs">Branch :{receiptsData.branch}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs">Date of Joining :  {receiptsData.dateOfJoining}</p>
                    <p className="text-xs">Gender : {receiptsData.gender}</p>
                    <p className="text-xs">Residence Type :  {receiptsData.residenceType}</p>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">DETAILS OF THE CURRENT TRANSACTION</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-xs">Tuition Fee Payable (1st Year): <span className="font-bold">{receiptsData.firstYearTuitionFeePayable}</span></p>
                    <p className="text-xs">Hostel Fee Payable (1st Year) : <span className="font-bold">{receiptsData.firstYearHostelFeePayable}</span></p>
                    <p className="text-xs">Tuition Fee Payable (2nd Year) : <span className="font-bold">{receiptsData.secondYearTuitionFeePayable}</span></p>
                    <p className="text-xs">Hostel Fee Payable (2nd Year) :  <span className="font-bold">{receiptsData.secondYearHostelFeePayable}</span></p>    
                </div>
                <div className="text-right">
                    <p className="text-xs">Amount Paid - {feeType}  :  <span className="font-bold">{amountPaid + '/-'}</span></p>
                    {/* <p className="text-xs">Hostel Fee Paid (1st Year) :    <span className="font-bold">{receiptsData.firstYearHostelFeePaid}</span></p>
                    <p className="text-xs">Tuition Fee Paid (2nd Year) :  <span className="font-bold">{receiptsData.secondYearTuitionFeePaid}</span></p>
                    <p className="text-xs">Hostel Fee Paid (2nd Year) :  <span className="font-bold">{receiptsData.secondYearHostelFeePaid}</span></p> */}
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">DETAILS OF ALL TRANSACTIONS</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-xs">Total Tuition Fee Paid (1st Year) : <span className="font-bold">{receiptsData.firstYearTotalTuitionFeePaid}</span></p>
                    <p className="text-xs">Total Hostel Fee Paid (1st Year) : <span className="font-bold">{receiptsData.firstYearTotalHostelFeePaid}</span></p> 
                    <p className="text-xs">Total Tuition Fee Paid (2nd Year) : <span className="font-bold">{receiptsData.secondYearTotalTuitionFeePaid}</span></p>
                    <p className="text-xs">Total Hostel Fee Paid (2nd Year) : <span className="font-bold">{receiptsData.secondYearTotalHostelFeePaid}</span></p>  
                </div>
                <div className="text-right">
                    <p className="text-xs">Total Tuition Fee Pending (1st Year) : <span className="font-bold">{receiptsData.firstYearTotalTuitionFeePending}</span></p>
                    <p className="text-xs">Total Hostel Fee Pending (1st Year) :  <span className="font-bold">{receiptsData.firstYearTotalHostelFeePending}</span></p> 
                    <p className="text-xs">Total Tuition Fee Pending (1st Year) : <span className="font-bold">{receiptsData.secondYearTotalTuitionFeePending}</span></p>
                    <p className="text-xs">Total Hostel Fee Pending (1st Year) :  <span className="font-bold">{receiptsData.secondYearTotalHostelFeePending}</span></p>
                </div>
            </div>


            <div className='bg-slate-400'>THIS RECEIPT IS AUTOGENERATED AND DOES NOT REQUIRE A SEAL OR A SIGNATURE, phno and link too</div>

        </div>
    );
}

export default DownloadReceipt;


