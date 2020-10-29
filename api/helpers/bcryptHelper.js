const bcrypt = require('bcrypt')

exports.hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

exports.checkPassword = (password, hash) => {
    const isCheck = bcrypt.compareSync(password, hash)
    return isCheck
}
