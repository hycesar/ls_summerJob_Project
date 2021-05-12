/* Get all values inside the Test Values Tables */

module.exports = (documentObjJs) => {
  // Returns an array

  const tableList = documentObjJs['w:document']['w:body'][0]['w:tbl'];
  const signalTable = tableList[tableList.length - 1];
  const rows = signalTable['w:tr']    

  let allstrs = [];

  rows.forEach((params, i) => {     
    if(i%2 == 1) { // Skipping the rows that don't have the name of the variable
    } else {
      let str = '';
      params['w:tc'][1]['w:p'][0]['w:r'].forEach((each) => {
        str += each['w:t'][0];
      });
      allstrs.push(str);
    }
  });
    
    return allstrs.slice(1);
}