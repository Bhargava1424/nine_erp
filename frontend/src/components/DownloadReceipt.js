
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';



function DownloadReceipt() {

    const [amountPaid, setAmountPaid] = useState('');
    const [firstName, setFirstYearTuitionFee] = useState('');
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const amount = queryParams.get('amountPaid');
        const firstName = queryParams.get('firstName');
    
        if (amount) setAmountPaid(amount);
        if (firstName) setFirstYearTuitionFee(firstName);
    }, [location]);

    useEffect(() => {

        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/name/${firstName}`);
                setStudentData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (firstName) {
            fetchStudentData();
        }
    }, [firstName]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!studentData) {
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
                    <p className="text-lg">Receipt No: <span className="font-bold">[Receipt No:]</span></p>
                </div>
                <div className="text-right">
                    <p className="text-lg">Date: <span className="font-bold">[Date:]</span></p> 
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">STUDENT DETAILS</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-lg">Student's Name <span className="font-bold">{firstName}</span></p>
                    <p className="text-lg">Parent's Name : <span className="font-bold">[Receipt No:]</span></p>
                    <p className="text-lg">Application Number :  <span className="font-bold">[Receipt No:]</span></p>
                    <p className="text-lg">Registered Mobile Number : <span className="font-bold">[Receipt No:]</span></p>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">REGISTRATION DETAIL</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-lg">Batch :{studentData.batch}</p>
                    <p className="text-lg">Stream :{studentData.course}</p>
                    <p className="text-lg">Branch :{studentData.branch}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg">Date of Joining :  {studentData.dateOfJoining}</p>
                    <p className="text-lg">Gender : {studentData.gender}</p>
                    <p className="text-lg">Residence Type :  {studentData.modeOfResidence}</p>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">DETAILS OF THE CURRENT TRANSACTION</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-lg">Tuition Fee Payable (1st Year) {studentData.firstYearTuitionFee} </p>
                    <p className="text-lg">Hostel Fee Payable (1st Year)  {studentData.firstYearTuitionFee}</p>
                    <p className="text-lg">Tuition Fee Payable (2nd Year) {studentData.secondYearTuitionFee} </p>
                    <p className="text-lg">Hostel Fee Payable (2nd Year)  {studentData.secondYearTuitionFee}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg">Tuition Fee Paid (1st Year) :   {amountPaid} /-</p>
                    <p className="text-lg">Hostel Fee Paid (1st Year) :  </p>
                    <p className="text-lg">Tuition Fee Paid (2nd Year) :  </p>
                    <p className="text-lg">Hostel Fee Paid (2nd Year) :  </p>
                </div>
            </div>
            <h1 className="text-2xl font-bold text-center">DETAILS OF PREVIOUS TRANSACTIONS</h1>
            <div className="grid grid-cols-2 gap-4 mb-4 border-b-2 border-black">
                
                <div>
                    <p className="text-lg">Total Tuition Fee Paid (1st Year)   {studentData.paidFirstYearTuitionFee}</p>
                    <p className="text-lg">Total Hostel Fee Paid (1st Year)   {studentData.paidFirstYearHostelFee}</p>  
                    <p className="text-lg">Total Tuition Fee Paid (2nd Year)  {studentData.paidSecondYearTuitionFee}</p>
                    <p className="text-lg">Total Hostel Fee Paid (2nd Year)   {studentData.paidSecondYearHostelFee}</p>  
                </div>
                <div className="text-right">
                    <p className="text-lg">Total Tuition Fee Pending (1st Year) : {studentData.pendingFirstYearTuitionFee}</p>
                    <p className="text-lg">Total Hostel Fee Pending (1st Year) :  {studentData.pendingFirstYearHostelFee}</p>  
                    <p className="text-lg">Total Tuition Fee Pending (1st Year) : {studentData.pendingSecondYearTuitionFee}</p>
                    <p className="text-lg">Total Hostel Fee Pending (1st Year) :  {studentData.pendingSecondYearHostelFee}</p> 
                </div>
            </div>

            <div className="border-t-2 border-black pt-4">
                <p className="text-lg">Authorized Signature</p>
            </div>
        </div>
    );
}

export default DownloadReceipt;


