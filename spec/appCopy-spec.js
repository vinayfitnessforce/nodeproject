var appCopy = require("../appCopy.js");

describe("Test suite for app.js", function () {
    var originalTimeout;
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });


    it("should be null", function () {
        //console.log("should not be null");
        expect(appCopy).toBe(null);
    });

    //mock data
    var error = null;
    var results = [{
        bill_billingid: 41929,
        bill_createddate: new Date("Thu Jan 02 2014 00:00:00 GMT+0530 (India Standard Time)"),
        bill_totalpayment: 8000
    }, {
        bill_billingid: 188217,
        bill_createddate: new Date("Thu Jan 02 2014 00:00:00 GMT+0530 (India Standard Time)"),
        bill_totalpayment: 8000
    }];

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
        protocol41: true
    },
        {
            catalog: 'def',
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
            protocol41: true
        },
        {
            catalog: 'def',
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
            protocol41: true
        }
    ];

    it("should have data", function (done) {
        //console.log("should have data");
        appCopy.app.initApp(function (data) {
            expect(Object.keys(data).length).toBe(4);
            // error = data.error;
            // results = data.results;
            // fields = data.fields;
            done();
        });
    });

    it("should not raise an error from query", function () {
        //console.log("should not raise an error from query");
        var _res = appCopy.app.connectionOnQuery(error, results, fields);
        expect(_res.error).toBe(null);
    });

    it("should return 3 columns from query", function () {
        //console.log("should return 3 columns from query");
        var _res = appCopy.app.connectionOnQuery(error, results, fields);
        expect(_res.fields.length).toBe(3);
    });

    it("should return 2 rows from query", function () {
        //console.log("should return 2 rows from query");
        var _res = appCopy.app.connectionOnQuery(error, results, fields);
        expect(_res.results.length).toBe(2);
    });

    it("should have og name of first column from query as bill_billingid", function () {
        //console.log("should have og name of first column from query as bill_billingid");
        var _res = appCopy.app.connectionOnQuery(error, results, fields);
        expect(_res.fields[0].orgName).toBe("bill_billingid");
    });

    it("should have name of second column from query as bill_createddate", function () {
        //console.log("should have name of second column from query as bill_createddate");
        var _res = appCopy.app.connectionOnQuery(error, results, fields);
        expect(_res.fields[1].name).toBe("bill_createddate");
    });

    it("should have og name of third column from query as bill_totalpayment", function () {
        //console.log("should have og name of third column from query as bill_totalpayment");
        var _res = appCopy.app.connectionOnQuery(error, results, fields);
        expect(_res.fields[2].orgName).toBe("bill_totalpayment");
    });

    it("should have 16000 as the bill_totalpayment for the month of Jan", function () {
        //console.log("should have 16000 as the bill_totalpayment for the month of Jan");
        var _res = appCopy.app.connectionOnQuery(error, results, fields);
        expect(_res.billDimensions.filter(function (val, i) {
            return val.month === "Jan";
        })[0]["totalAmount"]).toBe(16000);
    });

    it("should not have data for months other than Jan", function () {
        //console.log("should not have data for months other than Jan");
        var _res = appCopy.app.connectionOnQuery(error, results, fields);
        expect(_res.billDimensions.filter(function (val, i) {
            return val.month !== "Jan";
        }).length).toBe(0);
    });

    it("should show Jan as the Highest Month Of Year", function () {
        //console.log("should show Jan as the Highest Month Of Year");
        var _res = appCopy.app.getHighestMonthOfYear(results);
        expect(appCopy.app.months[_res.highestMonthOfYear]).toBe("Jan");
    });

    it("should show 16000 as the Highest Month Of Year Value", function () {
        //console.log("should show 16000 as the Highest Month Of Year Value");
        var _res = appCopy.app.getHighestMonthOfYear(results);
        expect(_res.highestMonthOfYearValue).toBe(16000);
    });


    it("should show Jan as the Lowest Month Of Year", function () {
        //console.log("should show Jan as the Lowest Month Of Year");
        var _res = appCopy.app.getLowestMonthOfYear(results);
        expect(appCopy.app.months[_res.lowestMonthOfYear]).toBe("Jan");
    });

    it("should show 16000 as the Lowest Month Of Year Value", function () {
        //console.log("should show 16000 as the Lowest Month Of Year Value");
        var _res = appCopy.app.getLowestMonthOfYear(results);
        expect(_res.lowestMonthOfYearValue).toBe(16000);
    });

    it("should return proper multiplication results", function () {
        //console.log("should return proper multiplication results");
        expect(appCopy.multiply(1, 3)).toBe(3);
        expect(appCopy.multiply(2, 3)).toBe(6);
        expect(appCopy.multiply(3, 3)).toBe(9);
        // expect(appCopy.multiply(4,3)).toBe(16);
    });
});

