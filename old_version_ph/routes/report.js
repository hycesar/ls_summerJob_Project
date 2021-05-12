// setting librarys
const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Report'); // Importing here the database structure 
const path = require('path');
const Report = mongoose.model('report'); // Model database

const fs = require('fs'); // Manage systems files
const creatingContent = require('./../scripts/others/creatingContent');

router.post('/', (req, res) => {    
    // The server will recive a request with the id for know wicth information to collect from the database
    Report.findOne({ _id: mongoose.Types.ObjectId(req.body.reportId) }).then((report) => {

        if(report.done == 0) {
            // In case the report is not ready
            res.send({
                done: 0,
                percent: report.percent
            });
        } else if(report.done == 1) {
            // In case the report is ready
        
            const name = report.fileName.replace(path.extname(report.fileName), '');
            const txtFileName = 'report_of_' + report.originalname.replace(path.extname(report.originalname), '') + '.txt';
            
            res.send({
                done: 1,
                fileName: report.fileName,
                txtFileName,
                reportList: report.reportList
            });

            // Creating a folder and a report text file using as bese the internal file name and the data of upload.
            if(!fs.existsSync(path.join(__dirname, '/../public/uploads/', name, txtFileName))) {         

                fs.mkdir(path.join(__dirname, '/../public/uploads/', name), { recursive: true }, (err) => {
                    if (err) throw err;
                });
                fs.writeFile(path.join(__dirname, '/../public/uploads/', name, txtFileName),
                creatingContent(report.reportList, report.originalname), {enconding:'utf-8',flag: 'a'},
                function (err) {
                    if (err) throw err;
                    console.log('[Me] File saved!');
                });
            }
            
        } else if(report.done == -1) {
            // In case something goes wrong with the report request
            res.send({
                done: -1,
            });
        } else {
            // Default case;
            console.log("[Me] Error on the post routine. Flag value on database is: " + report.done);
        }
    }).catch((err) => {
        res.send('[Me] Something wrong on was looking for the Report on database.');
    });
});

router.post('/download', (req, res) => {
    const address = path.join(__dirname, '/../public/uploads', req.body.fileName.replace(path.extname(req.body.fileName), ''), req.body.txtFileName)
    res.download(address);
});

module.exports = router;