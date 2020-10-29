module.exports = app => {
    require("./user.route.js")(app);
    require("./category.route.js")(app);
    require("./new.route.js")(app);
    require("./auth.route.js")(app);
}