const { TODO_STATUS } = require('../contants/index.js');
const { queryUpdate } = require('../helpers/mysqlHelpers.js');
const sql = require("./db.js");

// constructor
const Category = function (Category) {
  this.name = Category.name;
  this.category_id = Category.category_id;
  this.slug = Category.slug;
  this.descriptions = Category.descriptions;
  this.sort = Category.sort;
  this.status = Category.status ?? TODO_STATUS.active;
};

Category.create = (category, result) => {
  sql.query("INSERT INTO category SET ?", category, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    sql.query(`SELECT * FROM category WHERE id = ${res.insertId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      delete res[0].password
      // not found Category with the id
      result(null, res[0]);
    });
    return;
    // console.log("created Category: ", { id: res.insertId, ...categoryCategory });
    // result(null, { id: res.insertId, ...categoryCategory });
  });
};

Category.findById = (categoryId, result) => {
  sql.query(`SELECT * FROM category WHERE id = ${categoryId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found category: ", res[0]);
      delete res[0].password
      result(null, res[0]);
      return;
    }

    // not found Category with the id
    result({ kind: "not_found" }, null);
  });
};

Category.getAll = (result) => {
  sql.query(`SELECT * FROM category Where is_active = '${TODO_STATUS.active}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("category: ", res);
    result(null, res);
  });
};

Category.updateById = (id, user, result) => {
  const { fields, values } = queryUpdate(user);

  values.push(id);

  sql.query(
    `UPDATE category SET ${fields.join(', ')} WHERE id = ?`,
    values,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Category with the id
        result({ kind: "not_found" }, null);
        return;
      }

      sql.query(`SELECT * FROM category WHERE id = ${id}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
        delete res[0].password
        // not found Category with the id
        result(null, res[0]);
      });
      return;

      // console.log("updated Category: ", { id: id, ...Category });
      // result(null, { id: id, ...Category });
    }
  );
};

Category.remove = (id, result) => {
  sql.query("DELETE FROM category WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Category with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted category with id: ", id);
    result(null, res);
  });
};

Category.removeAll = result => {
  sql.query("DELETE FROM categorys", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Categorys`);
    result(null, res);
  });
};

module.exports = Category;