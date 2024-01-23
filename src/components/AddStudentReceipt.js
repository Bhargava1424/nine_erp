import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';


function AddStudentReceipt() {
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { applicationNumber } = useParams();
    const [showReceiptSection, setShowReceiptSection] = useState(false);
    const [amountPaid, setAmountPaid] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [chequeNumber, setChequeNumber] = useState('');
    

    const handleAmountChange = (e) => {
        setAmountPaid(e.target.value);
    };

    const handleModeOfPaymentChange = (e) => {
        setModeOfPayment(e.target.value);
        // Reset cheque number if the mode of payment is not 'CHEQUE'
        if (e.target.value !== 'CHEQUE') {
            setChequeNumber('');
        }
    };

    const handleChequeNumberChange = (e) => {
        setChequeNumber(e.target.value);
    };

    const handleAddReceiptClick = (feeType) => {
        // Replace 'feeType' with your actual fee type identifier
        setShowReceiptSection(true);
    };
    

    useEffect(() => {

        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/students/name/${applicationNumber}`);
                setStudentData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (applicationNumber) {
            fetchStudentData();
        }
    }, [applicationNumber]);


    const handleSubmit = async () => {
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
            const response = await axios.post(`http://localhost:5000/api/students/update-fees/${studentData._id}`, updatedFees);

            

            // Check for success response, then update state
            if (response.status === 200) {
                setStudentData(prevState => ({
                    ...prevState,
                    ...updatedFees,
                }));
                setShowReceiptSection(false); // Hide the receipt section after successful update
                setAmountPaid(''); // Reset the amount
                setModeOfPayment(''); // Reset the mode of payment
                setChequeNumber(''); // Reset the cheque number
            } else {
                // Handle any other response
                console.error('An error occurred:', response);
            }
            if (response.status === 200) {
                // Prepare the data to be sent
                
        
                if (response.status === 200) {
                    // Include the amountPaid in the URL
                    const receiptUrl = `/DownloadReceipt?amountPaid=${amountPaid}&firstName=${studentData.firstName}`;
                    window.open(receiptUrl, '_blank');

                }
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
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
    

    return (
        <>
            <Navbar/>

            <h1 className='text-2xl font-bold text-black  mb-4'>{studentData.firstName}'s Receipt Details</h1>

            <div>
                <div className="overflow-x-auto">        {/* First Year Tuition Fee */}
                    <h2 className='text-xl font-bold text-black mb-4'>1st Year Tuition Fee:</h2>
                    <table className="table border border-black">
                        {/* head */}
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-lg border border-black text-black">Applied Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Paid Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Pending Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Add Receipt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* body */}
                        <tr className="hover:bg-[#00A0E3]">
                            <td className="text-lg text-black font-bold border border-black">{studentData.firstYearTuitionFee}</td>
                            <td className="text-lg text-black font-bold border border-black">{studentData.paidFirstYearTuitionFee}</td>
                            <td className="text-lg text-black font-bold border border-black">{studentData.pendingFirstYearTuitionFee}</td>
                            <td className="text-lg text-black font-bold border border-black">
                                <button  className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => handleAddReceiptClick('feeType')}>
                                    Add Receipt
                                </button > 
                                {showReceiptSection && (
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
                                            <button onClick={handleSubmit}  className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
                                                Submit Payment
                                            </button>                      

                                            
                                        </div>
                                        {/* Add submission button or form handlers as needed */}
                                    </div>
                                )}    
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="overflow-x-auto">        {/* First Year Hostel Fee */}
                    <h2 className='text-xl font-bold text-black mb-4'>1st Year Hostel Fee:</h2>
                    <table className="table border border-black">
                        {/* head */}
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-lg border border-black text-black" >Applied Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Paid Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Pending Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Add Receipt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*body*/}
                        <tr className="hover:bg-[#00A0E3]">
                            <td className="text-lg text-black font-bold border border-black">{studentData.firstYearHostelFee}</td>
                            <td className="text-lg text-black font-bold border border-black">{studentData.paidFirstYearHostelFee}</td>
                            <td className="text-lg text-black font-bold border border-black">{studentData.pendingFirstYearHostelFee}</td>
                            <td className="text-lg text-black font-bold border border-black"><button className="btn btn-outline text-white" onClick={() => handleAddReceiptClick('feeType')} style={{ backgroundColor: '#2D5990' }}>Add Receipt</button></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="overflow-x-auto">        {/* Second Year Tuition Fee */}
                    <h2 className='text-xl font-bold text-black mb-4'>2nd Year Tuition Fee</h2>
                    <table className="table border border-black">
                        {/* head */}
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-lg border border-black text-black" >Applied Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Paid Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Pending Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Add Receipt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* body */}
                        <tr className="hover:bg-[#00A0E3]">
                            <td className="text-lg text-black font-bold border border-black">{studentData.secondYearTuitionFee}</td>
                            <td className="text-lg text-black font-bold border border-black">{studentData.paidSecondYearTuitionFee}</td>
                            <td className="text-lg text-black font-bold border border-black">{studentData.pendingSecondYearTuitionFee}</td>
                            <td className="text-lg text-black font-bold border border-black"><button className="btn btn-outline text-white" onClick={() => handleAddReceiptClick('feeType')} style={{ backgroundColor: '#2D5990' }}>Add Receipt</button></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="overflow-x-auto">        {/* Second Year Hostel Fee */}
                    <h2 className='text-xl font-bold text-black mb-4'>2nd Year Hostel Fee</h2>
                    <table className="table border border-black">
                        {/* head */}
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-lg border border-black text-black" >Applied Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Paid Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Pending Fee</th>
                            <th className="px-4 py-2 text-lg border border-black text-black">Add Receipt</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* body */}
                        <tr className="hover:bg-[#00A0E3]">
                            <td className="text-lg text-black font-bold border border-black">{studentData.secondYearHostelFee}</td>
                            <td className="text-lg text-black font-bold border border-black">{studentData.paidSecondYearHostelFee}</td>
                            <td className="text-lg text-black font-bold border border-black">{studentData.pendingSecondYearHostelFee}</td>
                            <td className="text-lg text-black font-bold border border-black"><button className="btn btn-outline text-white" onClick={() => handleAddReceiptClick('feeType')} style={{ backgroundColor: '#2D5990' }}>Add Receipt</button></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}

export default AddStudentReceipt;
