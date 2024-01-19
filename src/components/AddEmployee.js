
import Navbar from './Navbar'; // Adjust the import path if necessary
import React, { useState, useEffect } from 'react';


function SelectField({ label, name, options, value, handleChange }) {
  return (
    <div>
      <label htmlFor={name} className="block text-lg font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <select
        required
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:text-white"
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          // Ensure `option` has a unique identifier, such as an ID
          <option key={option._id || option} value={option.value || option}>{option.label || option}</option>
        ))}
      </select>
    </div>
  );
}


function AddEmployee() {
  const [employeeData, setEmployeeData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    phoneNumber: '',
    branch: '',
    username: '',
    password: '',
  });

  const [showInstructions, setShowInstructions] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
    
    // Clear errors when the user starts correcting them
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateField = (name, value) => {
    let errMsg = '';
    switch (name) {
      case 'phoneNumber':
        if (!/^\d{10}$/.test(value)) {
          errMsg = 'Phone number must be 10 digits';
        }
        break;
      case 'username':
        if (!/\S+@\S+\.\S+/.test(value)) {
          errMsg = 'Username must be in email format';
        }
        break;
      // Add additional cases for other field validations
      default:
        break;
    }
    return errMsg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if it's already submitting, if so, then return
    if (isSubmitting) {
      return;
    }
  
    // Validate form data
    let isValid = true;
    let newErrors = {};
    Object.keys(employeeData).forEach(key => {
      if (!employeeData[key]) {
        isValid = false;
        newErrors[key] = 'This field is required';
      } else {
        const fieldError = validateField(key, employeeData[key]);
        if (fieldError) {
          isValid = false;
          newErrors[key] = fieldError;
        }
      }
    });
  
    // If form is not valid, set errors and return early
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
  
    // Set submitting state to true
    setIsSubmitting(true);
  
    // Make the POST request
    try {
      var SchoolManagementSystemApi = require('school_management_system_api');
      var api = new SchoolManagementSystemApi.EmployeesApi();
      var body = new SchoolManagementSystemApi.Employee();
      body.employeeName = employeeData.firstName +'' +  employeeData.lastName;
      body.role = employeeData.role;
      body.branch = employeeData.branch;
      body.username = employeeData.username;
      body.password = employeeData.password;
      console.log('Employee Request Body', body); // Logging the constructed branch object
      
      api.employeesPost(body, function(error, data, response) {
        if (error) {
          console.error('API Error:', error);
        } else {
          try {
            const responseBody = response.body; // Assuming response.body is already in JSON format
            console.log(responseBody);
            setShowSuccessMessage(true);
            // setBranches(responseBody); // Assuming the actual data is in responseBody.data
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
          }
        }
      });
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('There was an error!', error);
    } finally {
      // Set submitting state to false
      setIsSubmitting(false);
    }
  };
  
  
  
  

  // Additional handler to restrict input to digits only
  const handleNumberInput = (e) => {
    const validNumber = e.target.value.replace(/\D/g, '');
    setEmployeeData({ ...employeeData, [e.target.name]: validNumber });
  };

  // Handler to restrict name input to alphabets only
  const handleNameInput = (e) => {
    const validName = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setEmployeeData({ ...employeeData, [e.target.name]: validName });
  };
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.DbApi();
        const opts = {
          body: {
            "collectionName": "branches",
            "query": {
            },
            "type": 'findMany'
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
              setBranches(responseBody); // Assuming the actual data is in responseBody.data
            } catch (parseError) {
              console.error('Error parsing response:', parseError);
            }
          }
        });
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };
    fetchBranches();

    
  }, []);
  
  


  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
        <div className="flex items-center mb-4">
          <input type="checkbox" className="toggle" checked={showInstructions} onChange={() => setShowInstructions(!showInstructions)} />
          <span className="ml-2">Show Instructions</span>
        </div>
        {showInstructions && (
          <div role="alert" className="alert alert-info mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <ul className="list-disc list-inside ml-4">
                <li>Fill in all the details to add a new employee.</li>
                <li>Username should be in email format (e.g., john.doe@example.com).</li>
                <li>Phone number must be 10 digits long.</li>
              </ul>
            </div>
          </div>
        )}
        {showSuccessMessage && (
        <div role="alert" className="alert alert-success">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Submission Successful!</span>
            </div>
        </div>
    )}
        <form onSubmit={handleSubmit} className="space-y-6 bg-dark-blue p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... existing input fields */}
            <InputField label="First Name" name="firstName" value={employeeData.firstName} handleChange={handleNameInput} />
            <InputField label="Last Name" name="lastName" value={employeeData.lastName} handleChange={handleNameInput} />
            <SelectField label="Role" name="role" options={['Manager', 'Executive', 'Accountant']} value={employeeData.role} handleChange={handleChange} />
            <InputField label="Phone Number" name="phoneNumber" type="tel" pattern="\d*" value={employeeData.phoneNumber} handleChange={handleNumberInput} error={errors.phoneNumber} />
            <SelectField
              label="Branch"
              name="branch"
              options={branches.map(branch => branch.branchName)} // Assuming branchName is the field you want to display
              value={employeeData.branch}
              handleChange={handleChange}
            />
            <InputField label="Username" name="username" type="email" value={employeeData.username} handleChange={handleChange} error={errors.username} />
            <InputField label="Password" name="password" type="password" value={employeeData.password} handleChange={handleChange} />
          </div>
          <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-lg px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Employee
          </button>

          </div>
        </form>
      </div>
    </>
  );
}

function InputField({ label, name, type = 'text', value, handleChange, error }) {
  return (
    <div>
      <label htmlFor={name} className="block text-lg font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <input 
        required
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm text-lg h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-bg dark:text-white ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-sm italic">{error}</p>}
    </div>
  );
}




export default AddEmployee;
