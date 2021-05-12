/* Main route, created for make future implementations easier */

const express = require('express'); // express allow the main comunication between frontend and the server by using routes
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/upload');
});

module.exports = router;