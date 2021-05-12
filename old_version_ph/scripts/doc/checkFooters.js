/* (1) Useds to check another rule. But it is not ready */

const extractXmlFromDoc = require('./extractXmlFromDoc');

const haveThis = (array, value) => { // check if an array have a item
  for (let i in array) {
    if (array[i] == value) {
      return 1;
    }
  }
  return 0;
}

const copyright = 'FCA – Cesar Summer Job 2019.2';

module.exports = async (listOfFilesInsideDocm, fileAdress, originalFileName) => {
  let errors = [];

  let i = 1;
  let copyrightAlright = false;
  let fileNameAlright = false;
  let archPath = 'word/footer' + i + '.xml';

  // Checking inside of each footer file
  while (haveThis(listOfFilesInsideDocm, archPath)) {
    console.log(i);

    // Relevant content inside footer file
    const footer = (await extractXmlFromDoc(fileAdress, archPath))['w:ftr']['w:p'];

    let textInsideFooter = [];
    let auxTextInside = [];

    // console.log('------------');
    footer.forEach((element) => { // checking inside each paragraph
      element['w:r'].forEach((anotherElement) => {
        if (anotherElement.hasOwnProperty('w:t')) {
          
          const elto = anotherElement['w:t'][0]
          auxTextInside.push(elto);

          if (typeof elto != typeof '') {
            if (elto.hasOwnProperty('_')) {
              // Some times, the text is separate by a xml property
              // So, if is not a text, is a object
              
              textInsideFooter[textInsideFooter.length - 1] += elto['_'];
            } else {
              textInsideFooter.push('');
            }
          } else {
            textInsideFooter.push(elto)
          }
          
        }
      })
    });

    // console.log('------------');
    // console.log(textInsideFooter);
    // console.log('------------');
    // console.log(auxTextInside);

    i += 1;
    archPath = 'word/footer' + i + '.xml';

  }


  if (!copyrightAlright) {
    errors.push('<b>Wrong Footer</b><br>Location: Footer<br>Type: Correct copyright can not be found');
  }
  
  if (!fileNameAlright) {
    errors.push('<b>Wrong Footer</b><br>Location: Footer<br>Type: Correct file name can not be found');
  }

  return errors;

}