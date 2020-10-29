const { TODO_STATUS } = require('../contants/index.js');
const { queryUpdate } = require('../helpers/mysqlHelpers.js');
const { resultValue } = require('../helpers/utils.js');
const pool = require("./db.js");

// constructor
const User = function (User) {
  this.id = User.id;
  this.email = User.email;
  this.full_name = User.full_name;
  this.phone_number = User.phone_number;
  this.password = User.password;
  this.address = User.address;
  this.district = User.district;
  this.city = User.city;
  this.status = User.status ?? TODO_STATUS.active;
  this.permission_level_id = User.permission_level_id ?? JSON.stringify([]);
};

User.create = async (newUser) => {

  try {
    const results = await pool.query("INSERT INTO users SET ?", newUser)

    if (!results[0]) {
      throw new Error("")
    }

    const userNew = await pool.query(`SELECT * FROM users WHERE id = '${newUser.id}'`)

    return resultValue(null, userNew[0][0])

  } catch (error) {
    return resultValue(error, null)
  }
};

User.findById = async (UserId) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = '${UserId}' AND status = ${TODO_STATUS.active}`)

    if (result[0].length < 1) {
      return resultValue({ kind: "not_found" }, null);
    }

    delete result[0][0]?.password
    return resultValue(null, result[0][0]);
  } catch (error) {
    return resultValue(error, null)
  }
};

User.getAll = async (perPage, page) => {
  try {
    const result = await pool.query(`SELECT * FROM users Where status = '${TODO_STATUS.active}' LIMIT ${perPage} OFFSET ${perPage * page}`)
    return resultValue(null, result[0]);
  } catch (error) {
    return resultValue(error, null)
  }
};

User.updateById = async (id, user) => {
  const { fields, values } = queryUpdate(user);
  values.push(id);

  try {
    const result = await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)
    if (result[0].affectedRows == 0) {
      // not found User with the id
      return resultValue({ kind: "not_found" }, null);
    }

    const resultUser = await pool.query(`SELECT * FROM Users WHERE id = '${id}'`)

    delete resultUser[0][0].password

    return resultValue(null, resultUser[0][0]);

  } catch (error) {
    return resultValue(error, null)
  }
};

User.remove = async (id) => {
  try {
    const result = await pool.query(`UPDATE users SET status=${TODO_STATUS.delete} WHERE id = '${id}'`,)
    if (result[0].affectedRows == 0) {
      // not found User with the id
      return resultValue({ kind: "not_found" }, null);
    }
    return resultValue(null, result[0]);

  } catch (error) {
    return resultValue(error, null)
  }
};

User.removeAll = async () => {
  try {
    const result = await pool.query(`UPDATE users SET status=${TODO_STATUS.active}`,)
    if (result[0].affectedRows == 0) {
      // not found User with the id
      return resultValue({ kind: "not_found" }, null);
    }
    return resultValue(null, result[0]);

  } catch (error) {
    return resultValue(error, null)
  }
};

// User.remove = (id, result) => {
//   pool.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     if (res.affectedRows == 0) {
//       // not found User with the id
//       result({ kind: "not_found" }, null);
//       return;
//     }

//     console.log("deleted User with id: ", id);
//     result(null, res);
//   });
// };

// User.removeAll = result => {
//   pool.query("DELETE FROM users", (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log(`deleted ${res.affectedRows} Users`);
//     result(null, res);
//   });
// };

User.checkLogin = async (UserId = '', phone_number = '', password = '') => {
  try {
    const res = await pool.query(`SELECT * FROM users WHERE (id = '${UserId}' and phone_number= '${phone_number}') or (phone_number='${phone_number}' or password='${password}')`);
    if (res[0].length < 1) {
      throw new Error('Post with this id was not found');
    }
    return resultValue(null, res[0][0])
  } catch (error) {
    return resultValue(error, null)
  }
};

module.exports = User;