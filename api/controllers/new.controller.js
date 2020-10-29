const New = require("../models/new.model.js");
const Image = require("../models/image.model.js");
const UsingImage = require("../models/using_image.model.js");
const { handleServerError, handleSuccess, handleBadRequest, handleNotFound } = require("../helpers/response.js");
const { changeToSlug } = require('../helpers/utils');
const fs = require('fs')
const path = require('path')

const { v4: uuidv4 } = require('uuid');
const { USING_TYPE, PATH_IMAGE } = require("../contants/index.js");

// Create and Save a new New
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
        return handleBadRequest(res, "Content can not be empty!")
    }

    try {
        const new_id = uuidv4()
        const images = []
        const using_images = []

        if (req.files.length <= 0) {
            using_images = []
        } else {
            req.files.map(file => {
                const image_id = uuidv4()

                using_images.push(new UsingImage({
                    relation_id: new_id,
                    using_type: USING_TYPE.new,
                    image_id: image_id,
                }))

                images.push(new Image({
                    id: image_id,
                    name: file.filename,
                    path: `${PATH_IMAGE}${file.filename}`
                }))
            })
        }

        const newImages = images.map(i => {
            const array = Object.values(i);
            return array;
        })

        const newUsingImages = using_images.map(i => {
            const array = Object.values(i);
            return array;
        })

        // Create a New
        const new_ = new New({
            id: new_id,
            user_id: req.user?.id ?? null,
            category_id: req.body.category_id,
            title: req.body.title,
            slug: changeToSlug(req.body.title),
            content: req.body.content,
            address: req.body.address,
            district: req.body.district,
            city: req.body.city,
            status: req.body.status
        });

        const { err, result } = await New.create(new_, newImages, newUsingImages)

        if (err) {
            try {
                //file removed
                images.map(i => {
                    fs.unlinkSync(path.join(__dirname, `../../public/images/${i.name}`))
                })
            } catch (error) {
                console.error(error)
            }
            handleServerError(res, err.message || "Some error occurred while creating the New.")
        } else
            handleSuccess(res, '', result);

    } catch (error) {
        console.log("exports.create -> error", error)
        handleServerError(res, error.message || '')
    }
};

// Retrieve all News from the database.
exports.findAll = async (req, res) => {

    let page_size = req.query.page_size && req.query.page_size <= 100 ? parseInt(req.query.page_size) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? (req.query.page > 0 ? req.query.page - 1 : 0) : 0;
        }
    }

    const { err, result } = await New.getAll(page_size, page)
    if (err)
        handleServerError(res, err.message || "Some error occurred while creating the New.")
    else handleSuccess(res, '', result);
};

// Find a single New with a new_Id
exports.findOne = async (req, res) => {
    const { err, result } = await New.findById(req.params.newId)
    if (err) {
        if (err.kind === "not_found") {
            return handleNotFound(res, `Not found New with id ${req.params.newId}.`)
        } else {
            handleServerError(res, "Error retrieving New with id " + req.params.newId)
        }
    } else
        handleSuccess(res, '', result);
};

// Update a New identified by the new_Id in the request
exports.update = async (req, res) => {
    // Validate Request
    if (!req.body) {
        return handleBadRequest(res, "Content can not be empty!")
    }

    if (req.files?.length >= 0) {
        console.log(req.files)
    } else {
        console.log("Not files")
    }

    if (req.body.title) {
        const slug = changeToSlug(req.body.title)
        req.body.slug = slug
    }

    const { err, result } = await New.updateById(req.params.newId, req.body)
    if (err) {
        if (err.kind === "not_found") {
            handleNotFound(res, `Not found New with id ${req.params.newId}.`)
        } else {
            handleServerError(res, "Error updating New with id " + req.params.newId)
        }
    } else handleSuccess(res, '', result);
};

// Delete a New with the specified newId in the request
exports.delete = async (req, res) => {

    const { err, result } = await New.remove(req.params.newId)
    if (err) {
        if (err.kind === "not_found") {
            handleNotFound(res, `Not found New with id ${req.params.newId}.`)
        } else {
            handleServerError(res, "Could not delete New with id " + req.params.newId)
        }
    } else handleSuccess(res, `New was deleted successfully!`);
};

// Delete all News from the database.
exports.deleteAll = async (req, res) => {
    const { err, result } = await New.removeAll()
    if (err)
        handleServerError(res, err.message || "Some error occurred while removing all new_s.")
    else handleSuccess(res, `All New were deleted successfully!`);
};