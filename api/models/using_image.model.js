const { USING_TYPE } = require("../contants/index.js");
const sql = require("./db.js");

// constructor
const UsingImage = function (UsingImage) {
    this.using_type = UsingImage.using_type ?? USING_TYPE.user;
    this.relation_id = UsingImage.relation_id;
    this.image_id = UsingImage.image_id;
}

UsingImage.createMultiple = (newUsingImages, result) => {
    sql.query("INSERT INTO using_images (using_type, relation_id, image_id) VALUES ?", [newUsingImages], (err, res) => {
        if (err) {
            console.log("UsingImage.createMultiple -> err", err)
            result(err, null);
            return;
        }
        result(null, res?.affectedRows);
    });
};

module.exports = UsingImage;