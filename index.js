const fs = require("fs");
const db = require("./DataBase.js");
try {
    if (Object.prototype.toString.call(require(db.path + "/sqlite.json")) !== "[object Object]") throw TypeError("!");
} catch {
    fs.writeFileSync(db.path + "/sqlite.json", "{}");
}
db.json = require(db.path + "/sqlite.json");

const file_exports = {};
file_exports.table = db;
const methods = ["add", "all", "push", "set", "get"];
for (let i = 0; i < methods.length; i++) {
    file_exports[methods[i]] = (key, ...args) => new db(key)[methods[i]](...args);
}
module.exports = file_exports;