
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';



function DownloadReceipt() {

    const [amountPaid, setAmountPaid] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');
    const [receiptsData, setReceiptsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const amount = queryParams.get('amountPaid');
        const receiptNumber = queryParams.get('receiptNumber');
    
        if (amount) setAmountPaid(amount);
        if (receiptNumber) setReceiptNumber(receiptNumber);
    }, [location]);


    useEffect(() => {

        const fetchReceiptData = async () => {
            // try {
            //     const response = await axios.get(`http://localhost:5000/api/students/name/${receiptNumber}`);
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!receiptsData) {
        return <div>Student not found</div>;
    }
    
    return (
        <div className="bg-white p-8">
            <div className="border-b-2 border-black mb-4">
                <h1 className="text-4xl font-bold text-center">NINE EDUCATION</h1>
                <h1 className="text-3xl font-bold text-center">Receipt</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                <div>
                    <p className="text-lg">Receipt No: <span className="font-bold">{receiptNumber}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-lg">Date: <span className="font-bold">{new Date().toISOString().split('T')[0]}</span></p> 
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">STUDENT DETAILS</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-lg">Student's Name <span className="font-bold">{receiptsData.studentName} {receiptsData.surName}</span></p>
                    <p className="text-lg">Parent's Name : <span className="font-bold">{receiptsData.parentName}</span></p>
                    <p className="text-lg">Application Number :  <span className="font-bold">{receiptsData.applicationNumber}</span></p>
                    <p className="text-lg">Registered Mobile Number : <span className="font-bold">{receiptsData.registeredMobileNumber}</span></p>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">REGISTRATION DETAIL</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-lg">Batch :{receiptsData.batch}</p>
                    <p className="text-lg">Stream :{receiptsData.stream}</p>
                    <p className="text-lg">Branch :{receiptsData.branch}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg">Date of Joining :  {receiptsData.dateOfJoining}</p>
                    <p className="text-lg">Gender : {receiptsData.gender}</p>
                    <p className="text-lg">Residence Type :  {receiptsData.residenceType}</p>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">DETAILS OF THE CURRENT TRANSACTION</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-lg">Tuition Fee Payable (1st Year) {receiptsData.firstYearTuitionFee} </p>
                    <p className="text-lg">Hostel Fee Payable (1st Year)  {receiptsData.firstYearTuitionFee}</p>
                    <p className="text-lg">Tuition Fee Payable (2nd Year) {receiptsData.secondYearTuitionFee} </p>
                    <p className="text-lg">Hostel Fee Payable (2nd Year)  {receiptsData.secondYearTuitionFee}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg">Tuition Fee Paid (1st Year) :   {receiptsData.paidFirstYearTuitionFee} /-</p>
                    <p className="text-lg">Hostel Fee Paid (1st Year) :  {receiptsData.paidFirstYearHostelFee} /-</p>
                    <p className="text-lg">Tuition Fee Paid (2nd Year) : {receiptsData.paidSecondYearTuitionFee} </p>
                    <p className="text-lg">Hostel Fee Paid (2nd Year) :  {receiptsData.paidSecondYearHostelFee}</p>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">DETAILS OF PREVIOUS TRANSACTIONS</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-lg">Total Tuition Fee Paid (1st Year)   {receiptsData.paidFirstYearTuitionFee}</p>
                    <p className="text-lg">Total Hostel Fee Paid (1st Year)   {receiptsData.paidFirstYearHostelFee}</p>  
                    <p className="text-lg">Total Tuition Fee Paid (2nd Year)  {receiptsData.paidSecondYearTuitionFee}</p>
                    <p className="text-lg">Total Hostel Fee Paid (2nd Year)   {receiptsData.paidSecondYearHostelFee}</p>  
                </div>
                <div className="text-right">
                    <p className="text-lg">Total Tuition Fee Pending (1st Year) : {receiptsData.pendingFirstYearTuitionFee}</p>
                    <p className="text-lg">Total Hostel Fee Pending (1st Year) :  {receiptsData.pendingFirstYearHostelFee}</p>  
                    <p className="text-lg">Total Tuition Fee Pending (1st Year) : {receiptsData.pendingSecondYearTuitionFee}</p>
                    <p className="text-lg">Total Hostel Fee Pending (1st Year) :  {receiptsData.pendingSecondYearHostelFee}</p> 
                </div>
            </div>

            <div className="border-t-2 border-black pt-4">
                <p className="text-lg">Authorized Signature</p>
            </div>
        </div>
    );
}

export default DownloadReceipt;


