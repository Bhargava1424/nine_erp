
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; 
import './receipt.css'



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
        if (feeType ==='FirstYearTuitionFee') setFeeType('First Year Tuition Fee')
        if (feeType ==='FirstYearHostelFee') setFeeType('First Year Hostel Fee')
        if (feeType ==='SecondYearTuitionFee') setFeeType('second Year Tuition Fee')
        if (feeType ==='SecondYearHostelFee') setFeeType('second Year Hostel Fee')
    }, [location]);


    const [shouldDownloadPdf, setShouldDownloadPdf] = useState(false);

    // Example function to fetch data
    const fetchData = async () => {
        // Fetching data logic
        // On successful data load:
        setShouldDownloadPdf(true); // Ready to download PDF
    };
 
    
    const downloadPdfDocument = () => {
        const input = document.getElementById('download-receipt-content');
        if (input) {
            // Adjust the scale to match the desired output on A4
            // Assume the content is designed to fit a 1920px wide screen
            // Calculate the scale factor based on the A4 width in pixels and the desired viewport width
            const scaleFactor = 794 / 1920; // A4 width in pixels (approx for 96 DPI) / desired viewport width
    
            html2canvas(input, { 
                scale: scaleFactor * window.devicePixelRatio, // Adjust scale based on device pixel ratio
                scrollY: -window.scrollY,
                windowWidth: 1920 // Force html2canvas to render the canvas as it appears in a 1920px wide viewport
            }).then(canvas => {
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgWidth = 210;  // A4 width in mm
                const imgHeight = canvas.height * imgWidth / canvas.width;
                const position = 0;  // Initial position to start adding images
    
                // Add the canvas as an image to the PDF, scaled to fit A4
                pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    
                // Generate filename based on current date and time
                const today = new Date();
                const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()} ${today.getHours()}-${today.getMinutes()}`;
                const fileName = `Receipt ${date}.pdf`;
    
                // Save the PDF
                pdf.save(fileName);
            }).catch(error => {
                console.error("Error generating PDF", error);
            });
        }
    };
    
    
    // Effect to generate and download PDF
    // console.log(''+shouldDownloadPdf)
    // useEffect(() => {
    // This useEffect depends on shouldDownloadPdf, which is set to true after data is fetched
    //     if (shouldDownloadPdf) {
    // Delay the PDF download to ensure the DOM has updated
    //         setTimeout(() => downloadPdfDocument(), 500); // Adjust delay as needed
    //     }
    // }, [shouldDownloadPdf]);
    // Call fetchData at the appropriate time, e.g., on component mount or in response to user action
    useEffect(() => {
        fetchData();
    }, []);
    


    console.log(feeType);

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
        return (
            <div class="flex justify-center items-center h-screen">
            <span class="loading loading-bars loading-lg"></span>
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
        if (hundred) {
            words.push(numberToWordsIN(hundred) + " Hundred");
            // Add "and" only if there is more number after hundred and it's not a multiple of 100
            if (num > 0) words.push("and");
        }
    
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
            return words.join(" ") + " " + lastWord;
        }
    
        return words.join("");
    }
    

    const amountInWords = numberToWordsIN(parseInt(amountPaid, 10));
    console.log(amountPaid);


    function formatNumberIndia(num) {
        // Check if num is null or undefined before proceeding
        if (num === null || num === undefined) {
            return "0"; // Or any other fallback value you prefer
        }
    
        var x = num.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res;
    }
    


    
    function formatDate(dateString) {
        // Assuming dateString format is "HH-MM DD-MM-YYYY" and we need "DD-MM-YYYY"
        const parts = dateString.split(' ');
        // Extracting the date part based on the assumed format
        const datePart = parts.length > 1 ? parts[1] : '';
        // Splitting the date part to rearrange it into "DD-MM-YYYY"
        const [day, month, year] = datePart.split('-');
        return `${day}-${month}-${year}`;
    }

     
    

    
      
    return (

        <div className="no-daisyui">

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button 
                    style={{
                        backgroundColor: '#2D5990',
                        color: 'white',
                        padding: '10px 20px', // Increase padding for a bigger size
                        fontSize: '18px', // Increase font size
                        borderRadius: '5px', // Optional: if you want rounded corners
                        cursor: 'pointer', // Changes the cursor on hover
                        border: 'none' // Removes the default button border
                    }}
                    onClick={downloadPdfDocument}
                    className="btn btn-blue text-white">
                    Download
                </button>
            </div>

            <div id="download-receipt-content" class='phone-padding thick-font main-padding'>
                
        
            
            
            <div class="bg-white p-8" >
                
                <div class="  mb-1">
                    <h1 class="text-3xl font-bold text-center  py-2 " >NINE EDUCATION</h1>
                    <h1 class="text-lg font-bold text-center bg-slate-800 text-colour  py-2 ">FEE RECEIPT</h1>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-1 py-3  ">
                    <div>
                        <p class="text-xs">Receipt Number : <span class="font-bold-2 py-2 text-sm">{receiptNumber}</span></p>    
                    </div>
                    <div class="text-right">
                        <p class="text-xs">Payment Date : <span class="font-bold-2 py-2 text-sm">{formatDate(receiptsData.dateOfPayment)}</span></p> 
                    </div>
                </div>
                <h1 class="  text-lg font-bold text-center bg-slate-400  py-2 ">STUDENT DETAILS</h1>
                <div class="grid grid-cols-2 gap-4 mb-1 py-3  ">
                    
                <div>
                    <p class="text-xs mb-1 whitespace-nowrap mt-2 py-2 ">Student's Name : <span class="font-bold-2 text-sm ">{receiptsData.studentName} {receiptsData.surName}</span></p>
                    <p class="text-xs mb-1 py-2 ">Parent's Name : <span class="font-bold-2 text-sm">{receiptsData.parentName}</span></p>
                </div>
                <div class="text-right">
                    <p class="text-xs mb-1 py-2 ">Application Number : <span class="font-bold-2 text-sm">{receiptsData.applicationNumber}</span></p>
                    <p class="text-xs mb-1 py-2 ">Registered Mobile Number : <span class="font-bold-2 text-sm">{receiptsData.registeredMobileNumber}</span></p>
                </div>

                </div>
                <h1 class="  text-lg font-bold text-center bg-slate-400  py-2 ">REGISTRATION DETAILS</h1>
                <div class="grid grid-cols-2 gap-4 mb-1 py-3  " >
                    
                    <div>
                        <p class="text-xs mb-1 py-1 ">Batch : <span class='font-bold text-sm'>{receiptsData.batch}</span></p>
                        <p class="text-xs mb-1 py-1 ">Stream : <span class='font-bold text-sm'>{receiptsData.stream}</span></p>
                        <p class="text-xs mb-1 py-1 ">Branch : <span class='font-bold text-sm'>{receiptsData.branch}</span></p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs mb-1 py-1 ">Date of Joining : <span class='font-bold text-transform: uppercase text-sm'>{receiptsData.dateOfJoining}</span></p>
                        <p class="text-xs mb-1 py-1 ">Gender : <span class='font-bold text-transform: uppercase text-sm'>{receiptsData.gender}</span></p>
                        <p class="text-xs mb-1 py-1 ">Residence Type : <span class='font-bold text-transform: uppercase text-sm'>{receiptsData.residenceType}</span></p>
                    </div>
                </div>
                <h1 class="  text-lg font-bold text-center bg-slate-400 mb-1 py-2 ">FEE DETAILS OF THE STUDENT</h1>
                <div class="grid grid-cols-2 gap-4 mb-1 py-3  ">
                    
                    <div>
                        <p class="text-xs mb-1 py-2 ">Tuition Fee Payable (1st Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia(receiptsData.firstYearTuitionFeePayable)}/-</span></p>
                        <p class="text-xs mb-1 py-2 ">Hostel Fee Payable (1st Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia(receiptsData.firstYearHostelFeePayable)}/-</span></p>  
                    </div>
                    <div class="text-right">
                        <p class="text-xs mb-1 py-2 ">Tuition Fee Payable (2nd Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia(receiptsData.secondYearTuitionFeePayable)}/-</span></p>
                        <p class="text-xs mb-1 py-2 ">Hostel Fee Payable (2nd Year) :  <span class="font-bold-2 text-sm">₹ {formatNumberIndia(receiptsData.secondYearHostelFeePayable)}/-</span></p>  
                    </div>
                </div>
                <h1 class="  text-lg font-bold text-center bg-slate-400 mb-1 py-2 ">DETAILS OF THE CURRENT TRANSACTION</h1>
                <div class="grid grid-cols-2 gap-4 mb-1 py-3  ">
                    <div>
                        <p class="text-xs mb-2 py-2 ">Amount Paid in Current Transaction : <span class="font-bold-2 text-sm">₹ {formatNumberIndia(amountPaid)}/-</span></p>
                        <p class="text-xs mb-2 whitespace-nowrap py-2 ">Amount Paid in Words : <span class='font-bold text-transform: uppercase text-sm'>Rupees {amountInWords} Only</span>{/*Placeholder 1 */}</p>
                        <p class="text-xs mb-2 py-2 ">Amount Paid Towards : <span class='font-bold text-transform: uppercase text-sm'>{feeType}</span> {/*Placeholder 2 */}</p>
                        <p class="text-xs mb-2 py-2 ">Mode of Payment : <span class='font-bold text-sm'>{receiptsData.modeOfPayment}</span> {/*Placeholder 3 */} </p>
                        
                    </div>
                </div>
                <h1 class="  text-lg font-bold text-center bg-slate-400 mb-1 py-2 ">DETAILS OF ALL TRANSACTIONS</h1>
                <div class="grid grid-cols-2 gap-4 mb-1 py-3  ">
                    
                    <div>
                        <p class="text-xs mb-1 py-2 ">Total Tuition Fee Paid (1st Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia(receiptsData.firstYearTotalTuitionFeePaid)}/-</span></p>
                        <p class="text-xs mb-1 py-2 ">Total Hostel Fee Paid (1st Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia(receiptsData.firstYearTotalHostelFeePaid)}/-</span></p> 
                        <p class="text-xs mb-1 py-2 ">Total Tuition Fee Paid (2nd Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia(receiptsData.secondYearTotalTuitionFeePaid)}/-</span></p>
                        <p class="text-xs mb-1 py-2 ">Total Hostel Fee Paid (2nd Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia(receiptsData.secondYearTotalHostelFeePaid)}/-</span></p>  
                    </div>
                    <div class="text-right">
                        <p class="text-xs mb-1 py-2 ">Total Tuition Fee Pending (1st Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia((receiptsData.firstYearTotalTuitionFeePending))}/-</span></p>
                        <p class="text-xs mb-1 py-2 ">Total Hostel Fee Pending (1st Year) :  <span class="font-bold-2 text-sm">₹ {formatNumberIndia((receiptsData.firstYearTotalHostelFeePending))}/-</span></p> 
                        <p class="text-xs mb-1 py-2 ">Total Tuition Fee Pending (2nd Year) : <span class="font-bold-2 text-sm">₹ {formatNumberIndia((receiptsData.secondYearTotalTuitionFeePending))}/-</span></p>
                        <p class="text-xs mb-1 py-2 ">Total Hostel Fee Pending (2nd Year) :  <span class="font-bold-2 text-sm">₹ {formatNumberIndia((receiptsData.secondYearTotalHostelFeePending))}/-</span></p>
                    </div>
                </div>


                <div class='bg-slate-800 justify-center text-center font-bold py-1'>
                    <p class='text-colour text-xs'> THIS RECEIPT IS AUTOGENERATED AND DOES NOT REQUIRE A SEAL OR A SIGNATURE</p>
                </div>
                <div class="flex justify-between items-center px-4 py-2">
                    <div>
                        <p class="text-xs">☎ 7654 444 999</p>
                    </div>
                    <div>
                        <p class="text-xs"><span class="emoji" style={{ filter: 'grayscale(100%) brightness(0)' }}>🌐</span> www.nineeducation.in</p>
                    </div>
                </div>
            </div>        
        </div>
        </div>
        
    

        
        
    );
}

export default DownloadReceipt;


