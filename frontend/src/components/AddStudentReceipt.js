import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

function AddStudentReceipt() {
    const [studentData, setStudentData] = useState(null);
    const { firstName } = useParams();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/name/${firstName}`);
                console.log("Fetched data:", response.data); // Debug log
                setStudentData(response.data);
            } catch (error) {
                console.error('Error fetching student data: ', error);
            }
        };

        if (firstName) {
            fetchStudentData();
        }
    }, [firstName]);

    if (!studentData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar/>
            <div>
                <h1 className='text-2xl font-bold text-gray-500 mb-4'>{studentData.firstName}'s Receipt Details</h1>
                {/* Display student data here */}
                <p>First Year Tuition Fee: {studentData.firstYearTuitionFee}</p>
                {/* Add more fields as needed */}
            </div>
        </div>
    );
}

export default AddStudentReceipt;
