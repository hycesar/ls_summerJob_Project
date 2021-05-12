/* Get all parameters inside the Parameters Tables that are not external */

module.exports = (documentObjJs) => {
  // Returns an array

  const tableList = documentObjJs['w:document']['w:body'][0]['w:tbl'];
  const parametersTable = tableList[tableList.length - 2];
  const rows = parametersTable['w:tr']    

  let allstrs = [];

  rows.forEach((params) => {     
    let str = '';
    params['w:tc'][1]['w:p'][0]['w:r'].forEach((each) => {
      //goingo to the content in second collumn
      str += each['w:t'][0];
    });
    
    let identify = '';

    // The external information are in third collumn
    if(typeof params['w:tc'][2]['w:p'][0]['w:r'][0]['w:t'][0] == typeof '') {
      // If is a text, check this by itself
      identify = params['w:tc'][2]['w:p'][0]['w:r'][0]['w:t'][0];
    } else {
      // If is not a text, is a object, and need to check the firt property that is called by '_'
      identify = params['w:tc'][2]['w:p'][0]['w:r'][0]['w:t'][0]['_'];
    }

    if(!identify.match(/External/)){
      allstrs.push(str);
    };
  });
      
  return allstrs.slice(1);
};