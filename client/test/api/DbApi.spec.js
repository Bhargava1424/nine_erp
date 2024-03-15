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

  beforeEach(function() {
    instance = new SchoolManagementSystemApi.DbApi();
  });

  describe('(package)', function() {
    describe('DbApi', function() {
      describe('dbGet', function() {
        it('should call dbGet successfully', function(done) {
          // TODO: uncomment, update parameter values for dbGet call and complete the assertions
          /*
          var opts = {};

          instance.dbGet(opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(SchoolManagementSystemApi.Response);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('dbUpdate', function() {
        it('should call dbUpdate successfully', function(done) {
          // TODO: uncomment, update parameter values for dbUpdate call and complete the assertions
          /*
          var opts = {};

          instance.dbUpdate(opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(SchoolManagementSystemApi.Response);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
      describe('getExcel', function() {
        it('should call getExcel successfully', function(done) {
          // TODO: uncomment, update parameter values for getExcel call and complete the assertions
          /*
          var opts = {};

          instance.getExcel(opts, function(error, data, response) {
            if (error) {
              done(error);
              return;
            }
            // TODO: update response assertions
            expect(data).to.be.a(SchoolManagementSystemApi.Response);

            done();
          });
          */
          // TODO: uncomment and complete method invocation above, then delete this line and the next:
          done();
        });
      });
    });
  });

}));
