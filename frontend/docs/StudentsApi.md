# SchoolManagementSystemApi.StudentsApi

All URIs are relative to *http://localhost:8080/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**studentsPost**](StudentsApi.md#studentsPost) | **POST** /students | Create a new student

<a name="studentsPost"></a>
# **studentsPost**
> Student studentsPost(body)

Create a new student

Add a new student to the system.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.StudentsApi();
let body = new SchoolManagementSystemApi.Student(); // Student | 

apiInstance.studentsPost(body, (error, data, response) => {
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
 **body** | [**Student**](Student.md)|  | 

### Return type

[**Student**](Student.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

