# SchoolManagementSystemApi.DbApi

All URIs are relative to *http://localhost:5000/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**dbGet**](DbApi.md#dbGet) | **POST** /db/get | Retrieve all data from database
[**dbUpdate**](DbApi.md#dbUpdate) | **POST** /db/update | Update data in database
[**getExcel**](DbApi.md#getExcel) | **POST** /db/get_excel | Retrieve all data from database

<a name="dbGet"></a>
# **dbGet**
> Response dbGet(opts)

Retrieve all data from database

Get a list of all data from database.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.DbApi();
let opts = { 
  'body': new SchoolManagementSystemApi.DbGetRequest() // DbGetRequest | 
};
apiInstance.dbGet(opts, (error, data, response) => {
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
 **body** | [**DbGetRequest**](DbGetRequest.md)|  | [optional] 

### Return type

[**Response**](Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="dbUpdate"></a>
# **dbUpdate**
> Response dbUpdate(opts)

Update data in database

Update data in database.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.DbApi();
let opts = { 
  'body': new SchoolManagementSystemApi.DbUpdateRequest() // DbUpdateRequest | 
};
apiInstance.dbUpdate(opts, (error, data, response) => {
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
 **body** | [**DbUpdateRequest**](DbUpdateRequest.md)|  | [optional] 

### Return type

[**Response**](Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getExcel"></a>
# **getExcel**
> Response getExcel(opts)

Retrieve all data from database

Get a list of all data from database.

### Example
```javascript
import {SchoolManagementSystemApi} from 'school_management_system_api';

let apiInstance = new SchoolManagementSystemApi.DbApi();
let opts = { 
  'body': new SchoolManagementSystemApi.DbGetRequest() // DbGetRequest | 
};
apiInstance.getExcel(opts, (error, data, response) => {
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
 **body** | [**DbGetRequest**](DbGetRequest.md)|  | [optional] 

### Return type

[**Response**](Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

