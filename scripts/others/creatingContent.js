/* Crating the contento to be in text file */

module.exports = (listContents, fileName) => {
  let strLine = '';

  strLine += 'This file originates from ' + fileName + '\n';
  strLine += 'File generated ' + Date(Date.now()) + '\n\n';

  listContents.forEach((element, index) => {
    strLine += 'ERROR NUMBER ' + index + ':\n'
    
    strLine += element; 
    strLine += '\n\n'; 
  });
   
  strLine = strLine.replace(/<br>/g, '\n');
  strLine = strLine.replace(/<b>/g, '');
  strLine = strLine.replace(/<\/b>/g, '');
  return strLine;
}