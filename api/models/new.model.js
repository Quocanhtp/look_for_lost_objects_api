const { TODO_STATUS } = require('../contants/index.js');
const { queryUpdate, transaction } = require('../helpers/mysqlHelpers.js');
const pool = require("./db.js");
const { resultValue } = require('../helpers/utils.js')

// constructor
const New = function (New) {
  this.id = New.id;
  this.user_id = New.user_id;
  this.category_id = New.category_id;
  this.title = New.title;
  this.slug = New.slug;
  this.content = New.content;
  this.address = New.address;
  this.district = New.district;
  this.city = New.city;
  this.status = New.status ?? TODO_STATUS.active;
};

const query_pool = (NewId) => `
SELECT
  news.id,
  news.title,
  news.slug,
  news.user_id,
  news.category_id,
  news.content,
  news.address,
  news.district,
  news.city,
  news.status,
  news.created_at,
  news.updated_at,
  GROUP_CONCAT(
    JSON_OBJECT(
        'id',
        users.id,
        'name',
        users.full_name
    )
  ) AS user_info,
  CONCAT(
      '[',
      GROUP_CONCAT(
          JSON_OBJECT(
              'id',
              images.id,
              'name',
              images.name,
              'path',
              images.path
          )
      ),
      ']'
  ) AS images
FROM
 news
INNER JOIN using_images ON using_images.relation_id = news.id
INNER JOIN images ON using_images.image_id = images.id
INNER JOIN users ON users.id = news.user_id
WHERE
  using_images.using_type = 'NEW' AND news.id = '${NewId}' AND news.status = ${TODO_STATUS.active}
GROUP BY news.id
ORDER BY news.created_at DESC
`

New.create = async (newNew, newImages, newUsingImages) => {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {

    await connection.query("INSERT INTO images (id, name, path, status) VALUES ?", [newImages])
    await connection.query("INSERT INTO using_images (using_type, relation_id, image_id) VALUES ?", [newUsingImages])
    const resNew = await connection.query("INSERT INTO news SET ?", newNew)
    if (!resNew[0]) {
      throw new Error("")
    }
    const query = query_pool(newNew.id)
    const userNew = await connection.query(query)
    await connection.commit();
    
    return resultValue(null, userNew[0][0])
  } catch (err) {
    await connection.rollback();
    return resultValue(err, null)
  } finally {
    connection.release();
  }
  // try {
  //   await transaction(pool, async connection => {
  //     await connection.query("INSERT INTO images (id, name, path, status) VALUES ?", [newImages])
  //     await connection.query("INSERT INTO using_images (using_type, relation_id, image_id) VALUES ?", [newUsingImages])
  //     const resNew = await connection.query("INSERT INTO news SET ?", newNew)
  //     if (!resNew[0]) {
  //       throw new Error("")
  //     }
  //     // const query = query_pool(newNew.id)
  //     // const userNew = await connection.query(query)

  //     // return resultValue(null, resNew[0])
  //   })
  // } catch (error) {
  //   // return resultValue(error, null)
  // }
};

New.findById = async (NewId) => {
  try {
    const query = query_pool(NewId)
    const result = await pool.query(query)

    if (result[0].length < 1) {
      return resultValue({ kind: "not_found" }, null);
    }

    return resultValue(null, result[0][0]);
  } catch (error) {
    return resultValue(error, null)
  }
};

New.getAll = async (perPage, page) => {
  try {
    const result = await pool.query(`SELECT * FROM news Where status = '${TODO_STATUS.active}' LIMIT ${perPage} OFFSET ${perPage * page}`)
    return resultValue(null, result[0]);
  } catch (error) {
    return resultValue(error, null)
  }
};

New.updateById = async (id, user) => {
  const { fields, values } = queryUpdate(user);
  values.push(id);

  try {
    const result = await pool.query(`UPDATE news SET ${fields.join(', ')} WHERE id = ?`, values)
    if (result[0].affectedRows == 0) {
      // not found User with the id
      return resultValue({ kind: "not_found" }, null);
    }

    const query = query_pool(id)
    const resultUser = await pool.query(query)

    return resultValue(null, resultUser[0][0]);

  } catch (error) {
    return resultValue(error, null)
  }
};

New.remove = async (id) => {
  try {
    const result = await pool.query(`UPDATE news SET status=${TODO_STATUS.delete} WHERE id = '${id}'`,)
    if (result[0].affectedRows == 0) {
      // not found User with the id
      return resultValue({ kind: "not_found" }, null);
    }
    return resultValue(null, result[0]);

  } catch (error) {
    return resultValue(error, null)
  }
};

New.removeAll = async () => {
  try {
    const result = await pool.query(`UPDATE news SET status=${TODO_STATUS.active}`,)
    if (result[0].affectedRows == 0) {
      // not found User with the id
      return resultValue({ kind: "not_found" }, null);
    }
    return resultValue(null, result[0]);

  } catch (error) {
    return resultValue(error, null)
  }
};

module.exports = New;