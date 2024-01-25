# SchoolManagementSystemApi.ReceiptsApi

All URIs are relative to *http://34.125.142.249:5000/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**receiptsPost**](ReceiptsApi.md#receiptsPost) | **POST** /receipt/create | Create a new receipt

<a name="receiptsPost"></a>
# **receiptsPost**
> Response receiptsPost(body)

Create a new receipt

Add a new receipt to the system.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.ReceiptsApi();
let body = new SchoolManagementSystemApi.ReceiptCreateRequest(); // ReceiptCreateRequest | 

apiInstance.receiptsPost(body, (error, data, response) => {
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
 **body** | [**ReceiptCreateRequest**](ReceiptCreateRequest.md)|  | 

### Return type

[**Response**](Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

