/* Check if the parameters in Parameters Table that is not external are in Test Values Table */

const getParameters = require('./getParameters');
const getValues = require('./getValues');
const removeSpace = require('./removeSpace');

module.exports = (documentObjJs) => {
    
  let erro = [];
  
  let parameters = getParameters(documentObjJs); // recive the list of variables from Parameters Table
  let values = getValues(documentObjJs); // recive the list of variables from Test Values Table

  // Check if there are spaces inside of the names
  let removeSpaceResponse = removeSpace(parameters, 'Parameters Table'); 
  erro = erro.concat(removeSpaceResponse.erro);
  parameters = removeSpace(parameters).response;

  removeSpaceResponse = removeSpace(values);
  erro = erro.concat(removeSpaceResponse.erro);
  values = removeSpace(values, 'Test Values Table').response;

  // Compare parameters and values, erasing elements from both if the parameter is in the values table  
  let i = 0;
  while(i < parameters.length) {
    const standardLength = parameters.length;
    let j = 0;
    while(j < values.length) {
      if(parameters[i] == values[j]) {
        parameters = parameters.slice(0,i).concat(parameters.slice(i+1));
        values = values.slice(0,j).concat(values.slice(j+1));
      } else {
        j += 1;
      }
    }
    if(!parameters.length != standardLength) {
      i += 1;
    }
  }

  // If paremeters list and values list are not empty, it means that some variables are not present in both tables.  
  parameters.forEach((parameter) => {
    erro.push('<b>Missing Variable</b><br>Location: Parameter Table<br>Type: Variable ' + parameter + ' in this table is missing from Test Values Table'); 
  });
  values.forEach((value) => {
    erro.push('<b>Missing Variable</b><br>Location: Test Values Table<br>Type: Variable ' + values + ' in this table is missing from Parameters Table'); 
  });

  return erro;
}