import React, { useState, useEffect } from 'react';

function ListReceipts() {
    const [receipts, setReceipts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                setIsLoading(true);
                // Replace with your API call
                const response = await fetch('YOUR_API_ENDPOINT_TO_FETCH_RECEIPTS');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setReceipts(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReceipts();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Receipts List</h2>
            <table>
                <thead>
                    <tr>
                        {/* Add table headers based on your receipt schema */}
                        <th>Application Number</th>
                        <th>Student Name</th>
                        <th>Date of Joining</th>
                        <th>Course</th>
                        {/* ... other headers */}
                    </tr>
                </thead>
                <tbody>
                    {receipts.map((receipt, index) => (
                        <tr key={index}>
                            <td>{receipt.applicationNumber}</td>
                            <td>{`${receipt.firstName} ${receipt.surName}`}</td>
                            <td>{receipt.dateOfJoining}</td>
                            <td>{receipt.course}</td>
                            {/* ... other data */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListReceipts;
