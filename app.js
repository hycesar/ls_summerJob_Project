/* This file configures all routes that are used in server. */

const app = require('./config/server');
require('./config/db');

const home = require('./routes/home');
app.use('/', home);

const upload = require('./routes/upload');
app.use('/upload', upload);

const report = require('./routes/report');
app.use('/report', report);

const PORT = 3030;
app.listen(PORT, () => {
    console.log('[Me] Server on ' + PORT + '...'); 
});