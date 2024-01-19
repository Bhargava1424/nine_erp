# SchoolManagementSystemApi.AuthorizationApi

All URIs are relative to *http://localhost:8080/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**login**](AuthorizationApi.md#login) | **POST** /login | Login

<a name="login"></a>
# **login**
> Response login(body)

Login

Login to the system.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.AuthorizationApi();
let body = new SchoolManagementSystemApi.LoginRequest(); // LoginRequest | 

apiInstance.login(body, (error, data, response) => {
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
 **body** | [**LoginRequest**](LoginRequest.md)|  | 

### Return type

[**Response**](Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

