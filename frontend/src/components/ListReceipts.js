import React, { Component } from 'react';
import jsPDF from 'jspdf';
import Navbar from './Navbar';
class ListReceipts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receipts: [
                // Predefined receipts data goes here
                { dateOfPayment: "2024-01-01", receiptNo: "001", nameOfStudent: "John Doe", amountPaid: "100.00", modeOfPayment: "Credit Card" },
                { dateOfPayment: "2024-01-02", receiptNo: "002", nameOfStudent: "Jane Smith", amountPaid: "200.00", modeOfPayment: "Debit Card" },
                { dateOfPayment: "2024-01-03", receiptNo: "003", nameOfStudent: "Alice Johnson", amountPaid: "150.00", modeOfPayment: "Cash" },
                { dateOfPayment: "2024-01-04", receiptNo: "004", nameOfStudent: "Michael Brown", amountPaid: "250.00", modeOfPayment: "Check" },
                { dateOfPayment: "2024-01-05", receiptNo: "005", nameOfStudent: "Rachel Green", amountPaid: "175.00", modeOfPayment: "Credit Card" },
                { dateOfPayment: "2024-01-06", receiptNo: "006", nameOfStudent: "Chandler Bing", amountPaid: "180.00", modeOfPayment: "Debit Card" },
                { dateOfPayment: "2024-01-07", receiptNo: "007", nameOfStudent: "Ross Geller", amountPaid: "220.00", modeOfPayment: "Credit Card" },
                { dateOfPayment: "2024-01-08", receiptNo: "008", nameOfStudent: "Monica Geller", amountPaid: "200.00", modeOfPayment: "Cash" },
                { dateOfPayment: "2024-01-09", receiptNo: "009", nameOfStudent: "Joey Tribbiani", amountPaid: "195.00", modeOfPayment: "Check" },
                { dateOfPayment: "2024-01-10", receiptNo: "010", nameOfStudent: "Phoebe Buffay", amountPaid: "210.00", modeOfPayment: "Credit Card" }
            ],
            editingIndex: null,
        };
    }

    handleEdit = (index) => {
        const { editingIndex } = this.state;
        if (editingIndex !== null) {
            // If currently editing, save the current receipt's changes and close the editor
            this.setState({ editingIndex: null });
        } else {
            // If not editing, set the editing index to the current receipt
            this.setState({ editingIndex: index });
        }
    };

    updateReceiptField = (index, field, value) => {
        this.setState(prevState => {
            const updatedReceipts = prevState.receipts.map((receipt, i) => {
                if (i === index) {
                    return { ...receipt, [field]: value };
                }
                return receipt;
            });
            return { receipts: updatedReceipts };
        });
    };

    handleDownload = (receipt) => {
        const doc = new jsPDF();
        doc.text(`Date of Payment: ${receipt.dateOfPayment}`, 10, 10);
        doc.text(`Receipt No: ${receipt.receiptNo}`, 10, 20);
        doc.text(`Name of Student: ${receipt.nameOfStudent}`, 10, 30);
        doc.text(`Amount Paid: ${receipt.amountPaid}`, 10, 40);
        doc.text(`Mode of Payment: ${receipt.modeOfPayment}`, 10, 50);
        doc.save(`receipt-${receipt.receiptNo}.pdf`);
    };

    renderReceiptCard = (receipt, index) => {
        const { editingIndex } = this.state;
        const isEditing = editingIndex === index;

        return (            
            <div key={receipt.receiptNo} className="receipt-card">
                {isEditing ? (
                    <>
                        <input type="date" value={receipt.dateOfPayment} onChange={(e) => this.updateReceiptField(index, 'dateOfPayment', e.target.value)} className="edit-field" />
                        <input type="text" value={receipt.receiptNo} onChange={(e) => this.updateReceiptField(index, 'receiptNo', e.target.value)} className="edit-field" />
                        <input type="text" value={receipt.nameOfStudent} onChange={(e) => this.updateReceiptField(index, 'nameOfStudent', e.target.value)} className="edit-field" />
                        <input type="number" value={receipt.amountPaid} onChange={(e) => this.updateReceiptField(index, 'amountPaid', e.target.value)} className="edit-field" />
                        <select value={receipt.modeOfPayment} onChange={(e) => this.updateReceiptField(index, 'modeOfPayment', e.target.value)} className="edit-field">
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Cash">Cash</option>
                            <option value="Check">Check</option>
                        </select>
                    </>
                ) : (
                    <>
                        <div>Date of Payment: {receipt.dateOfPayment}</div>
                        <div>Receipt No: {receipt.receiptNo}</div>
                        <div>Name of Student: {receipt.nameOfStudent}</div>
                        <div>Amount Paid: {receipt.amountPaid}</div>
                        <div>Mode of Payment: {receipt.modeOfPayment}</div>
                    </>
                )}
                <div className="receipt-actions">
                    <button onClick={() => this.handleEdit(index)} className="edit-button text-white" style={{ backgroundColor: '#2D5990' }}>
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button onClick={() => this.handleDownload(receipt)} className="download-button text-white" disabled={isEditing} style={{ backgroundColor: '#2D5990' }}>
                        Download Receipt
                    </button>
                </div>
            </div>
        );
    };

    render() {
        return (
            <>
            <Navbar/>
            <div className="receipts-container">
                {this.state.receipts.map((receipt, index) => this.renderReceiptCard(receipt, index))}
            </div>
            </>
        );
    }
}

export default ListReceipts;