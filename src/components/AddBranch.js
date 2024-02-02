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

  const handleChange = (e) => {
    setBranchData({ ...branchData, [e.target.name]: e.target.value });
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
          }
        });
      } catch (error) {
        console.error('Error:', error);
      }
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
    <>
      
      <Navbar />
      <div className="container mx-auto p-4">
          <div className="container mx-auto p-4 text-center">   
            <div className="card bg-slate-600 text-black p-2"> {/* Added padding here */}
              <h2 className="text-2xl font-bold text-white">ADD BRANCH</h2>
            </div>
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
        <div className="flex justify-center whitespace-nowrap p-7 bg-slate-200 mt-4 rounded-3xl" style={{ marginLeft: '450px', marginRight: '450px' }}>
          <form onSubmit={handleSubmit} className="text-center whitespace-nowrap"> {/* Centers form content */}
            <InputField
              label="Branch Name"
              name="branchName"
              value={branchData.branchName}
              handleChange={handleChange}
              error={errors.branchName}
            />
            <InputField
              label="Branch Code"
              name="branchCode"
              value={branchData.branchCode}
              handleChange={handleChange}
              error={errors.branchCode}
            />
            <InputField
              labelClass="whitespace-nowrap" // This will prevent the label from wrapping
              label="Branch Address"
              name="branchAddress"
              value={branchData.branchAddress}
              handleChange={handleChange}
              error={errors.branchAddress}
            />

            <button
              className="btn btn-outline text-white mt-4"
              style={{ backgroundColor: '#2D5990' }}
            >
              Add Branch
            </button>
          </form>
        </div>

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
                <th>Branch Name</th>
                <th>Branch Code</th>
                <th>Branch Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch, index) => (
                <tr className="odd:bg-[#FFFFFF] even:bg-[#F2F2F2]" key={index}>
                  <td>{branch.branchName}</td>
                  <td>{branch.branchCode}</td>
                  <td>{branch.branchAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
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
