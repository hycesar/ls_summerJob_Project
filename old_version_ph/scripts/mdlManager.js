const path = require('path'); // Module used to build the file path.
const reviewer = require('./mdl-slx/reviewer-XML'); // Review Script module.
const mongoose = require('mongoose'); // Database module.
require('../models/Report'); // Report Template module.
const Report = mongoose.model('report'); // Database Reporting module.

// Function responsible for executing the script, in Python,
// for converting the mdl/slx file to xml. The "child_process" module is used for this.
// The xml filename will be the same as the mdl filename, changing only the extension.
async function callName(fileAddress, myReportRequest) { 
    let step = 0;
    const { execFile } = require('child_process'); // Child Process module.
    const child = execFile('python', ["./scripts/mdl-slx/conversor-MDL-XML.pyw", fileAddress], async (error, stdout, stderr) => { // Function responsible for actually executing the script in Python.
        if (error) {
            throw error;
        } else {
            step += 1;
            myReportRequest.percent = (step / 4) * 100; // Update percentage.
            await myReportRequest.save(); // Saving database changes.
            reviewer(fileAddress, myReportRequest, step); // Call the review function.
        }
        console.log("[Me] File translated from MDL/SLX to XML!");
    });
    
}

module.exports = async (reportId) => {
    myReportRequest = await Report.findOne({ _id: reportId }); // Search the request in the database by an ID
    const fileName = myReportRequest.fileName; // Capture file name
    const fileAddress = path.join(`${__dirname}//..//public//uploads//${fileName}`); // Build file path
    await callName(fileAddress, myReportRequest);
    setTimeout(async () => { // Delays 5 seconds to display the first percentage (5%)
        myReportRequest.percent = 0.05 * 100;
        await myReportRequest.save(); // Saving database changes.
    }, 5000);
    setTimeout(async () => { // Delays 20 seconds to display the second percentage (10%)
        myReportRequest.percent = 0.1 * 100;
        await myReportRequest.save(); // Saving database changes.
    }, 20000);
};