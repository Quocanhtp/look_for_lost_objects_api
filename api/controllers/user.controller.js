const User = require("../models/user.model.js");
var md5 = require('md5');
const { handleServerError, handleSuccess, handleBadRequest, handleNotFound } = require("../helpers/response.js");
const { hashPassword } = require("../helpers/bcryptHelper.js");
const { v4: uuidv4 } = require('uuid');

// Create and Save a new User
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
        return handleBadRequest(res, "Content can not be empty!")
    }
    if (req.body.password) {
        req.body.password = hashPassword(req.body.password)
    }
    // Create a User
    const user = new User({
        id: uuidv4(),
        email: req.body.email,
        full_name: req.body.full_name,
        phone_number: req.body.phone_number,
        password: req.body.password,
        address: req.body.address,
        district: req.body.district,
        city: req.body.city,
        status: req.body.status,
        permission_level_id: JSON.stringify([])
    });

    const { err, result } = await User.create(user)
    if (err)
        handleServerError(res, err.message || "Some error occurred while creating the User.")
    else
        handleSuccess(res, '', result);
    // Save Customer in the database
    // User.create(user, (err, data) => {
    //     if (err)
    //         handleServerError(res, err.message || "Some error occurred while creating the User.")
    //     else
    //         handleSuccess(res, '', data);
    // });
};

// Retrieve all Users from the database.
exports.findAll = async (req, res) => {

    let page_size = req.query.page_size && req.query.page_size <= 100 ? parseInt(req.query.page_size) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? (req.query.page > 0 ? req.query.page - 1 : 0) : 0;
        }
    }
    const { err, result } = await User.getAll(page_size, page)
    if (err)
        handleServerError(res, err.message || "Some error occurred while creating the User.")
    else handleSuccess(res, '', result);
};

// Find a single User with a userId
exports.findOne = async (req, res) => {
    const { err, result } = await User.findById(req.params.userId)
    if (err) {
        if (err.kind === "not_found") {
            return handleNotFound(res, `Not found User with id ${req.params.userId}.`)
        } else {
            handleServerError(res, "Error retrieving User with id " + req.params.userId)
        }
    } else handleSuccess(res, '', result);

};

// Update a User identified by the userId in the request
exports.update = async (req, res) => {
    // Validate Request
    if (!req.body) {
        return handleBadRequest(res, "Content can not be empty!")
    }

    if (req.body.password) {
        req.body.password = hashPassword(req.body.password)
    }

    if (req.body.phone_number) {
        delete req.body.phone_number
    }

    const { err, result } = await User.updateById(req.params.userId, req.body)

    if (err) {
        if (err.kind === "not_found") {
            handleNotFound(res, `Not found User with id ${req.params.userId}.`)
        } else {
            handleServerError(res, "Error updating User with id " + req.params.userId)
        }
    } else handleSuccess(res, '', result);

};

// Delete a User with the specified userId in the request
exports.delete = async (req, res) => {
    const { err, result } = User.remove(req.params.userId)
    if (err) {
        if (err.kind === "not_found") {
            handleNotFound(res, `Not found User with id ${req.params.userId}.`)
        } else {
            handleServerError(res, "Could not delete User with id " + req.params.userId)
        }
    } else handleSuccess(res, `User was deleted successfully!`);
};

// Delete all Users from the database.
exports.deleteAll = async (req, res) => {
    const { err, result } = await User.removeAll()
    if (err)
        handleServerError(res, err.message || "Some error occurred while removing all users.")
    else handleSuccess(res, `All User were deleted successfully!`);
};