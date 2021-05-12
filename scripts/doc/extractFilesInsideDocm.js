/* Get all the files inside docm */

const StreamZip = require('node-stream-zip'); // Manaeg zip files

module.exports = (filePath) => new Promise((resolve, reject) => {
  let listFilesInsideDocm = [];
  
  const zip = new StreamZip({
    file: filePath,
    storeEntries: true
  });

  const a = zip.on('ready', () => {
    for (const entry of Object.values(zip.entries())) {
      listFilesInsideDocm.push(`${entry.name}`)
    }
    zip.close()
    resolve(listFilesInsideDocm)
  });
}) 



