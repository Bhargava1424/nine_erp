
import Navbar from './Navbar'; // Adjust the import path if necessary
import React, { useState, useEffect } from 'react';


function SelectField({ label, name, options, value, handleChange }) {
  return (
    <div>
      <label htmlFor={name} className="form-control w-1/2 pr-2">{label}</label>
      <select
        required
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className="select select-bordered w-full max-w-xs"
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
      body.employeeName = employeeData.firstName +''+  employeeData.lastName;
      body.role = employeeData.role;
      body.branch = employeeData.branch;
      body.username = employeeData.username;
      body.password = employeeData.password;
      body.phoneNumber = employeeData.phoneNumber;
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
  const [employees, setEmployees] = useState([]); 

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        var SchoolManagementSystemApi = require('school_management_system_api');
        var api = new SchoolManagementSystemApi.DbApi();
        const opts = {
          body: {
            "collectionName": "employees",
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
              setEmployees  (responseBody); // Assuming the actual data is in responseBody.data
            } catch (parseError) {
              console.error('Error parsing response:', parseError);
            }
          }
        });
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };

    
    fetchEmployees(); 
    
  }, []);

  const [searchQuery, setSearchQuery] = useState(""); // State for storing the search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to filter employees based on search query
  const filterEmployees = (employees) => {
    if (!searchQuery) {
      return employees; // Return all employees if search query is empty
    }

    const searchTerms = searchQuery.toLowerCase().split(',').map(term => term.trim());
    return employees.filter(employee => 
      searchTerms.some(term => 
        employee.employeeName.toLowerCase().includes(term) ||
        employee.role.toLowerCase().includes(term) ||
        employee.branch.toLowerCase().includes(term)
        // Add other attributes as needed
      )
    );
  };

  const filteredEmployees = filterEmployees(employees);

  
  


  return (
    <>
      <Navbar />

      <div className="container mx-auto p-4 text-center">   
        <div className="card bg-slate-600 text-black p-2"> {/* Added padding here */}
          <h2 className="text-2xl font-bold text-white">ADD EMPLOYEE</h2>
        </div>
      </div>
          
      <div className="container mx-auto p-4">
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


      <div className="flex justify-center whitespace-nowrap p-7 bg-slate-200 mt-4 rounded-3xl" style={{ marginLeft: '350px', marginRight: '350px' }}>

              <form onSubmit={handleSubmit}>
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
                <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}
                >
                  Add Employee
                </button>

                </div>
              </form>


      </div>
        
        <div>
  <div className="container mx-auto p-4 relative mt-6"> {/* Add relative positioning */}
    <h2 className="text-2xl font-bold text-center mb-4">Employees List</h2>
    <input
      type="text"
      placeholder="Search employees..."
      className="input input-bordered max-w-xs absolute right-4 top-4" 
      value={searchQuery}
      onChange={handleSearchChange}
    />
    <div className="overflow-x-auto rounded-3xl p-4">
      <table className="table-auto w-full">
        <thead>
          <tr style={{ backgroundColor: '#2D5990', color: '#FFFFFF' }}>
            <th className="px-4 py-2">Employee Name</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Branch</th>
            {/* Add other headers as needed */}
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr className="odd:bg-[#FFFFFF] even:bg-[#F2F2F2]" key={index}>
              <td className="border px-4 py-2">{employee.employeeName}</td>
              <td className="border px-4 py-2">{employee.role}</td>
              <td className="border px-4 py-2">{employee.phoneNumber}</td>
              <td className="border px-4 py-2">{employee.branch}</td>
              {/* Add other columns as needed */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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




export default AddEmployee;
