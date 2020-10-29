
module.exports = app => {
    const News = require("../controllers/new.controller.js");
    const uploadFilesMiddleware = require("../middleware/uploadFiles.middleware.js");
    const { isAuth } = require("../middleware/auth.middleware.js");

    // Create a new new
    app.post("/news", isAuth, uploadFilesMiddleware, News.create);

    // Retrieve all news
    app.get("/news", isAuth, News.findAll);

    // Retrieve a single new with newId
    app.get("/news/:newId", isAuth, News.findOne);

    // Update a new with newId
    app.put("/news/:newId", isAuth, uploadFilesMiddleware, News.update);

    // Delete a new with newId
    app.delete("/news/:newId", isAuth, News.delete);

    // Create a new new
    app.delete("/news/removeAll", isAuth, News.deleteAll);
};