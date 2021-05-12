const getReport = require('./getReport') // Error capture script module.

// Function responsible for executing the script, in Python,
// to check the xml file and catch errors found in it. The "child_process" module is used for this.
// A txt file is created containing the errors found.
async function callName(fileAddress, myReportRequest, step) { 

    const { execFile } = require('child_process'); // Child Process module.
    execFile('python', ["./scripts/mdl-slx/reviewer.pyw", fileAddress], async (error, stdout, stderr) => { // Function responsible for actually executing the script in Python.
        if (error) {
            throw error;
        } else {
            step += 1;
            myReportRequest.percent = (step / 4) * 100; // Update percentage.
            await myReportRequest.save(); // Saving database changes.

            await getReport(fileAddress, myReportRequest, step); // Calling the function that inserts the errors found in the database
        }
    });
}
module.exports = async (fileAddress, myReportRequest, step) => {
    address = fileAddress.split(".")
    let XMLAddress = address[0] + ".xml"
    await callName(XMLAddress, myReportRequest, step)
}