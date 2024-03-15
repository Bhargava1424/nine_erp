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
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define(['expect.js', '../../src/index'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    factory(require('expect.js'), require('../../src/index'));
  } else {
    // Browser globals (root is window)
    factory(root.expect, root.SchoolManagementSystemApi);
  }
}(this, function(expect, SchoolManagementSystemApi) {
  'use strict';

  var instance;

  describe('(package)', function() {
    describe('Employee', function() {
      beforeEach(function() {
        instance = new SchoolManagementSystemApi.Employee();
      });

      it('should create an instance of Employee', function() {
        // TODO: update the code to test Employee
        expect(instance).to.be.a(SchoolManagementSystemApi.Employee);
      });

      it('should have the property employeeName (base name: "employeeName")', function() {
        // TODO: update the code to test the property employeeName
        expect(instance).to.have.property('employeeName');
        // expect(instance.employeeName).to.be(expectedValueLiteral);
      });

      it('should have the property role (base name: "role")', function() {
        // TODO: update the code to test the property role
        expect(instance).to.have.property('role');
        // expect(instance.role).to.be(expectedValueLiteral);
      });

      it('should have the property branch (base name: "branch")', function() {
        // TODO: update the code to test the property branch
        expect(instance).to.have.property('branch');
        // expect(instance.branch).to.be(expectedValueLiteral);
      });

      it('should have the property username (base name: "username")', function() {
        // TODO: update the code to test the property username
        expect(instance).to.have.property('username');
        // expect(instance.username).to.be(expectedValueLiteral);
      });

      it('should have the property password (base name: "password")', function() {
        // TODO: update the code to test the property password
        expect(instance).to.have.property('password');
        // expect(instance.password).to.be(expectedValueLiteral);
      });

      it('should have the property phoneNumber (base name: "phoneNumber")', function() {
        // TODO: update the code to test the property phoneNumber
        expect(instance).to.have.property('phoneNumber');
        // expect(instance.phoneNumber).to.be(expectedValueLiteral);
      });

    });
  });

}));
