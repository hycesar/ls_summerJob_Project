/* Setting data base */

const mongoose = require('mongoose'); // Mongoose allows better management of mongodb by nodejs

const uriAtlas = "mongodb+srv://dbUser:dbUser@cluster0-aw3ds.mongodb.net/test?retryWrites=true&w=majority";
// This link is created when you create a cluster on mongodb
// The cluster used here is hosted on mongodb's online tool called MongoDb Atlass

mongoose.Promise = global.Promise;
mongoose.connect(uriAtlas).then(() => {
    console.log('[Me] Conected on database!');
}).catch((err) => {
    console.log('[Me] Error unable to connect to database: ' + err);
});
