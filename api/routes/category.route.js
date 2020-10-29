module.exports = app => {
    const Categories = require("../controllers/category.controller.js");
    const { isAuth } = require("../middleware/auth.middleware.js");

    // Create a new new
    app.post("/categories", isAuth, Categories.create);

    // Retrieve all categories
    app.get("/categories", isAuth, Categories.findAll);

    // Retrieve a single new with categoryId
    app.get("/categories/:categoryId", isAuth, Categories.findOne);

    // Update a new with categoryId
    app.put("/categories/:categoryId", isAuth, Categories.update);

    // Delete a new with categoryId
    app.delete("/categories/:categoryId", isAuth, Categories.delete);

    // Create a new new
    app.delete("/categories", isAuth, Categories.deleteAll);
};