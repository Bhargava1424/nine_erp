/*
 * School Management System API
 * APIs for managing branches, employees, students, receipts, etc.
 *
 * OpenAPI spec version: 1.0.0
 * Contact: tejabhargavpodila@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.54
 *
 * Do not edit the class manually.
 *
 */
import ApiClient from './ApiClient';
import AddConcessionRequest from './model/AddConcessionRequest';
import Branch from './model/Branch';
import DbGetRequest from './model/DbGetRequest';
import DbUpdateRequest from './model/DbUpdateRequest';
import Employee from './model/Employee';
import Error from './model/Error';
import LoginRequest from './model/LoginRequest';
import Receipt from './model/Receipt';
import ReceiptCreateRequest from './model/ReceiptCreateRequest';
import Response from './model/Response';
import SendEmailRequest from './model/SendEmailRequest';
import SendPasswordRequest from './model/SendPasswordRequest';
import Student from './model/Student';
import AuthorizationApi from './api/AuthorizationApi';
import BranchesApi from './api/BranchesApi';
import DbApi from './api/DbApi';
import EmployeesApi from './api/EmployeesApi';
import ReceiptsApi from './api/ReceiptsApi';
import StudentsApi from './api/StudentsApi';

/**
* APIs_for_managing_branches_employees_students_receipts_etc_.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var SchoolManagementSystemApi = require('index'); // See note below*.
* var xxxSvc = new SchoolManagementSystemApi.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new SchoolManagementSystemApi.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new SchoolManagementSystemApi.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new SchoolManagementSystemApi.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version 1.0.0
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The AddConcessionRequest model constructor.
     * @property {module:model/AddConcessionRequest}
     */
    AddConcessionRequest,

    /**
     * The Branch model constructor.
     * @property {module:model/Branch}
     */
    Branch,

    /**
     * The DbGetRequest model constructor.
     * @property {module:model/DbGetRequest}
     */
    DbGetRequest,

    /**
     * The DbUpdateRequest model constructor.
     * @property {module:model/DbUpdateRequest}
     */
    DbUpdateRequest,

    /**
     * The Employee model constructor.
     * @property {module:model/Employee}
     */
    Employee,

    /**
     * The Error model constructor.
     * @property {module:model/Error}
     */
    Error,

    /**
     * The LoginRequest model constructor.
     * @property {module:model/LoginRequest}
     */
    LoginRequest,

    /**
     * The Receipt model constructor.
     * @property {module:model/Receipt}
     */
    Receipt,

    /**
     * The ReceiptCreateRequest model constructor.
     * @property {module:model/ReceiptCreateRequest}
     */
    ReceiptCreateRequest,

    /**
     * The Response model constructor.
     * @property {module:model/Response}
     */
    Response,

    /**
     * The SendEmailRequest model constructor.
     * @property {module:model/SendEmailRequest}
     */
    SendEmailRequest,

    /**
     * The SendPasswordRequest model constructor.
     * @property {module:model/SendPasswordRequest}
     */
    SendPasswordRequest,

    /**
     * The Student model constructor.
     * @property {module:model/Student}
     */
    Student,

    /**
    * The AuthorizationApi service constructor.
    * @property {module:api/AuthorizationApi}
    */
    AuthorizationApi,

    /**
    * The BranchesApi service constructor.
    * @property {module:api/BranchesApi}
    */
    BranchesApi,

    /**
    * The DbApi service constructor.
    * @property {module:api/DbApi}
    */
    DbApi,

    /**
    * The EmployeesApi service constructor.
    * @property {module:api/EmployeesApi}
    */
    EmployeesApi,

    /**
    * The ReceiptsApi service constructor.
    * @property {module:api/ReceiptsApi}
    */
    ReceiptsApi,

    /**
    * The StudentsApi service constructor.
    * @property {module:api/StudentsApi}
    */
    StudentsApi
};
