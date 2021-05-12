/* Get the text from docm */

/*
  All docm files are zip files and there are xml files inside of docm, with the real content
  The more requested information is inside of the /word/document.xml
*/

const StreamZip = require('node-stream-zip'); // manage zip files
const parseString = require('xml2js').parseString; // Turn the xml on javascript object

const extractText = (filePath, archName) => new Promise((resolve, reject) => {
  // When is resolved, returns a string with the xml 
  
  const zip = new StreamZip({
    file: filePath,
    storeEntries: true
  });
  
  zip.on('ready', () => {
    
    let chunks = [];
    let content = '';
    zip.stream(archName, (err, stream) => {
      if (err) {
        reject(err);
      }
      stream.on('data', function(chunk) {
        chunks.push(chunk);
      });
      stream.on('end', function() {
        content = Buffer.concat(chunks);
        zip.close();
        resolve(content.toString());
      });
    });
  });
});

module.exports = async (filePath, archName) => {
  // Returns a javascript object
  
  let text = await extractText(filePath, archName); // Get the text from the archName needed inside of the docm
  let documentObjJs;
  await parseString(text, (err, result) => {
    if(err) {
      myReportRequest.done = -1;
      myReportRequest.save();
      
      console.log('Error on parse XML content.');
    }
    documentObjJs = result;
  });        
  return documentObjJs;
};