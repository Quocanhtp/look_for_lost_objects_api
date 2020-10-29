module.exports = app => {
    const Users = require("../controllers/user.controller.js");
    const { isAuth } = require("../middleware/auth.middleware.js");
    
    // Create a new user
    app.post("/users", Users.create);

    // Retrieve all users
    app.get("/users", isAuth, Users.findAll);

    // Retrieve a single user with userId
    app.get("/users/:userId", isAuth, Users.findOne);

    // Update a user with userId
    app.put("/users/:userId", isAuth, Users.update);

    // Delete a user with userId
    app.delete("/users/:userId", isAuth, Users.delete);

    // Create a new user
    app.delete("/users/removeAll", isAuth, Users.deleteAll);
};