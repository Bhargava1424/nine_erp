import React, { useState , useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const AddStudent = () => {
  const [studentData, setStudentData] = useState({
    firstName: '',
    surName: '',
    fatherName: '',
    branch: '',
    primaryContact: '',
    secondaryContact: '',
    gender: '',
    batch: '',
    dateOfJoining: new Date().toISOString().split('T')[0],
    yearOfJoining: '',
    course: '',
    modeOfResidence: '',
    firstYearTuitionFee: '',
    firstYearHostelFee: '',
    secondYearTuitionFee: '',
    secondYearHostelFee: '',
    pendingFirstYearTuitionFee: 0,
    pendingFirstYearHostelFee: 0,
    pendingSecondYearTuitionFee: 0,
    pendingSecondYearHostelFee: 0,
    paidFirstYearTuitionFee: 0,
    paidFirstYearHostelFee: 0,
    paidSecondYearTuitionFee: 0,
    paidSecondYearHostelFee: 0,
    studentStatus: '',
  });
  const initializeFees = () => {
    setStudentData((prevData) => ({
      ...prevData,
      pendingFirstYearTuitionFee: prevData.firstYearTuitionFee,
      pendingFirstYearHostelFee: prevData.firstYearHostelFee,
      pendingSecondYearTuitionFee: prevData.secondYearTuitionFee,
      pendingSecondYearHostelFee: prevData.secondYearHostelFee,
    }));
  };

  useEffect(() => {
    initializeFees();
  }, []);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({
    primaryContactError: '',
    secondaryContactError: '',
});


const handleInputChange = (e) => {
  const { name, value } = e.target;
  let newErrors = { ...errors };
  let updatedValue = value;

  // Convert firstName, surName, and fatherName to uppercase and allow only alphabets
  if (name === 'firstName' || name === 'surName' || name === 'fatherName') {
    updatedValue = value.toUpperCase().replace(/[^A-Z\s]/g, '');
  }

  // Handling contact numbers validation
  if (name === 'primaryContact' || name === 'secondaryContact') {
      if (value.length !== 10) {
          newErrors[`${name}Error`] = 'Contact number must be 10 digits.';
      } else {
          newErrors[`${name}Error`] = '';
      }

      if (name === 'primaryContact' && value === studentData.secondaryContact) {
          newErrors.secondaryContactError = 'Secondary contact must be different from primary.';
      }
      if (name === 'secondaryContact' && value === studentData.primaryContact) {
          newErrors.secondaryContactError = 'Secondary contact must be different from primary.';
      }
  }

  // Update student data with new values
  setStudentData(prevState => {
      let newState = { ...prevState, [name]: updatedValue };

      // Copy first-year fees to second-year fields and pending fees
      if (name === 'firstYearTuitionFee') {
          newState = { ...newState, secondYearTuitionFee: updatedValue, pendingFirstYearTuitionFee: updatedValue };
      } else if (name === 'firstYearHostelFee') {
          newState = { ...newState, secondYearHostelFee: updatedValue, pendingFirstYearHostelFee: updatedValue };
      }

      // Update pending fees for second-year fields
      if (name === 'secondYearTuitionFee') {
          newState = { ...newState, pendingSecondYearTuitionFee: updatedValue };
      } else if (name === 'secondYearHostelFee') {
          newState = { ...newState, pendingSecondYearHostelFee: updatedValue };
      }

      // Extract the year of joining from batch if batch is changed
      if (name === 'batch') {
          const yearOfJoining = value.substring(0, 4); // Extracting the first four characters
          newState = { ...newState, yearOfJoining: yearOfJoining };
      }

      return newState;
  });

  // Update errors
  setErrors(newErrors);
};



  const validateInput = (name, value) => {
    if (name === 'primaryContact' || name === 'secondaryContact') {
      return /^[0-9]*$/.test(value);
    }
    if (name === 'firstName' || name === 'surName' || name === 'fatherName') {
      return /^[a-zA-Z\s]*$/.test(value);
    }
    return true;
  };

  const [isOnTC, setIsOnTC] = useState(false);


  const validateForm = () => {
    // Skip validation for 1st year fees if batch is 'On TC'
    if (!isOnTC) {
      if (!studentData.firstYearTuitionFee || !studentData.firstYearHostelFee) {
          alert('Please fill in all required fields.');
          return false;
      }
    }

    // Validate other fields as normal
    if (!studentData.firstName.trim() ||
        !studentData.surName.trim() ||
        !studentData.fatherName.trim() || 
        !studentData.primaryContact.trim() || 
        !studentData.secondaryContact.trim() || 
        !studentData.gender || 
        !studentData.studentStatus || 
        !studentData.batch || 
        !studentData.branch || 
        !studentData.dateOfJoining ||   
        !studentData.course || 
        !studentData.modeOfResidence || 
        !studentData.secondYearTuitionFee || 
        !studentData.secondYearHostelFee || 
        !studentData.studentStatus) {
        alert('Please fill in all required fields.');
        return false;
    }

  
    // Additional validation logic can be added here
    // For example, checking if the contact fields contain only numbers
  
    // If all validations pass
    return true;
  };
  
  const handleSubmit = async (e) => {
    console.log('Form Data:', studentData);
    e.preventDefault();
    if (validateForm()) {
      const updatedStudentData = {
          ...studentData,
          pendingFirstYearTuitionFee: studentData.firstYearTuitionFee,
          pendingFirstYearHostelFee: studentData.firstYearHostelFee,
          pendingSecondYearTuitionFee: studentData.secondYearTuitionFee,
          pendingSecondYearHostelFee: studentData.secondYearHostelFee
      };
        try {
            // Replace with your backend server URL and appropriate endpoint
            const response = await axios.post('http://localhost:5000/api/students/add', updatedStudentData);
            

            if (response.status === 200) {
                console.log('Form Submission Successful:', response.data);
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 3000);
            } else {
                console.error('Server responded with non-200 status:', response.status);
            }
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    } else {
        console.error('Validation failed');
    }
  };
  const generateBatchOptions = () => {
    const startYear = 2022;
    const endYear = 2048;
    const options = [];

    for (let year = startYear; year <= endYear; year++) {
      options.push(`${year}-${year + 2}`);
    }

    return options;
  };
    
  const [branches, setBranches] = useState([]);
  

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/branch');
        if (response.ok) {
          const data = await response.json();
          setBranches(data);
        } else {
          console.error('Failed to fetch branches');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchBranches();
  }, []);

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4">      
      <h2 className="text-2xl font-bold mb-4">Add Student</h2>
      <div className="AddStudent">


        {/* Rest of your form code */}
    </div> 
    
      <input
        type="checkbox"
        className="toggle toggle-success"
        checked={showInstructions}
        onChange={() => setShowInstructions(!showInstructions)}
      /><span className="ml-2">Toggle for instructions</span> 
      {showInstructions && (
        <div className="instructions bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p className="font-bold">Please Read Before Filling Out the Form</p>
          <ul className="list-disc list-inside">
            <li><strong>Student Name:</strong> Enter the student's name exactly as it appears on their 10th certificate.</li>
            <li><strong>Father's Name:</strong> Enter the father's name as per the student's 10th certificate.</li>
            <li><strong>Primary and Secondary Contact:</strong> Only numeric values are allowed. Do not include spaces or special characters.</li>
            <li><strong>Gender:</strong> Select the appropriate gender from the dropdown menu.</li>
            <li><strong>Batch:</strong> Choose the relevant batch. Note: If 'On TC' is selected, the fields for 1st year tuition and hostel fees will be disabled.</li>
            <li><strong>Date of Joining:</strong> Select the date from the calendar. The 'Year of Joining' will automatically update based on this date.</li>
            <li><strong>Course:</strong> Select the course the student is enrolling in (MPC/BiPC).</li>
            <li><strong>Mode of Residence:</strong> Choose between 'Day Scholar' and 'Hostel'.</li>
            <li><strong>Tuition and Hostel Fees:</strong> Enter the fees for the 1st and 2nd years. Note: 2nd year fees initially mirror the 1st year's but can be modified.</li>
            <li>All fields must be filled out and validated before submission. Ensure that all information is accurate and complete.</li>
          </ul>
      </div>
      )}

      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-4">
        <div className="flex justify-between space-x-1">        {/* First Name and last name Field */}
          <label className="form-control w-1/2 pr-2">
            <div className="label">
              <span className="label-text">Student's First Name</span>
            </div>
            <input
              type="text"
              placeholder="Student's First Name"
              className="input input-bordered w-full max-w-xs"
              name="firstName"
              value={studentData.firstName}
              onChange={(e) => {
                if (validateInput(e.target.name, e.target.value)) {
                  handleInputChange(e);
                }
              }}
            />
            <span className="label-text-alt" style={{ fontSize: '15px' }}>⚠ Name according to 10th certificate</span>
          </label>

          {/* surName Name Field */}
          <label className="form-control w-1/2 pr-2">
            <div className="label">
              <span className="label-text">Student's Surname</span>
            </div>
            <input
              type="text"
              placeholder="Student's Surname"
              className="input input-bordered w-full max-w-xs"
              name="surName"
              value={studentData.surName}
              onChange={(e) => {
                if (validateInput(e.target.name, e.target.value)) {
                  handleInputChange(e);
                }
              }}
            />
            <span className="label-text-alt" style={{ fontSize: '15px' }}>⚠ Name according to 10th certificate</span>
          </label>
        </div>
        <div className="flex justify-between space-x-1">        {/* father Name and branch Field */}
          <label className="form-control w-1/2 pr-2">
            <div className="label">
              <span className="label-text">Father's Name</span>
            </div>
            <input
              type="text"
              placeholder="Father's Name"
              className="input input-bordered w-full max-w-xs"
              name="fatherName"
              value={studentData.fatherName}
              onChange={(e) => {
                if (validateInput(e.target.name, e.target.value)) {
                  handleInputChange(e);
                }
              }}
            />
            <span className="label-text-alt" style={{ fontSize: '15px' }}>⚠ Father's name according to 10th certificate</span>
          </label>

          {/* branch Name Field */}
          <label className="form-control w-1/2 pr-2">
            <div className="label">
              <span className="label-text">Branch</span>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              name="branch"
              value={studentData.branch}
              onChange={handleInputChange}
            >
              <option value="" disabled>Choose Branch</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch.branchCode}>{branch.branchName} ({branch.branchCode})</option>
              ))}
            </select>
          </label>

        </div>
        <div className="flex justify-between space-x-1">        {/* Primary Contact Field */}
          <label className="form-control w-1/2 pr-2">
            <div className="label">
              <span className="label-text">Primary Contact</span>
            </div>
            <input
              type="text"
              placeholder="Primary Contact"
              className="input input-bordered w-full max-w-xs"
              name="primaryContact"
              value={studentData.primaryContact}
              onChange={(e) => {
                if (validateInput(e.target.name, e.target.value)) {
                  handleInputChange(e);
                }
              }}
            />  
            {errors.secondaryContactError && <span className="text-red-500">{errors.secondaryContactError}</span>}      
          </label>
          {/* Secondary Contact Field */}
          <label className="form-control w-1/2 pr-2">
            <div className="label">
              <span className="label-text">Secondary Contact</span>
            </div>
            <input
              type="text"
              placeholder="Secondary Contact"
              className="input input-bordered w-full max-w-xs"
              name="secondaryContact"
              value={studentData.secondaryContact}
              onChange={(e) => {
                if (validateInput(e.target.name, e.target.value)) {
                  handleInputChange(e);
                }
              }}
            />
            {errors.secondaryContactError && <span className="text-red-500">{errors.secondaryContactError}</span>}
          </label>
        </div>
        <div className="flex justify-between space-x-1">        {/* Gender and batch Field */}
          <label className="form-control w-1/2 pr-2">
              <div className="label">
                  <span className="label-text">Gender</span>
              </div>
              <select
                  className="select select-bordered w-full max-w-xs"
                  name="gender"
                  value={studentData.gender}
                  onChange={handleInputChange}
              >
                  <option value="" disabled>Choose Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
              </select>
          </label>

          {/* Batch Field */}
          <label className="form-control w-1/2 pr-2">
            <div className="label">
              <span className="label-text">Batch</span>
            </div>
            <select
              className="select select-bordered w-full max-w-xs"
              name="batch"
              value={studentData.batch}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Batch</option>
              {generateBatchOptions().map(batch => (
                <option key={batch} value={batch}>{batch}</option>
              ))}
            </select>
          </label>

        </div>
        <div className="flex justify-between space-x-1">        {/* Date of Joining Field */}
                <label className="form-control w-1/2 pr-2">
                  <div className="label">
                    <span className="label-text">Date of Joining</span>
                  </div>
                  <div className="rounded border border-gray-400 p-2 w-3/4">
                    <span className="text-gray-700">{new Date().toISOString().split('T')[0]}</span>
                  </div>
                </label>

                {/* Year of Joining Field (Read-only) */}
                <label className="form-control w-1/2 pr-2">
                    <div className="label">
                        <span className="label-text">Year of Joining</span>
                    </div>
                    <input
                        type="text"
                        className="input input-bordered w-full max-w-xs"
                        name="yearOfJoining"
                        value={studentData.yearOfJoining}
                        readOnly // This makes the field read-only
                    />
                </label>

        </div>
        <div className="flex justify-between space-x-1">        {/* Course Field */}
          <label className="form-control w-1/2 pr-2">
              <div className="label">
                  <span className="label-text">Course</span>
              </div>
              <select
                  className="select select-bordered w-full max-w-xs"
                  name="course"
                  value={studentData.course}
                  onChange={handleInputChange}
              >
                  <option value="" disabled>Select Course</option>
                  <option value="MPC">MPC</option>
                  <option value="BiPC">BiPC</option>
              </select>
          </label>


          {/* Mode of Residence Field */}
          <label className="form-control w-1/2 pr-2">
              <div className="label">
                  <span className="label-text">Mode of Residence</span>
              </div>
              <select
                  className="select select-bordered w-full max-w-xs"
                  name="modeOfResidence"
                  value={studentData.modeOfResidence}
                  onChange={handleInputChange}
              >
                  <option value="" disabled>Select Mode of Residence</option>
                  <option value="Day Scholar">Day Scholar</option>
                  <option value="Hostel">Hostel</option>
              </select>
          </label>
        </div>                                              
        <div className="form-control flex">                     {/* on TC Field */}
          <label className="mr-2">On TC?</label>
          <input
            type="checkbox"
            className="checkbox"
            checked={isOnTC}
            onChange={(e) => setIsOnTC(e.target.checked)}
          />
        </div>
        <div className="flex justify-between space-x-1">        {/* 1 Tuition and Hostel Fees Fields */}
                <label className="form-control w-1/2 pr-2">
                  <div className="label">
                    <span className="label-text">1st Year Tuition Fee</span>
                  </div>
                  <input
                    type="number"
                    placeholder="1st Year Tuition Fee"
                    className="input input-bordered w-full max-w-xs"
                    name="firstYearTuitionFee"
                    value={studentData.firstYearTuitionFee}
                    onChange={handleInputChange}
                    disabled={isOnTC}
                  />
                </label>
                <label className="form-control w-1/2 pr-2">
                  <div className="label">
                    <span className="label-text">1st Year Hostel Fee</span>
                  </div>
                  <input
                    type="number"
                    placeholder="1st Year Hostel Fee"
                    className="input input-bordered w-full max-w-xs"
                    name="firstYearHostelFee"
                    value={studentData.firstYearHostelFee}
                    onChange={handleInputChange}
                    disabled={isOnTC}
                  />
                </label>
        </div>
        <div className="flex justify-between space-x-1">        {/* 2 Tuition and Hostel Fees Fields */}
                <label className="form-control w-1/2 pr-2">
                  <div className="label">
                    <span className="label-text">2nd Year Tuition Fee</span>
                  </div>
                  <input
                    type="number"
                    placeholder="2nd Year Tuition Fee"
                    className="input input-bordered w-full max-w-xs"
                    name="secondYearTuitionFee"
                    value={studentData.secondYearTuitionFee}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="form-control w-1/2 pr-2">
                  <div className="label">
                    <span className="label-text">2nd Year Hostel Fee</span>
                  </div>
                  <input
                    type="number"
                    placeholder="2nd Year Hostel Fee"
                    className="input input-bordered w-full max-w-xs"
                    name="secondYearHostelFee"
                    value={studentData.secondYearHostelFee}
                    onChange={handleInputChange}
                  />
                </label>
        </div>
        <div className="flex justify-between space-x-1">        {/* active status Field */}
          <label className="form-control w-1/2 pr-2">
              <div className="label">
                  <span className="label-text">Student Status</span>
              </div>
              <select
                  className="select select-bordered w-full max-w-xs"
                  name="studentStatus"
                  value={studentData.studentStatus}
                  onChange={handleInputChange}
              >
                  <option value="" disabled>Choose Student Status</option>
                  <option value="active">ACTIVE</option>
                  <option value="cancelled">CANCELLED</option>
              </select>
          </label>
        </div>

        
        {showSuccessMessage && (
            <div role="alert" className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Submission Successful!</span>
            </div>
        )}
        {/* Submit Button */}
        <button type="submit"  className="btn btn-outline text-white" style={{ backgroundColor: '#2D5990' }}>
          Submit
        </button>
      </form>
    </div>
  
    </>
  );
};

export default AddStudent;
