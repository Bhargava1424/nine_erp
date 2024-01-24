# SchoolManagementSystemApi.EmployeesApi

All URIs are relative to *http://localhost:5000/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**employeesPost**](EmployeesApi.md#employeesPost) | **POST** /employees | Create a new employee

<a name="employeesPost"></a>
# **employeesPost**
> Employee employeesPost(body)

Create a new employee

Add a new employee to the system.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.EmployeesApi();
let body = new SchoolManagementSystemApi.Employee(); // Employee | 

apiInstance.employeesPost(body, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Employee**](Employee.md)|  | 

### Return type

[**Employee**](Employee.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

