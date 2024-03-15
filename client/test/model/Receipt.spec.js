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
    describe('Receipt', function() {
      beforeEach(function() {
        instance = new SchoolManagementSystemApi.Receipt();
      });

      it('should create an instance of Receipt', function() {
        // TODO: update the code to test Receipt
        expect(instance).to.be.a(SchoolManagementSystemApi.Receipt);
      });

      it('should have the property receiptNumber (base name: "receiptNumber")', function() {
        // TODO: update the code to test the property receiptNumber
        expect(instance).to.have.property('receiptNumber');
        // expect(instance.receiptNumber).to.be(expectedValueLiteral);
      });

      it('should have the property dateOfPayment (base name: "dateOfPayment")', function() {
        // TODO: update the code to test the property dateOfPayment
        expect(instance).to.have.property('dateOfPayment');
        // expect(instance.dateOfPayment).to.be(expectedValueLiteral);
      });

      it('should have the property dateISO (base name: "dateISO")', function() {
        // TODO: update the code to test the property dateISO
        expect(instance).to.have.property('dateISO');
        // expect(instance.dateISO).to.be(expectedValueLiteral);
      });

      it('should have the property studentName (base name: "studentName")', function() {
        // TODO: update the code to test the property studentName
        expect(instance).to.have.property('studentName');
        // expect(instance.studentName).to.be(expectedValueLiteral);
      });

      it('should have the property parentName (base name: "parentName")', function() {
        // TODO: update the code to test the property parentName
        expect(instance).to.have.property('parentName');
        // expect(instance.parentName).to.be(expectedValueLiteral);
      });

      it('should have the property applicationNumber (base name: "applicationNumber")', function() {
        // TODO: update the code to test the property applicationNumber
        expect(instance).to.have.property('applicationNumber');
        // expect(instance.applicationNumber).to.be(expectedValueLiteral);
      });

      it('should have the property registeredMobileNumber (base name: "registeredMobileNumber")', function() {
        // TODO: update the code to test the property registeredMobileNumber
        expect(instance).to.have.property('registeredMobileNumber');
        // expect(instance.registeredMobileNumber).to.be(expectedValueLiteral);
      });

      it('should have the property batch (base name: "batch")', function() {
        // TODO: update the code to test the property batch
        expect(instance).to.have.property('batch');
        // expect(instance.batch).to.be(expectedValueLiteral);
      });

      it('should have the property dateOfJoining (base name: "dateOfJoining")', function() {
        // TODO: update the code to test the property dateOfJoining
        expect(instance).to.have.property('dateOfJoining');
        // expect(instance.dateOfJoining).to.be(expectedValueLiteral);
      });

      it('should have the property stream (base name: "stream")', function() {
        // TODO: update the code to test the property stream
        expect(instance).to.have.property('stream');
        // expect(instance.stream).to.be(expectedValueLiteral);
      });

      it('should have the property gender (base name: "gender")', function() {
        // TODO: update the code to test the property gender
        expect(instance).to.have.property('gender');
        // expect(instance.gender).to.be(expectedValueLiteral);
      });

      it('should have the property branch (base name: "branch")', function() {
        // TODO: update the code to test the property branch
        expect(instance).to.have.property('branch');
        // expect(instance.branch).to.be(expectedValueLiteral);
      });

      it('should have the property residenceType (base name: "residenceType")', function() {
        // TODO: update the code to test the property residenceType
        expect(instance).to.have.property('residenceType');
        // expect(instance.residenceType).to.be(expectedValueLiteral);
      });

      it('should have the property firstYearTuitionFeePayable (base name: "firstYearTuitionFeePayable")', function() {
        // TODO: update the code to test the property firstYearTuitionFeePayable
        expect(instance).to.have.property('firstYearTuitionFeePayable');
        // expect(instance.firstYearTuitionFeePayable).to.be(expectedValueLiteral);
      });

      it('should have the property firstYearTuitionFeePaid (base name: "firstYearTuitionFeePaid")', function() {
        // TODO: update the code to test the property firstYearTuitionFeePaid
        expect(instance).to.have.property('firstYearTuitionFeePaid');
        // expect(instance.firstYearTuitionFeePaid).to.be(expectedValueLiteral);
      });

      it('should have the property firstYearHostelFeePayable (base name: "firstYearHostelFeePayable")', function() {
        // TODO: update the code to test the property firstYearHostelFeePayable
        expect(instance).to.have.property('firstYearHostelFeePayable');
        // expect(instance.firstYearHostelFeePayable).to.be(expectedValueLiteral);
      });

      it('should have the property firstYearHostelFeePaid (base name: "firstYearHostelFeePaid")', function() {
        // TODO: update the code to test the property firstYearHostelFeePaid
        expect(instance).to.have.property('firstYearHostelFeePaid');
        // expect(instance.firstYearHostelFeePaid).to.be(expectedValueLiteral);
      });

      it('should have the property secondYearTuitionFeePayable (base name: "secondYearTuitionFeePayable")', function() {
        // TODO: update the code to test the property secondYearTuitionFeePayable
        expect(instance).to.have.property('secondYearTuitionFeePayable');
        // expect(instance.secondYearTuitionFeePayable).to.be(expectedValueLiteral);
      });

      it('should have the property secondYearTuitionFeePaid (base name: "secondYearTuitionFeePaid")', function() {
        // TODO: update the code to test the property secondYearTuitionFeePaid
        expect(instance).to.have.property('secondYearTuitionFeePaid');
        // expect(instance.secondYearTuitionFeePaid).to.be(expectedValueLiteral);
      });

      it('should have the property secondYearHostelFeePayable (base name: "secondYearHostelFeePayable")', function() {
        // TODO: update the code to test the property secondYearHostelFeePayable
        expect(instance).to.have.property('secondYearHostelFeePayable');
        // expect(instance.secondYearHostelFeePayable).to.be(expectedValueLiteral);
      });

      it('should have the property secondYearHostelFeePaid (base name: "secondYearHostelFeePaid")', function() {
        // TODO: update the code to test the property secondYearHostelFeePaid
        expect(instance).to.have.property('secondYearHostelFeePaid');
        // expect(instance.secondYearHostelFeePaid).to.be(expectedValueLiteral);
      });

      it('should have the property firstYearTotalTuitionFeePaid (base name: "firstYearTotalTuitionFeePaid")', function() {
        // TODO: update the code to test the property firstYearTotalTuitionFeePaid
        expect(instance).to.have.property('firstYearTotalTuitionFeePaid');
        // expect(instance.firstYearTotalTuitionFeePaid).to.be(expectedValueLiteral);
      });

      it('should have the property firstYearTotalTuitionFeePending (base name: "firstYearTotalTuitionFeePending")', function() {
        // TODO: update the code to test the property firstYearTotalTuitionFeePending
        expect(instance).to.have.property('firstYearTotalTuitionFeePending');
        // expect(instance.firstYearTotalTuitionFeePending).to.be(expectedValueLiteral);
      });

      it('should have the property firstYearTotalHostelFeePaid (base name: "firstYearTotalHostelFeePaid")', function() {
        // TODO: update the code to test the property firstYearTotalHostelFeePaid
        expect(instance).to.have.property('firstYearTotalHostelFeePaid');
        // expect(instance.firstYearTotalHostelFeePaid).to.be(expectedValueLiteral);
      });

      it('should have the property firstYearTotalHostelFeePending (base name: "firstYearTotalHostelFeePending")', function() {
        // TODO: update the code to test the property firstYearTotalHostelFeePending
        expect(instance).to.have.property('firstYearTotalHostelFeePending');
        // expect(instance.firstYearTotalHostelFeePending).to.be(expectedValueLiteral);
      });

      it('should have the property secondYearTotalTuitionFeePaid (base name: "secondYearTotalTuitionFeePaid")', function() {
        // TODO: update the code to test the property secondYearTotalTuitionFeePaid
        expect(instance).to.have.property('secondYearTotalTuitionFeePaid');
        // expect(instance.secondYearTotalTuitionFeePaid).to.be(expectedValueLiteral);
      });

      it('should have the property secondYearTotalTuitionFeePending (base name: "secondYearTotalTuitionFeePending")', function() {
        // TODO: update the code to test the property secondYearTotalTuitionFeePending
        expect(instance).to.have.property('secondYearTotalTuitionFeePending');
        // expect(instance.secondYearTotalTuitionFeePending).to.be(expectedValueLiteral);
      });

      it('should have the property secondYearTotalHostelFeePaid (base name: "secondYearTotalHostelFeePaid")', function() {
        // TODO: update the code to test the property secondYearTotalHostelFeePaid
        expect(instance).to.have.property('secondYearTotalHostelFeePaid');
        // expect(instance.secondYearTotalHostelFeePaid).to.be(expectedValueLiteral);
      });

      it('should have the property secondYearTotalHostelFeePending (base name: "secondYearTotalHostelFeePending")', function() {
        // TODO: update the code to test the property secondYearTotalHostelFeePending
        expect(instance).to.have.property('secondYearTotalHostelFeePending');
        // expect(instance.secondYearTotalHostelFeePending).to.be(expectedValueLiteral);
      });

      it('should have the property modeOfPayment (base name: "modeOfPayment")', function() {
        // TODO: update the code to test the property modeOfPayment
        expect(instance).to.have.property('modeOfPayment');
        // expect(instance.modeOfPayment).to.be(expectedValueLiteral);
      });

      it('should have the property chequeNumber (base name: "chequeNumber")', function() {
        // TODO: update the code to test the property chequeNumber
        expect(instance).to.have.property('chequeNumber');
        // expect(instance.chequeNumber).to.be(expectedValueLiteral);
      });

      it('should have the property studentStatus (base name: "studentStatus")', function() {
        // TODO: update the code to test the property studentStatus
        expect(instance).to.have.property('studentStatus');
        // expect(instance.studentStatus).to.be(expectedValueLiteral);
      });

    });
  });

}));
