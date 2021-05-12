const fs = require('fs'); // Module used to open files.

// Module responsible for reading the file containing the errors and adding them to the database.
module.exports = async (fileAddress, myReportRequest, step) => {
    fileAddress = fileAddress.split(".")
    let TXTAddress = address[0] + ".txt"    
    fs.readFile(TXTAddress, 'utf8', async (err, content) => { // Opening the file.
        if (err) {
            throw err;
        } else {
            step += 1;
            myReportRequest.percent = (step / 4) * 100; // Update percentage.
            await myReportRequest.save(); // Saving database changes.

            myReportRequest.reportList = [];
            let errors = content.split("####");
            myReportRequest.reportList = myReportRequest.reportList.concat(errors); // Adding errors in the local review object
            await myReportRequest.save(); // Saving database changes.
            
            step += 1;
            myReportRequest.percent = (step / 4) * 100; // Update percentage.
            await myReportRequest.save(); // Saving database changes.

            myReportRequest.done = 1; // Telling the database that script execution has ended.
            await myReportRequest.save(); // Saving database changes.
        }
    });

}