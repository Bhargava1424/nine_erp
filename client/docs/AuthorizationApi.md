# SchoolManagementSystemApi.AuthorizationApi

All URIs are relative to *http://localhost:5000/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**login**](AuthorizationApi.md#login) | **POST** /login | Login
[**sendMail**](AuthorizationApi.md#sendMail) | **POST** /send_mail | Send mail
[**sendPassword**](AuthorizationApi.md#sendPassword) | **POST** /send_password | Send password

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

<a name="sendMail"></a>
# **sendMail**
> Response sendMail(body)

Send mail

Send mail.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.AuthorizationApi();
let body = new SchoolManagementSystemApi.SendEmailRequest(); // SendEmailRequest | 

apiInstance.sendMail(body, (error, data, response) => {
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
 **body** | [**SendEmailRequest**](SendEmailRequest.md)|  | 

### Return type

[**Response**](Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="sendPassword"></a>
# **sendPassword**
> Response sendPassword(body)

Send password

Send password.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.AuthorizationApi();
let body = new SchoolManagementSystemApi.SendPasswordRequest(); // SendPasswordRequest | 

apiInstance.sendPassword(body, (error, data, response) => {
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
 **body** | [**SendPasswordRequest**](SendPasswordRequest.md)|  | 

### Return type

[**Response**](Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

