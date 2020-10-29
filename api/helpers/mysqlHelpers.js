const { forIn } = require("lodash");

function queryUpdate(objects) {
    const fields = [];
    const values = [];

    for (const key in objects) {

        if (objects.hasOwnProperty(key)) {
            const value = objects[key]
            fields.push(`${key} = ?`);
            values.push(value);
        }
    }
    return { fields, values }
}

async function transaction(pool, callback, callbackError = null) {

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {

        await callback(connection);
        await connection.commit();

    } catch (err) {
        await connection.rollback();
        // callbackError && callbackError(err)
        // Throw the error again so others can catch it.
        throw err;
    } finally {
        connection.release();
    }
}

module.exports = {
    queryUpdate,
    transaction
}