const { isAuth } = require("../middleware/auth.middleware.js");

module.exports = app => {
    const Auth = require("../controllers/auth.controller.js");

    // Create a new user
    app.post("/auth/login", Auth.login);

    // Retrieve all users
    app.get("/auth/me", isAuth, Auth.me);

};