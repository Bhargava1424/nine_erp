const handleEditSubmit = () => {
  
    if (editingReceipt.modeOfPayment === 'Cheque' && !editingReceipt.chequeNumber) {
      alert("Please enter the Cheque Number.");
      return; // Halt execution if the condition is not met
    }
  
    // Calculate the difference between the new and previous amounts paid
    const previousAmountPaid = editingReceipt[PaidfeeType] || 0; // Get the previous amount from the editing receipt
    const newAmountPaid = updatedReceipt.amountPaid; // Get the new amount from the updated receipt form
    const amountDifference = newAmountPaid - previousAmountPaid;
  
    // Prepare update data for the total paid and pending fees
    let totalPaidField = PaidfeeType.replace('Paid', 'TotalTuitionFeePaid'); // Adjust this line to match your field naming pattern
    let pendingField = PaidfeeType.replace('Paid', 'TotalTuitionFeePending'); // Adjust this line to match your field naming pattern
  
    // Update the total paid and pending amounts
    editingReceipt[totalPaidField] = (editingReceipt[totalPaidField] || 0) + amountDifference;
    editingReceipt[pendingField] = (editingReceipt[pendingField] || 0) - amountDifference;
  
    // Ensure the pending amount does not go below 0
    editingReceipt[pendingField] = Math.max(0, editingReceipt[pendingField]);
  
    const updateData = {
      modeOfPayment: editingReceipt.modeOfPayment,
      chequeNumber: editingReceipt.chequeNumber,
      [PaidfeeType]: updatedReceipt.amountPaid, // Update the specific paid field
      [totalPaidField]: editingReceipt[totalPaidField], // Update the total paid field
      [pendingField]: editingReceipt[pendingField] // Update the pending field
    };
  
    try {
      var SchoolManagementSystemApi = require('school_management_system_api');
      var api = new SchoolManagementSystemApi.DbApi();
      const opts = {
        body: {
          "collectionName": "receipts",
          "query": { 'receiptNumber': editingReceipt.receiptNumber },
          "type": 'updateOne',
          "update": updateData
        }
      };
  
      api.dbUpdate(opts, function (error, data, response) {
        if (error) {
          console.error('API Error:', error);
        } else {
          console.log('Update successful:', response.body);
          setIsEditModalOpen(false);
          setEditingReceipt(null);
          fetchReceipts();
        }
      });
    } catch (error) {
      console.error("Error updating receipt: ", error);
    }
  };