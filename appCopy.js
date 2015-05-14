var mysql = require("mysql");

var app = 
{
	months : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
	connectionSettings : {
							host : "192.168.1.2",
							user : "root",
							password : "grip@123",
							database : "nodetest"
						},
	connection : function(){
		return mysql.createConnection(app.connectionSettings);
	}, 
	initApp : function(cb) {
		app.connection().connect(function(err){
			app.connectionOnConnect(err,function(data){
				cb && cb(data);
			});
		});
	},
	connectionOnConnect : function(err,cb){
		if(err){
			throw new Error(err);
		}else{

			app.connection().query("SELECT CAST(bill_createddate as DATE) AS bill_createddate,bill_totalpayment FROM nodetest.testbilling ORDER BY bill_createddate ASC LIMIT 200000;"
									,function(error,results,fields){
										app.connectionOnQuery(error,results,fields,function(data){
											cb && cb(data);
										});
									});
		}
	},
	connectionOnQuery : function(error,results,fields,cb){
	 	var billDimensions = app.calculateBillDimensions(results);
		var _res = {
	 		error : error,
	 		results : results,
	 		fields : fields,
	 		billDimensions : billDimensions
	 	};
	 	cb && cb(_res);
	 	return _res;
	},
	calculateBillDimensions : function(results){
		var totalBills = 0,totalAmount = 0,currMonth = 0,prevMonth = 0, retResArr = [], retResProp = {};
		for (var i = 0; i < results.length; i++) {
			currMonth = results[i].bill_createddate.getMonth();
			if(prevMonth === currMonth){
				totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
				totalBills = totalBills + 1;
			}else{
				retResProp["month"] = app.months[prevMonth];
				retResProp["totalBills"] = totalBills;
				retResProp["totalAmount"] = totalAmount;
				retResProp["average"] = totalAmount / totalBills;

				retResArr.push(retResProp);
				
				retResProp = {};

				prevMonth = currMonth;
				totalAmount = 0;
				totalBills= 0;

				totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
				totalBills = totalBills + 1;
			}
		};
		retResProp["month"] = app.months[currMonth];
		retResProp["totalBills"] = totalBills;
		retResProp["totalAmount"] = totalAmount;
		retResProp["average"] = totalAmount / totalBills;

		retResArr.push(retResProp);
		retResProp = {};

		return retResArr;
	},
	getHighestMonthOfYear : function (results,cb){
		var highestMonthOfYear = 0,highestMonthOfYearValue = 0;
		var totalAmount = 0, currMonth = 0, prevMonth = 0;
		
		prevMonth = results.length > 0 && results[0].bill_createddate.getMonth();
		
		for (var i = 0; i < results.length; i++) {
			
			currMonth = results[i].bill_createddate.getMonth();

			if(prevMonth === currMonth){
				totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
			}else{
				highestMonthOfYear = totalAmount > highestMonthOfYearValue ? prevMonth : highestMonthOfYear;
				highestMonthOfYearValue = totalAmount > highestMonthOfYearValue ? totalAmount : highestMonthOfYearValue;

				prevMonth = currMonth;
				totalAmount = (results[i].bill_totalpayment || 0);
			}
		}

		//to display last month of december
		highestMonthOfYear = totalAmount > highestMonthOfYearValue ? currMonth : highestMonthOfYear;
		highestMonthOfYearValue = totalAmount > highestMonthOfYearValue ? totalAmount : highestMonthOfYearValue;
		
		cb && cb(highestMonthOfYear, highestMonthOfYearValue);

		return {
			highestMonthOfYear : highestMonthOfYear,
			highestMonthOfYearValue : highestMonthOfYearValue
		};
	},
	getLowestMonthOfYear : function (results,cb){
		var lowestMonthOfYear = 99999999999999999,lowestMonthOfYearValue = 99999999999999999;
		var totalAmount = 0,currMonth = 0,prevMonth = 0;
		
		prevMonth = results.length > 0 && results[0].bill_createddate.getMonth();
		
		for (var i = 0; i < results.length; i++) {
			currMonth = results[i].bill_createddate.getMonth();
			if(prevMonth === currMonth){
				totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
			}else{
				lowestMonthOfYear = totalAmount < lowestMonthOfYearValue ? prevMonth : lowestMonthOfYear;
				lowestMonthOfYearValue = totalAmount < lowestMonthOfYearValue ? totalAmount : lowestMonthOfYearValue;
				
				prevMonth = currMonth;
				totalAmount = (results[i].bill_totalpayment || 0);
			}
		};
		//to display last month of december
		lowestMonthOfYear = totalAmount < lowestMonthOfYearValue ? currMonth : lowestMonthOfYear;
		lowestMonthOfYearValue = totalAmount < lowestMonthOfYearValue ? totalAmount : lowestMonthOfYearValue;
		
		cb && cb(lowestMonthOfYear, lowestMonthOfYearValue);

		return {
			lowestMonthOfYear : lowestMonthOfYear,
			lowestMonthOfYearValue : lowestMonthOfYearValue
		};
	}
}

exports.app = app;

app.initApp();

exports.multiply = function(num1,num2){
	return num1 * num2;
}