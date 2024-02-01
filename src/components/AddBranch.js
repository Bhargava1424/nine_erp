import Navbar from './Navbar'; // Adjust the import path if necessary
import React, { useState, useEffect } from 'react';

function AddBranch() {
  const [branchData, setBranchData] = useState({
    branchName: '',
    branchCode: '',
    branchAddress: '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [branches, setBranches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBranches, setFilteredBranches] = useState([]);
    // State for managing edit functionality
    const [editingBranch, setEditingBranch] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
    // Function to open the edit modal with the selected Branch's data
    const openEditModal = (Branch) => {
      setEditingBranch({ ...Branch });
      setIsEditModalOpen(true);
    };
  
    // Function to handle field changes in the edit modal
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      let updatedValue = value;
      let newErrors = { ...errors };   
      // Allow only alphabets in name fields and automatically capitalize them
      if (name === "branchName") {
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
      }
    
      // Allow only numbers in the phone number field
      if (name === "branchCode") {
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
        if (updatedValue.length !== 3) {
          newErrors.branchCode = 'Branch Code must be 3 digits.';
        } else {
          newErrors.branchCode = '';
        }
      }
    
      // Update state with validated and transformed values
      setEditingBranch({ ...editingBranch, [name]: updatedValue });
    
      // Additional validation for phone number length on submit
      if (name === "branchCode" && updatedValue.length !== 3) {
        setErrors({ ...errors, branchCode: 'Branch Code must be 3 digits.' });
      } else {
        setErrors({ ...errors, branchCode: '' });
      }
    };
    
  
    // Function to submit the edited Branch data
    const handleEditSubmit = async (e) => {
      e.preventDefault();
      // Check for errors before submitting
      if (errors.branchCode) {
        alert("Please correct the errors before submitting.");
        return;
      }
    
      try {
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.DbApi();
        const opts = {
          body: {
            "collectionName": "branches",
            "query": {
              "branchId": editingBranch.branchId // Use the Branch's _id to identify the document to update
            },
            "type": 'updateOne',
            "update": {
              "branchName": editingBranch.branchName,
              "branchCode": editingBranch.branchCode,
              "branchAddress": editingBranch.branchAddress,
              // Include other fields that need to be updated
            }
          }
        };
    
        api.dbUpdate(opts, function(error, data, response) {
          if (error) {
            console.error('API Error:', error);
          } else {
            // Handle successful update here
            // For example, you can close the edit modal and clear the editing state
            setIsEditModalOpen(false);
            setEditingBranch(null);
            // Reload the Branch list or use another method to update the UI
            alert("Branches Updated Successfully")
            window.location.reload()
          }
        });
      } catch (error) {
        console.error('There was an error updating the Branch!', error);
      }
    };
    

    const handleChange = (e) => {
      const { name, value } = e.target;
      let updatedValue = value;
      let newErrors = { ...errors };
    
      // Allow only alphabets in name fields and automatically capitalize them
      if (name === "branchName") {
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
      }
    
      // Allow only numbers in the branch code field and automatically capitalize them
      if (name === "branchCode") {
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
        if (updatedValue.length !== 3) {
          newErrors.branchCode = 'Branch Code must be 3 digits.';
        } else {
          newErrors.branchCode = '';
        }
      }
    
      // Update state with validated and transformed values
      setBranchData({ ...branchData, [name]: updatedValue });
    
      // Update errors
      setErrors(newErrors);
    };
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    let newErrors = {};

    // Check for empty fields
    Object.keys(branchData).forEach((key) => {
      if (!branchData[key]) {
        isValid = false;
        newErrors[key] = 'This field is required';
      }
    });
      // Additional check for branch code length
  if (branchData.branchCode.length !== 3) {
    isValid = false;
    newErrors.branchCode = 'Branch Code must be 3 digits.';
  }

    setErrors(newErrors);

    if (isValid) {
      console.log(branchData); // Logging the branch data before submission
      try {
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.BranchesApi();
        var body = new SchoolManagementSystemApi.Branch();
        SchoolManagementSystemApi.Branch.constructFromObject(branchData, body);

        console.log(body); // Logging the constructed branch object

        api.branchesPost(body, function (error, data, response) {
          if (error) {
            console.error('API Error:', error);
          } else {
            // console.log('API Response:', response); // Log the full HTTP response
            try {
              var responseBody = JSON.parse(response.text); // Parsing the response text to JSON
              if (responseBody && responseBody.message) {
                console.log('Message:', responseBody.message); // Logging the message from the response
              }
            } catch (parseError) {
              console.error('Error parsing response:', parseError);
            }

            // Refresh the branches data after adding a new branch
            fetchBranches();

            setShowSuccessMessage(true);
            setTimeout(() => {
              setShowSuccessMessage(false);
            }, 3000);
            alert("Branch Added Successfully")
            window.location.reload()
          }
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }else{
      alert("Enter The fields in Proper Format")
    }
  };

  const fetchBranches = async () => {
    try {
      var SchoolManagementSystemApi = require('school_management_system_api');
      var api = new SchoolManagementSystemApi.DbApi();
      const opts = {
        body: {
          collectionName: 'branches',
          query: {},
          type: 'findMany',
        },
      };

      console.log(opts.body);

      api.dbGet(opts, function (error, data, response) {
        if (error) {
          console.error('API Error:', error);
        } else {
          try {
            const responseBody = response.body; // Assuming response.body is already in JSON format
            console.log(responseBody);
            setBranches(responseBody); // Assuming the actual data is in responseBody.data
            setFilteredBranches(responseBody); // Initialize filteredBranches with the initial data
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = branches.filter((branch) => {
      return (
        branch.branchName.toLowerCase().includes(query) ||
        branch.branchCode.toLowerCase().includes(query) ||
        branch.branchAddress.toLowerCase().includes(query)
        // Add other fields if needed
      );
    });

    setFilteredBranches(filtered);
  };

  return (
    <div className='root-container'>
      
      <Navbar />
      <div className="container mx-auto p-4">
      <div className="flex justify-center items-center">
          <h2 className="text-2xl font-bold text-black-500 mb-4">ADD BRANCH</h2>
      </div>
        {showSuccessMessage && (
          <div role="alert" className="alert alert-success">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Branch Added Successfully!</span>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          
        >
          <InputField
            label="Branch Name"
            name="branchName"
            value={branchData.branchName}
            handleChange={handleChange}
            error={errors.branchName}
            className='b'
          />
          <InputField
            label="Branch Code"
            name="branchCode"
            value={branchData.branchCode}
            handleChange={handleChange}
            error={errors.branchCode}
          />
          <InputField
            label="Branch Address"
            name="branchAddress"
            value={branchData.branchAddress}
            handleChange={handleChange}
            error={errors.branchAddress}
          />

          <div className="mt-4">
                <button
                  className="btn btn-outline text-white"
                  style={{ backgroundColor: '#2D5990' }}
                >
                  Add Branch
                </button>
              </div>

        </form>
        <div className="container mx-auto p-4 relative mt-6"> {/* Add relative positioning */}
    <h2 className="text-2xl font-bold text-center mb-4">Branches List</h2>
        {/* Search Bar */}
        <input
          type="text"
          className="input input-bordered max-w-xs absolute right-4 top-4" 
          placeholder="Search branches..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        {/* Branches Table */}
        <div className="overflow-x-auto mt-4">
          <table className="table w-full">
            <thead>
              <tr style={{ backgroundColor: '#2D5990', color: '#FFFFFF' }}>
                <th className="px-4 py-2">Branch Address</th>
                <th className="px-4 py-2">Branch Name</th>
                <th className="px-4 py-2">Branch Code</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch, index) => (
                <tr className="odd:bg-[#FFFFFF] even:bg-[#F2F2F2]" key={index}>
                  <td className="border px-4 py-2">{branch.branchAddress}</td>
                  <td className="border px-4 py-2">{branch.branchName}</td>
                  <td className="border px-4 py-2">{branch.branchCode}</td>
                  <td className="border px-4 py-2">
                    <button onClick={() => openEditModal(branch)} style={{ color: "#2D5990" }}>
                        <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      {isEditModalOpen && (
        <div className="edit-modal">
          {/* Edit form layout */}
          <h3 className="text-lg font-semibold mb-4">Editing Branch Details</h3>
        <h3 className="text-lg font-semibold mb-4">Branch Id:{editingBranch.branchId}</h3>

          <form onSubmit={handleEditSubmit}>
            {/* Include InputField components for each editable field */}

              <label className="form-control">
                <span className="label-text">Branch Name</span>
                <input type="text" name="branchName" value={editingBranch.branchName} onChange={handleEditChange} />
              </label>
              <label className="form-control">
                <span className="label-text">Branch Number</span>
                <input type="text" name="branchCode" value={editingBranch.branchCode} onChange={handleEditChange} />
                {errors.branchCode && <h className="text-red-500 text-xs italic">{errors.branchCode}</h>}
              </label>
              <label className="form-control">
                <span className="label-text">Branch Address</span>
                <input type="text" name="branchAddress" value={editingBranch.branchAddress} onChange={handleEditChange} />
              </label>
            {/* ...other input fields as needed */}
            <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={handleEditSubmit}>Submit</button>
            <button className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }} onClick={() => setIsEditModalOpen(false)}>Close</button>
          </form>
        </div>
      )}
    </div>
  );
}

function InputField({ label, name, type = 'text', value, handleChange, error }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="form-control w-1/2 pr-2"
      >
        {label}
      </label>
      <input
        required
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className="input input-bordered w-full max-w-xs bg-[#F2F2F2]"
      />
      {error && <p className="text-red-500 text-sm italic">{error}</p>}
    </div>
  );
}

export default AddBranch;
