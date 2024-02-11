
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



function Temp() {

  
  const [loading, setLoading] = useState(true);
  const [shouldDownloadPdf, setShouldDownloadPdf] = useState(false);

  useEffect(() => {
    if (shouldDownloadPdf && !loading) {
        const input = document.getElementById('download-receipt-content');
        console.log(input)
        if(!input) console.log('hi')
        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 0, 0);
                pdf.save("downloadReceipt.pdf");
                setShouldDownloadPdf(false); // Reset the flag
            }).catch((error) => {
                console.error("Error generating PDF", error);
            });
        }
    }
}, [shouldDownloadPdf, loading]);

const handleDownloadClick = () => {
    setShouldDownloadPdf(true);
};




    return (
      <div>
        <div>
            {/* Your existing JSX... */}
            <button onClick={handleDownloadClick}>Download PDF</button>
        </div>
        <div id='download-receipt-content'>
          <p>hello</p>
        </div>
      </div>
        
    );
}

export default Temp;


