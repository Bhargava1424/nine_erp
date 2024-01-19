# SchoolManagementSystemApi.BranchesApi

All URIs are relative to *http://localhost:8080/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**branchesPost**](BranchesApi.md#branchesPost) | **POST** /branches | Create a new branch

<a name="branchesPost"></a>
# **branchesPost**
> Branch branchesPost(body)

Create a new branch

Add a new branch to the system.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.BranchesApi();
let body = new SchoolManagementSystemApi.Branch(); // Branch | 

apiInstance.branchesPost(body, (error, data, response) => {
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
 **body** | [**Branch**](Branch.md)|  | 

### Return type

[**Branch**](Branch.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

