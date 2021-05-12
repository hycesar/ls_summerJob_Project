/* Remove all spaces inside of the variables name */

module.exports = (strList, table) => {
  // Return an error array
  
  let erro = [];
  for(let i = 0; i < strList.length; i++) {
    if(strList[i].match(/ /)) {
      strList[i] = strList[i].replace(' ', '');
      erro.push('Location: ' + table + '<br>Type of error: There is a space in the variable: ' + strList[i]);
    }
  }
  let objToReturn = {
    erro,
    response: strList,
  };
  return objToReturn;
}