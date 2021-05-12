/* Docm script Manager */

const path = require('path');
const mongoose = require('mongoose');
require('../models/Report');
const Report = mongoose.model('report');

const extractXmlFromDoc = require('./doc/extractXmlFromDoc');
const checkIdentRule = require('./doc/checkIdentRule');
const checkParametersValues = require('./doc/checkParametersValues');

/** (1) Modules useds to check another rule. But it is not ready 

  const extractFilesInsideDocm = require('./doc/extractFilesInsideDocm');
  const checkFooters = require('./doc/checkFooters');

*/

 const numberSteps = 4; // Used to calculate the progress

// Clean the requests from database
const cleanDB = async () => {
  await Report.deleteMany();
  const result = await Report.find();
  console.log(result);
};

module.exports = async (reportId) => {
  let step = 0;
  
  // Get the reference from database
  myReportRequest = await Report.findOne({ _id: reportId });
  
  const fileName = myReportRequest.fileName;
  const fileAddress = path.join(`${__dirname}/../public/uploads/${fileName}`);
  const documentObjJs = await extractXmlFromDoc(fileAddress, 'word/document.xml');
    
  myReportRequest.reportList = []; // In the end, all erros will be here

  myReportRequest.reportList = await checkIdentRule(documentObjJs, 'Signal Table');
  step += 1;
  myReportRequest.percent = (step / numberSteps) * 100;
  await myReportRequest.save(); // Saving on database        

  myReportRequest.reportList = myReportRequest.reportList.concat(await checkIdentRule(documentObjJs, 'Parameters Table'));
  step += 1;
  myReportRequest.percent = (step / numberSteps) * 100;
  await myReportRequest.save();

  myReportRequest.reportList = myReportRequest.reportList.concat(await checkIdentRule(documentObjJs, 'Test Values Table'));
  step += 1;
  myReportRequest.percent = (step / numberSteps) * 100;
  await myReportRequest.save();
  
  myReportRequest.reportList = myReportRequest.reportList.concat(await checkParametersValues(documentObjJs));
  step += 1;
  myReportRequest.percent = (step / numberSteps) * 100;
  await myReportRequest.save();
  
  /** (1) Useds to check another rule. But it is not ready 
   
   const filesInsideDocm = await extractFilesInsideDocm(fileAddress);
   myReportRequest.reportList = myReportRequest.reportList.concat(await checkFooters(filesInsideDocm, fileAddress, myReportRequest.originalname));
   step += 1;
   myReportRequest.percent = (step / numberSteps) * 100;
   await myReportRequest.save();
  
  */

  myReportRequest.done = 1; // Process done, report is ready
  await myReportRequest.save();        

  // await cleanDB();
  // Used to clean Db, just used when is convenient
};