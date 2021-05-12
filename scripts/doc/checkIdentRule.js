/* Check the ident rule inside of the table recived */

const whitchTable = {
    'Signal Table': 3,
    'Parameters Table': 2,
    'Test Values Table': 1,
};

module.exports = (documentObjJs, table) => {
  const tableList = documentObjJs['w:document']['w:body'][0]['w:tbl'];
  // All tables are inside this path.

  const myTable = tableList[tableList.length - whitchTable[table]];
  // The reference of the last 3 table is the end
  
  const rows = myTable['w:tr']; // rows inside of the tables

  let erro = [];

  rows.slice(1).forEach((eachCell, indexCell) => {
    const secondCollumn = eachCell['w:tc'][1]['w:p']; // For this rule, the content is in the second collumn
    
    if(table == 'Test Values Table' && indexCell%2 == 0 && (!secondCollumn[0].hasOwnProperty('w:pPr') || !secondCollumn[0]['w:pPr'][0].hasOwnProperty('w:ind'))) {
      // If the table is Test Values Table, the verification is diferent to the first line
      erro.push('<b>Indentation</b><br>Location: ' + table + ', ID ' + (indexCell + 1) + " <br>Type of error: Wrong indentation for variable's name")
    } else if(table != 'Test Values Table' && secondCollumn[0].hasOwnProperty('w:pPr') && secondCollumn[0]['w:pPr'][0].hasOwnProperty('w:ind')) {
      // The verification to the first line is diferente, because is a name and the other are descriptions
      erro.push('<b>Indentation</b><br>Location: ' + table + ', ID ' + (indexCell + 1) + " <br>Type of error: Wrong indentation for variable's name")
    }
    
    let erroradded = false;
    // The check bellow need skip the first line
    secondCollumn.slice(1).forEach((eachLine, indexLine) => {
      if(eachLine.hasOwnProperty('w:pPr')) {
        const wpPr_propertyObj = eachLine['w:pPr'][0];
        if(!wpPr_propertyObj.hasOwnProperty('w:ind') && !erroradded) {
          // If an error is not found in this cell
          
          erroradded = true;
          erro.push('<b>Indentation</b><br>Location: ' + table + ', ID ' + (indexCell + 1) + " <br>Type of error: Wrong indentation for variable's description<br>Line " + (indexLine + 1));

        } else if(!wpPr_propertyObj.hasOwnProperty('w:ind')) {
          // If an error has alredy been found
          
          erro[erro.length-1] += "<br>Line " + (indexLine + 1);
        }
      } else {
        // Usually enter here, when has a wrong indent.
        if(!erroradded) {
          // If an error is not found in this cell. 
          erroradded = true;
          erro.push('<b>Indentation</b><br>Location: ' + table + ', ID ' + (indexCell + 1) + " <br>Type of error: Wrong indentation for variable's description<br>Line " + (indexLine + 1));
        } else {
          // If an error has alredy been found
          erro[erro.length-1] += "<br>Line " + (indexLine + 1);
        }
      }
    });
  });        

  return erro; // Return a list of erros
};