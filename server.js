const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Serves all the request which includes /images in the url from Images folder
app.use('/app/images', express.static(__dirname + '/public/images'));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

// simple route
app.get("/api", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

require("./api/routes/index.route.js")(app);

// set port, listen for requests
app.listen(3000, () => {
    console.log("Server is running on port 3000.");
});