const { TODO_STATUS } = require('../contants/index.js');
const { queryUpdate } = require('../helpers/mysqlHelpers.js');
const sql = require("./db.js");

// constructor
const Image = function (Image) {
    this.id = Image.id;
    this.name = Image.name;
    this.path = Image.path ?? null;
    this.is_active = Image.is_active ?? TODO_STATUS.active;
}


Image.createMultiple = async (newImages, result) => {
    sql.query("INSERT INTO images (id, name, path, is_active) VALUES ?", [newImages], (err, res) => {
        if (err) {
            result(err, null);
        }
        result(null, res.affectedRows);
    });

};

module.exports = Image;