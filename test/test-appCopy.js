var appCopy = require("../lib/appCopy.js");

	exports["should not be null"] = function(test){
		//console.log("should not be null");
		test.notEqual(appCopy,null);
		test.done();
	}

	//mock data
	var error = null;
	var results = [{ 
					 bill_billingid: 41929,
				     bill_createddate: new Date("Thu Jan 02 2014 00:00:00 GMT+0530 (India Standard Time)"),
				     bill_totalpayment: 8000 },
				   { bill_billingid: 41929,
				     bill_createddate: new Date("Thu Jan 02 2014 00:00:00 GMT+0530 (India Standard Time)"),
				     bill_totalpayment: 8001 }
			    ]; 

	var fields = [{
					catalog: 'def',
				    db: 'nodetest',
				    table: 'testbilling',
				    orgTable: 'testbilling',
				    name: 'bill_billingid',
				    orgName: 'bill_billingid',
				    charsetNr: 63,
				    length: 11,
				    type: 3,
				    flags: 20483,
				    decimals: 0,
				    default: undefined,
				    zeroFill: false,
				    protocol41: true },
				  { catalog: 'def',
				    db: '',
				    table: '',
				    orgTable: '',
				    name: 'bill_createddate',
				    orgName: '',
				    charsetNr: 63,
				    length: 10,
				    type: 10,
				    flags: 128,
				    decimals: 0,
				    default: undefined,
				    zeroFill: false,
				    protocol41: true },
				  { catalog: 'def',
				    db: 'nodetest',
				    table: 'testbilling',
				    orgTable: 'testbilling',
				    name: 'bill_totalpayment',
				    orgName: 'bill_totalpayment',
				    charsetNr: 63,
				    length: 20,
				    type: 246,
				    flags: 0,
				    decimals: 4,
				    default: undefined,
				    zeroFill: false,
				    protocol41: true } 
			    ];

    exports["should have data"] = function(test){
		//console.log("should have data");
		appCopy.initApp(function(data){
			test.equal(Object.keys(data).length,4);
			// error = data.error;
			// results = data.results;
			// fields = data.fields; 
			test.done();
		});
		test.done();
	}

	exports["should not raise an error from query"] = function(test) {
		//console.log("should not raise an error from query");
		var _res = appCopy.connectionOnQuery(error,results,fields);
		test.equal(_res.error,null);
		test.done();
	} 

	exports["should return 3 columns from query"] = function(test) {
		//console.log("should return 3 columns from query");
		var _res = appCopy.connectionOnQuery(error,results,fields);
		test.equal(_res.fields.length,3);
		test.done();
	} 

	exports["should return 2 rows from query"] = function(test) {
		//console.log("should return 2 rows from query");
		var _res = appCopy.connectionOnQuery(error,results,fields);
		test.equal(_res.results.length,2);
		test.done();
	} 

	exports["should have og name of first column from query as bill_billingid"] = function(test) {
		//console.log("should have og name of first column from query as bill_billingid");
		var _res = appCopy.connectionOnQuery(error,results,fields);
		test.equal(_res.fields[0].orgName,"bill_billingid");
		test.done();
	} 

	exports["should have name of second column from query as bill_createddate"] = function(test) {
		//console.log("should have name of second column from query as bill_createddate");
		var _res = appCopy.connectionOnQuery(error,results,fields);
		test.equal(_res.fields[1].name,"bill_createddate");
		test.done();
	} 

	exports["should have og name of third column from query as bill_totalpayment"] = function(test) {
		//console.log("should have og name of third column from query as bill_totalpayment");
		var _res = appCopy.connectionOnQuery(error,results,fields);
		test.equal(_res.fields[2].orgName,"bill_totalpayment");
		test.done();
	} 

	exports["should have 16000 as the bill_totalpayment for the month of Jan"] = function(test) {
		//console.log("should have 16000 as the bill_totalpayment for the month of Jan");
		var _res = appCopy.connectionOnQuery(error,results,fields);
		test.equal(_res.billDimensions.filter(function(val,i){return val.month === "Jan";})[0]["totalAmount"],16000);
		test.done();
	}

	exports["should not have data for months other than Jan"] = function(test) {
		//console.log("should not have data for months other than Jan");
		var _res = appCopy.connectionOnQuery(error,results,fields);
		test.equal(_res.billDimensions.filter(function(val,i){return val.month !== "Jan";}).length,0);
		test.done();
	} 


	exports["should show Jan as the Highest Month Of Year"] = function(test){
		//console.log("should show Jan as the Highest Month Of Year");
		var _res = appCopy.getHighestMonthOfYear(results);
		test.equal(appCopy.months[_res.highestMonthOfYear],"Jan");
		test.done();
	}

	exports["should show 16000 as the Highest Month Of Year Value"] = function(test){
		//console.log("should show 16000 as the Highest Month Of Year Value");
		var _res = appCopy.getHighestMonthOfYear(results);
		test.equal(_res.highestMonthOfYearValue,16000);
		test.done();
	}


	exports["should show Jan as the Lowest Month Of Year"] = function(test){
		//console.log("should show Jan as the Lowest Month Of Year");
		var _res = appCopy.getLowestMonthOfYear(results);
		test.equal(appCopy.months[_res.lowestMonthOfYear],"Jan");
		test.done();
	}

	exports["should show 16000 as the Lowest Month Of Year Value"] = function(test){
		//console.log("should show 16000 as the Lowest Month Of Year Value");
		var _res = appCopy.getLowestMonthOfYear(results);
		test.equal(_res.lowestMonthOfYearValue,16000);
		test.done();
	}

	exports["should return proper multiplication results"] = function(test){
		//console.log("should return proper multiplication results");
		test.equal(appCopy.multiply(1,3),3);
		test.equal(appCopy.multiply(2,3),6);
		test.equal(appCopy.multiply(3,3),9);
		// expect(appCopy.multiply(4,3)).to.equal(16);
		test.done();
	}

