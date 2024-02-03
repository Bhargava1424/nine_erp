
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
        console.log("Query amountPaid:", amount); // Debug log
        const receiptNumber = queryParams.get('receiptNumber');
        const feeType = queryParams.get('feeType');
    
        if (amount) setAmountPaid(parseInt(amount, 10));
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

    

    function numberToWordsIN(num) {
        if (num === 0) return "zero";
        if (num < 0) return "minus " + numberToWordsIN(-num);
    
        const words = [];
    
        const crore = Math.floor(num / 10000000);
        num -= crore * 10000000;
        const lakh = Math.floor(num / 100000);
        num -= lakh * 100000;
        const thousand = Math.floor(num / 1000);
        num -= thousand * 1000;
        const hundred = Math.floor(num / 100);
        num -= hundred * 100;
        const ten = Math.floor(num / 10);
        const one = num % 10;
    
        if (crore) words.push(numberToWordsIN(crore) + " Crore");
        if (lakh) words.push(numberToWordsIN(lakh) + " Lakh");
        if (thousand) words.push(numberToWordsIN(thousand) + " Thousand");
        if (hundred) words.push(numberToWordsIN(hundred) + " Hundred");
    
        const belowTwenty = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    
        if (ten > 1) {
            words.push(tens[ten]);
            if (one > 0) words.push(belowTwenty[one]);
        } else if (ten === 1 || one > 0) {
            words.push(belowTwenty[ten * 10 + one]);
        }
    
        if (words.length > 1) {
            // Combine all but last word with commas
            const lastWord = words.pop();
            return words.join(", ") + " and " + lastWord;
        }
    
        return words.join("");
    }

    const amountInWords = numberToWordsIN(parseInt(amountPaid, 10));
    console.log(amountPaid);
    
    return (
        <div className="bg-white p-8" id="download-receipt-content">
            <div className="border-b-2 border-black mb-4">
                <h1 className="text-3xl font-bold text-center font-arial  mb-4">NINE EDUCATION</h1>
                <h1 className="text-2xl font-bold text-center bg-black text-white">FEE RECEIPT</h1>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                <div>
                    <p className="text-xs">Receipt No: <span className="font-bold">{receiptNumber}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-xs">Date: <span className="font-bold">{new Date().toISOString().split('T')[0]}</span></p> 
                </div>
            </div>
            <h1 className=" underline text-lg font-bold text-center underline">STUDENT DETAILS</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
            <div>
                <p className="text-xs mb-2">Student's Name : <span className="font-bold">{receiptsData.studentName} {receiptsData.surName}</span></p>
                <p className="text-xs mb-2">Parent's Name : <span className="font-bold">{receiptsData.parentName}</span></p>
                <p className="text-xs mb-2">Application Number : <span className="font-bold">{receiptsData.applicationNumber}</span></p>
                <p className="text-xs mb-2">Registered Mobile Number : <span className="font-bold">{receiptsData.registeredMobileNumber}</span></p>
            </div>

            </div>
            <h1 className=" underline text-lg font-bold text-center">REGISTRATION DETAIL</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-xs mb-2">Batch : <span className='font-bold'>{receiptsData.batch}</span></p>
                    <p className="text-xs mb-2">Stream :<span className='font-bold'>{receiptsData.stream}</span></p>
                    <p className="text-xs mb-2">Branch :<span className='font-bold'>{receiptsData.branch}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-xs mb-2">Date of Joining :<span className='font-bold'>{receiptsData.dateOfJoining}</span></p>
                    <p className="text-xs mb-2">Gender : <span className='font-bold'>{receiptsData.gender}</span></p>
                    <p className="text-xs mb-2">Residence Type :  <span className='font-bold'>{receiptsData.residenceType}</span></p>
                </div>
            </div>
            <h1 className=" underline text-lg font-bold text-center">FEE DETAILS OF THE STUDENT</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-xs mb-2">Tuition Fee Payable (1st Year): <span className="font-bold">{receiptsData.firstYearTuitionFeePayable}</span></p>
                    <p className="text-xs mb-2">Hostel Fee Payable (1st Year) : <span className="font-bold">{receiptsData.firstYearHostelFeePayable}</span></p>  
                </div>
                <div className="text-right">
                    <p className="text-xs md-2">Tuition Fee Payable (2nd Year) : <span className="font-bold">{receiptsData.secondYearTuitionFeePayable}</span></p>
                    <p className="text-xs md-2">Hostel Fee Payable (2nd Year) :  <span className="font-bold">{receiptsData.secondYearHostelFeePayable}</span></p>  
                </div>
            </div>
            <h1 className=" underline text-lg font-bold text-center">DETAILS OF THE CURRENT TRANSACTION</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                <div>
                    <p className="text-xs mb-2">Amount Paid in Current Transaction:<span className="font-bold">{amountPaid + '/-'}</span></p>
                    <p className="text-xs mb-2 whitespace-nowrap">Amount Paid in Words: <span className='font-bold'>{amountInWords}</span>{/*Placeholder 1 */}</p>
                    <p className="text-xs mb-2">Amount Paid Towards: <span className='font-bold'>{feeType}</span> {/*Placeholder 2 */}</p>
                    <p className="text-xs mb-2">Mode of Payment:<span className='font-bold'>{receiptsData.modeOfPayment}</span> {/*Placeholder 3 */} </p>
                    
                </div>
            </div>
            <h1 className=" underline text-lg font-bold text-center">DETAILS OF ALL TRANSACTIONS</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-xs mb-2">Total Tuition Fee Paid (1st Year) : <span className="font-bold">{receiptsData.firstYearTotalTuitionFeePaid}</span></p>
                    <p className="text-xs mb-2">Total Hostel Fee Paid (1st Year) : <span className="font-bold">{receiptsData.firstYearTotalHostelFeePaid}</span></p> 
                    <p className="text-xs mb-2">Total Tuition Fee Paid (2nd Year) : <span className="font-bold">{receiptsData.secondYearTotalTuitionFeePaid}</span></p>
                    <p className="text-xs mb-2">Total Hostel Fee Paid (2nd Year) : <span className="font-bold">{receiptsData.secondYearTotalHostelFeePaid}</span></p>  
                </div>
                <div className="text-right">
                    <p className="text-xs mb-2">Total Tuition Fee Pending (1st Year) : <span className="font-bold">{receiptsData.firstYearTotalTuitionFeePending}</span></p>
                    <p className="text-xs mb-2">Total Hostel Fee Pending (1st Year) :  <span className="font-bold">{receiptsData.firstYearTotalHostelFeePending}</span></p> 
                    <p className="text-xs mb-2">Total Tuition Fee Pending (1st Year) : <span className="font-bold">{receiptsData.secondYearTotalTuitionFeePending}</span></p>
                    <p className="text-xs mb-2">Total Hostel Fee Pending (1st Year) :  <span className="font-bold">{receiptsData.secondYearTotalHostelFeePending}</span></p>
                </div>
            </div>


            <div className='bg-slate-400 justify-center text-center text-sm'>THIS RECEIPT IS AUTOGENERATED AND DOES NOT REQUIRE A SEAL OR A SIGNATURE</div>
            <div>
                <div>
                <p className="text-xs">7654 444 999 </p>
                </div>
                <div className='text-right'>
                <p className="text-xs">www.nineeducation.in</p>
                </div>
            </div>


            <div className='bg-slate-400'>THIS RECEIPT IS AUTOGENERATED AND DOES NOT REQUIRE A SEAL OR A SIGNATURE, phno and link too</div>

        </div>
    );
}

export default DownloadReceipt;


