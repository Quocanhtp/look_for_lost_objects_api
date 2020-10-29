const Category = require("../models/category.model.js");
const { handleServerError, handleSuccess, handleBadRequest, handleNotFound } = require("../helpers/response.js");
const { changeToSlug } = require('../helpers/utils')

// Create and Save a new Category
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return handleBadRequest(res, "Content can not be empty!")
    }

    // Create a Category
    const category = new Category({
        name: req.body.name,
        category_id: req.body.category_id,
        slug: changeToSlug(req.body.name),
        descriptions: req.body.descriptions,
        sort: req.body.sort,
        is_active: req.body.is_active
    });

    // Save Customer in the database
    Category.create(category, (err, data) => {
        if (err)
            handleServerError(res, err.message || "Some error occurred while creating the Category.")
        else
            handleSuccess(res, '', data);
    });
};

// Retrieve all Categorys from the database.
exports.findAll = (req, res) => {
    Category.getAll((err, data) => {
        if (err)
            handleServerError(res, err.message || "Some error occurred while creating the Category.")
        else handleSuccess(res, '', data);
    });
};

// Find a single Category with a categoryId
exports.findOne = (req, res) => {
    Category.findById(req.params.categoryId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return handleNotFound(res, `Not found Category with id ${req.params.categoryId}.`)
            } else {
                handleServerError(res, "Error retrieving Category with id " + req.params.categoryId)
            }
        } else
            handleSuccess(res, '', data);
    });
};

// Update a Category identified by the categoryId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        return handleBadRequest(res, "Content can not be empty!")
    }

    if (req.body.name) {
        const slug = changeToSlug(req.body.name)
        req.body.slug = slug
    }

    Category.updateById(
        req.params.categoryId,
        req.body,
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    handleNotFound(res, `Not found Category with id ${req.params.categoryId}.`)
                } else {
                    handleServerError(res, "Error updating Category with id " + req.params.categoryId)
                }
            } else handleSuccess(res, '', data);
        }
    );
};

// Delete a Category with the specified categoryId in the request
exports.delete = (req, res) => {
    Category.remove(req.params.categoryId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                handleNotFound(res, `Not found Category with id ${req.params.categoryId}.`)
            } else {
                handleServerError(res, "Could not delete Category with id " + req.params.categoryId)
            }
        } else handleSuccess(res, `Category was deleted successfully!`);
    });
};

// Delete all Categorys from the database.
exports.deleteAll = (req, res) => {
    Category.removeAll((err, data) => {
        if (err)
            handleServerError(res, err.message || "Some error occurred while removing all categorys.")
        else handleSuccess(res, `All Category were deleted successfully!`);
    });
};