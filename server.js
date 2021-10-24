const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

var corsOptions = {
    origin: 'http://localhost:3001'
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// express on its own has no notion
// of a "file". The express.static()
// middleware checks for a file matching
// the `req.path` within the directory
// that you pass it. In this case "GET /js/app.js"
// will look for "./assets/js/app.js".
app.use(express.static(path.join(__dirname, 'assets')));

//const db = require("models");
//db.sequelize.sync({ force: true }).then(() => {
//    console.log("Drop and re-sync db.");
//});

// simple route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
require("./app/routes/exit.routes")(app);
require("./app/routes/location.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});