import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ListReceipts = () => {
    const userRole = useSelector((state) => state.auth.user?.role);
    const [receipts, setReceipts] = useState([
        {
            "date_time_of_payment": "23/01/2024, at 10:30",
            "name_of_student": "Alice Johnson",
            "amount_paid": 500,
            "mode_of_payment": "Credit Card",
            "receipt_number": "R123456",
            "student_status": "Enrolled",
            "edit_icon": "M",
            "download_receipt_icon": "Download Link"
        },
        {
            "date_time_of_payment": "22/01/2024, at 15:45",
            "name_of_student": "Bob Smith",
            "amount_paid": 750,
            "mode_of_payment": "Bank Transfer",
            "receipt_number": "R123457",
            "student_status": "Graduated",
            "edit_icon": "M",
            "download_receipt_icon": "Download Link"
        },
        {
            "date_time_of_payment": "21/01/2024, at 09:00",
            "name_of_student": "Charlie Brown",
            "amount_paid": 300,
            "mode_of_payment": "Cash",
            "receipt_number": "R123458",
            "student_status": "Enrolled",
            "edit_icon": "M",
            "download_receipt_icon": "Download Link"
        }
    ]
    );
    const [editableReceiptIndex, setEditableReceiptIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Implement initial sorting by date (latest first)
        setReceipts(receipts.sort((a, b) => new Date(b.date_time_of_payment) - new Date(a.date_time_of_payment)));
    }, []);

    const handleEditClick = (index) => {
        setEditableReceiptIndex(index);
    };

    const handleFieldChange = (e, index, field) => {
        const updatedReceipts = [...receipts];
        updatedReceipts[index][field] = e.target.value;
        setReceipts(updatedReceipts);
    };

    const filteredReceipts = receipts.filter(receipt => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            receipt.date_time_of_payment.toLowerCase().includes(lowerCaseSearchTerm) ||
            receipt.name_of_student.toLowerCase().includes(lowerCaseSearchTerm) ||
            receipt.amount_paid.toString().toLowerCase().includes(lowerCaseSearchTerm) ||
            receipt.mode_of_payment.toLowerCase().includes(lowerCaseSearchTerm) ||
            receipt.receipt_number.toLowerCase().includes(lowerCaseSearchTerm) ||
            receipt.student_status.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });
    

    return (
        <div>
            <h1>Payment Receipts</h1>
            <input type="text" placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)} />
            <table>
                <thead>
                    <tr>
                        {/* Column headers with sorting buttons */}
                    </tr>
                </thead>
                <tbody>
                {
                    filteredReceipts.map((receipt, index) => (
                        <tr key={index} style={{ backgroundColor: receipt.student_status === "CANCELLED" ? "red" : "" }}>
                            <td>{receipt.date_time_of_payment}</td>
                            <td>{receipt.name_of_student}</td>
                            
                            {editableReceiptIndex === index ? (
                                <>
                                    <td><input type="text" value={receipt.amount_paid} onChange={(e) => handleFieldChange(e, index, 'amount_paid')} /></td>
                                    <td><input type="text" value={receipt.mode_of_payment} onChange={(e) => handleFieldChange(e, index, 'mode_of_payment')} /></td>
                                </>
                            ) : (
                                <>
                                    <td>{receipt.amount_paid}</td>
                                    <td>{receipt.mode_of_payment}</td>
                                </>
                            )}
                            
                            <td>{receipt.receipt_number}</td>
                            <td>{receipt.student_status}</td>
                            <td>{userRole === 'M' && <button onClick={() => handleEditClick(index)}>Edit</button>}</td>
                            <td><a href={receipt.download_receipt_icon} download>Download</a></td>
                        </tr>
                    ))
                }

                </tbody>
            </table>
            
        </div>
    );
};

export default ListReceipts;