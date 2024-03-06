import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar'; // Adjust the import path as necessary
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// Make sure to include other necessary imports

function ListReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);

    // Other state hooks remain unchanged

    useEffect(() => {
        // Initial fetch or fetch logic remains unchanged
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search term changes
    };

    const filteredReceipts = useMemo(() => {
        if (!searchTerm) return receipts;
        const searchTerms = searchTerm.split(',').map(term => term.trim().toLowerCase());
        return receipts.filter(receipt =>
            searchTerms.every(term =>
                Object.keys(receipt).some(key =>
                    receipt[key] && receipt[key].toString().toLowerCase().includes(term)
                )
            )
        );
    }, [searchTerm, receipts]); // Corrected the dependency array

    const sortedAndFilteredReceipts = useMemo(() => {
        // Sorting logic remains unchanged
        // Use `filteredReceipts` in this logic
    }, [filteredReceipts, sortConfig]);

    // The rest of your component logic remains unchanged

    return (
        <div className="main-container root-container">
            <Navbar/>
            {/* Your component structure remains unchanged */}
            <input
                type="text"
                placeholder="Search..."
                className="input input-bordered w-full max-w-xs"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            {/* Render sorted and filtered receipts using `sortedAndFilteredReceipts` */}
        </div>
    );
}

export default ListReceipts;
