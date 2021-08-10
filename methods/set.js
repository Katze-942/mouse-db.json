const DataBase = require("../DataBase.js");
module.exports = (key, value) => {
    const db = new DataBase(key);
    return db.set(value);
}