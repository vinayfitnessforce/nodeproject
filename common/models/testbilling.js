var appCopy = require("../lib/appCopy.js");

module.exports = function(testbilling) {
    testbilling.status = function(cb) {
	    var currentDate = new Date();
	    var currentHour = currentDate.getHours();
	    var OPEN_HOUR = 6;
	    var CLOSE_HOUR = 20;
	    console.log('Current hour is ' + currentHour);
	    var response;
	    if (currentHour > OPEN_HOUR && currentHour < CLOSE_HOUR) {
	      response = 'We are open for business.';
	    } else {
	      response = 'Sorry, we are closed. Open daily from 6am to 8pm.';
	    }
	    console.log(cb.toString());
	    cb(null, response);
    };


    testbilling.getTotalPayment = function(billId,cb){
      	var response;
        if(billId === 1){
            response = "total bill amount for " + billId + " is " + 1234;
            cb(null,response);
            console.log(response);
        }else{
      		// response = "total bill amount for " + billId + " is " + 9000;
            testbilling.findById(billId,function(err,instance){
                console.log(err,instance);
                if(instance){
                    response = "total bill amount for " + billId + " is " + instance.bill_totalpayment;
                }else{
                    response = billId + " does not exist in database";
                }
                cb(null,response);
                console.log(response);
          });
        }
    };


    testbilling.months = function(cb){
        cb(null,appCopy.months);
    };

    testbilling.initApp = function(cb){
        appCopy.initApp(function(data){
            cb(null,data);
        });
    };
   
    testbilling.connectionOnQuery = function (error,results,fields,cb) {
        appCopy.connectionOnQuery(error,results,fields,function(data){
            cb(null,data);
        });
    };
    
    testbilling.calculateBillDimensions = function (results,cb) {
        appCopy.calculateBillDimensions(results,function (data) {
            cb(null,data);
        });
    };

    testbilling.getHighestMonthOfYear = function (results,cb) {
        appCopy.getHighestMonthOfYear(results,function (data) {
            cb(null,appCopy.months[data]);
        });
    };

    testbilling.getLowestMonthOfYear = function (results,cb) {
        appCopy.getHighestMonthOfYear(results,function (data) {
            cb(null,appCopy.months[data]);
        });
    };

    testbilling.remoteMethod(
        'status',
        {
            http: {path: '/status', verb: 'get'},
            returns: {arg: 'status', type: 'string'}
        }
    );

    testbilling.remoteMethod(
  	     'getTotalPayment',
      	{
      		http: {path: '/getTotalPayment', verb: 'get'},
      		accepts : {arg : 'billid', type: 'number', http : {source : 'query'} },
      		returns : {arg : 'totalPayment', type : 'string'}
      	}
    );

    testbilling.remoteMethod(
        'months',
        {
            http: {path: '/months', verb: 'get'},
            returns: {arg: 'months', type: 'object'}
        }
    );
    testbilling.remoteMethod(
        'initApp',
        {
            http: {path: '/initApp', verb: 'get'},
            returns: {arg: 'initApp', type: 'object'}
        }
    );

    testbilling.remoteMethod(
        'calculateBillDimensions',
        {
            http: {path: '/calculateBillDimensions', verb: 'post'},
            accepts : {arg : 'results', type: 'object'},
            returns: {arg: 'calculateBillDimensions', type: 'object'}
        }
    );

    testbilling.remoteMethod(
        'getHighestMonthOfYear',
        {
            http: {path: '/getHighestMonthOfYear', verb: 'post'},
            accepts : {arg : 'results', type: 'object'},
            returns: {arg: 'getHighestMonthOfYear', type: 'object'}
        }
    );


    testbilling.remoteMethod(
        'getLowestMonthOfYear',
        {
            http: {path: '/getLowestMonthOfYear', verb: 'post'},
            accepts : {arg : 'results', type: 'object'},
            returns: {arg: 'getLowestMonthOfYear', type: 'object'}
        }
    );


    testbilling.remoteMethod(
        'connectionOnQuery',
        {
            http: {path: '/connectionOnQuery', verb: 'post'},
            accepts : [{arg : 'error', type: 'object'},{arg : 'results', type: 'object'},{arg : 'fields', type: 'object'}],
            returns: {arg: 'connectionOnQuery', type: 'object'}
        }
    );
};
