/* Upload's Routes */

// Setting librarys
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer'); // library used for recive the file sent by frontend

// Seting multer
const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, 'public/uploads');
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    callback(null, file.fieldname + '_' + Date.now() + ext);
    // The file will recive a standard name plus the upload date.
    // This can be a problem if two files are sent at the exact same time.
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if(ext != '.docm' && ext != '.mdl' && ext != '.slx') { // checking file's type
      callback(new Error('This kind of file is not accepted.'))
    } else {
      callback(null, true);
    }
  }
}).single('fileToReview'); // singles has a name give to all files


// Importing scripts
const docManager = require('../scripts/docManager'); 
const mdlManager = require('../scripts/mdlManager'); 

router.get('/', (req, res) => {
  res.render('uploadfile');
});

router.post('/sendfile', (req, res) => {
  upload(req, res, (err) => {

    if(err instanceof multer.MulterError) {
      
      // Creating a flash error msg:
      req.flash('error_msg', 'Something wrong on upload internal library. Try again or contact FCA Team Support.');

      res.redirect('/upload');
    } else if(err) {
      // For now, Any errors that is not from multer function will enter here.
      // In pratice, just when the user do upload of wrong file types.
      
      // Creating a flash error msg:
      req.flash('error_msg', 'Sorry, this file is not accepted yet. Please, upload only file with the extensions \'.docm\', \'.mdl\' ou \'.slx\'.');

      res.redirect('/upload');
    } else {
      
      const mongoose = require('mongoose');
      require('../models/Report');    
      const Report = mongoose.model('report'); 

      const newReport = {
        fileName: req.file.filename,
        originalname: req.file.originalname, 
        reportList: []
      }

      // Creating a report on the that base, as soon as the file is downloaded by this server.

      new Report(newReport).save().then((newReport) => {

        const ext = path.extname(req.file.originalname);

        res.render('loading', {reportId: newReport.id});
        // The front needs the report id to be able to make an identified request

        // Start the scripts
        if(ext == '.docm') {
          docManager(newReport._id);
        } else if(ext == '.mdl' || ext == '.slx') {
          mdlManager(newReport._id);
        }  
        
      }).catch((err) => {
        // Creating a flash error msg:
        req.flash('error_msg', 'Error on save requisition on database');
        
        res.redirect('/upload');

        console.log('[Me]');
        console.log(err);  
      });
    }
  });
});


module.exports = router;