/*var mysql = require("mysql");*/

console.log("===NODE BENCHMARK===");

var connection = mysql.createConnection({
    host: "192.168.1.2",
    user: "root",
    password: "grip@123",
    database: "nodetest"
});

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

connection.connect(function (err) {
    if (err) {
        console.log(err);
    } else {
        var bData = new Date() - 0;
        console.log("\nbefore data : %d", bData);
        connection.query("SELECT bill_billingid,CAST(bill_createddate as DATE) AS bill_createddate,bill_totalpayment FROM nodetest.testbilling ORDER BY bill_createddate ASC;", function (error, results, fields) {
            debugger;
            var aData = new Date() - 0;
            console.log("\nafter data : %d", aData);
            //console.log(error,results,fields);
            var bProcessing = new Date() - 0;
            console.log("\nbefore processing : %d", bProcessing);
            var totalBills = 0, totalAmount = 0, currMonth = 0, prevMonth = 0;
            console.log("\n%s\t%s\t%s\t%s", "Months", "totalBills", "totalAmount", "average");
            for (var i = 0; i < results.length; i++) {
                currMonth = results[i].bill_createddate.getMonth();
                if (prevMonth === currMonth) {
                    totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
                    totalBills = totalBills + 1;
                } else {
                    console.log("%s\t%d\t\t%d\t%d", months[prevMonth], totalBills, totalAmount, totalAmount / totalBills);
                    prevMonth = currMonth;
                    totalAmount = 0;
                    totalBills = 0;

                    totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
                    totalBills = totalBills + 1;
                }
            }
            ;
            //to display last month of december
            console.log("%s\t%d\t\t%d\t%d", months[currMonth], totalBills, totalAmount, totalAmount / totalBills);
            var aProcessing = new Date() - 0;
            console.log("\nafter processing : %d\n", aProcessing);

            console.log("time for data : %d milliseconds", aData - bData)
            console.log("time for processing : %d milliseconds\n", aProcessing - bProcessing)

            //GET highest month of the year
            getHighestMonthOfYear(results, function (highestMonthOfYear, highestMonthOfYearValue) {
                console.log("Highest bill amount was generated in %s which was %s\n", months[highestMonthOfYear], highestMonthOfYearValue);
            });

            //GET lowest month of the year
            getLowestMonthOfYear(results, function (lowestMonthOfYear, lowestMonthOfYearValue) {
                console.log("Lowest bill amount was generated in %s which was %s\n", months[lowestMonthOfYear], lowestMonthOfYearValue);
            });
        });
    }
});

function getHighestMonthOfYear(results, cb) {
    var bgetHighestMonthOfYear = new Date() - 0;
    console.log("before getHighestMonthOfYear : %d", bgetHighestMonthOfYear);

    var currMonthTotal = 0, highestMonthOfYear = 0, highestMonthOfYearValue = 0;
    var totalAmount = 0, currMonth = 0, prevMonth = 0;

    for (var i = 0; i < results.length; i++) {
        currMonth = results[i].bill_createddate.getMonth();
        if (prevMonth === currMonth) {
            totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
        } else {
            currMonthTotal = totalAmount;

            highestMonthOfYear = currMonthTotal > highestMonthOfYearValue ? currMonth : highestMonthOfYear;
            highestMonthOfYearValue = currMonthTotal > highestMonthOfYearValue ? currMonthTotal : highestMonthOfYearValue;


            //console.log("highestMonthOfYear : %s. \t highestMonthOfYearValue : %s",highestMonthOfYear,highestMonthOfYearValue);

            prevMonth = currMonth;
            totalAmount = (results[i].bill_totalpayment || 0);
        }
    }
    ;

    prevMonth = currMonth;
    currMonthTotal = totalAmount;

    //to display last month of december
    highestMonthOfYear = currMonthTotal > highestMonthOfYearValue ? currMonth : highestMonthOfYear;
    highestMonthOfYearValue = currMonthTotal > highestMonthOfYearValue ? currMonthTotal : highestMonthOfYearValue;

    var agetHighestMonthOfYear = new Date() - 0;
    console.log("after getHighestMonthOfYear : %d", agetHighestMonthOfYear);
    console.log("time for processing getHighestMonthOfYear: %d milliseconds", agetHighestMonthOfYear - bgetHighestMonthOfYear);

    cb(highestMonthOfYear, highestMonthOfYearValue);
}

function getLowestMonthOfYear(results, cb) {
    var bgetLowestMonthOfYear = new Date() - 0;
    console.log("before getLowestMonthOfYear : %d", bgetLowestMonthOfYear);

    var currMonthTotal = 0, lowestMonthOfYear = 99999999999999999, lowestMonthOfYearValue = 99999999999999999;
    var totalAmount = 0, currMonth = 0, prevMonth = 0;

    for (var i = 0; i < results.length; i++) {
        currMonth = results[i].bill_createddate.getMonth();
        if (prevMonth === currMonth) {
            totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
        } else {
            currMonthTotal = totalAmount;

            lowestMonthOfYear = currMonthTotal < lowestMonthOfYearValue ? prevMonth : lowestMonthOfYear;
            lowestMonthOfYearValue = currMonthTotal < lowestMonthOfYearValue ? currMonthTotal : lowestMonthOfYearValue;

            //console.log("lowestMonthOfYear : %s. \t lowestMonthOfYearValue : %s",lowestMonthOfYear,lowestMonthOfYearValue);

            prevMonth = currMonth;
            totalAmount = (results[i].bill_totalpayment || 0);
        }
    }
    ;

    currMonthTotal = totalAmount;

    //to display last month of december
    lowestMonthOfYear = currMonthTotal < lowestMonthOfYearValue ? currMonth : lowestMonthOfYear;
    lowestMonthOfYearValue = currMonthTotal < lowestMonthOfYearValue ? currMonthTotal : lowestMonthOfYearValue;

    var agetLowestMonthOfYear = new Date() - 0;
    console.log("after getLowestMonthOfYear : %d", agetLowestMonthOfYear);
    console.log("time for processing getLowestMonthOfYear: %d milliseconds", agetLowestMonthOfYear - bgetLowestMonthOfYear);

    cb(lowestMonthOfYear, lowestMonthOfYearValue);
}

function getLowestMonthOfYear(results, cb) {
    var bgetLowestMonthOfYear = new Date() - 0;
    console.log("before getLowestMonthOfYear : %d", bgetLowestMonthOfYear);

    var currMonthTotal = 0, lowestMonthOfYear = 99999999999999999, lowestMonthOfYearValue = 99999999999999999;
    var totalAmount = 0, currMonth = 0, prevMonth = 0;

    for (var i = 0; i < results.length; i++) {
        currMonth = results[i].bill_createddate.getMonth();
        if (prevMonth === currMonth) {
            totalAmount = totalAmount + (results[i].bill_totalpayment || 0);
        } else {
            currMonthTotal = totalAmount;

            lowestMonthOfYear = currMonthTotal < lowestMonthOfYearValue ? prevMonth : lowestMonthOfYear;
            lowestMonthOfYearValue = currMonthTotal < lowestMonthOfYearValue ? currMonthTotal : lowestMonthOfYearValue;

            //console.log("lowestMonthOfYear : %s. \t lowestMonthOfYearValue : %s",lowestMonthOfYear,lowestMonthOfYearValue);

            prevMonth = currMonth;
            totalAmount = (results[i].bill_totalpayment || 0);
        }
    }
    ;

    currMonthTotal = totalAmount;

    //to display last month of december
    lowestMonthOfYear = currMonthTotal < lowestMonthOfYearValue ? currMonth : lowestMonthOfYear;
    lowestMonthOfYearValue = currMonthTotal < lowestMonthOfYearValue ? currMonthTotal : lowestMonthOfYearValue;

    var agetLowestMonthOfYear = new Date() - 0;
    console.log("after getLowestMonthOfYear : %d", agetLowestMonthOfYear);
    console.log("time for processing getLowestMonthOfYear: %d milliseconds", agetLowestMonthOfYear - bgetLowestMonthOfYear);

    cb(lowestMonthOfYear, lowestMonthOfYearValue);
}
