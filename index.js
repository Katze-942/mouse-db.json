const fs = require("fs");
const db = require("./DataBase.js");
try {
    if (Object.prototype.toString.call(require(db.path + "/sqlite.json")) !== "[object Object]") throw TypeError("!");
} catch {
    fs.writeFileSync(db.path + "/sqlite.json", "{}");
}
db.json = require(db.path + "/sqlite.json");

const alilases = {
    "get": "fetch",
    "has": "exists",
    "remove": "subtract"
}

const file_exports = {};
file_exports.table = db;
const methods = ["add", "all", "push", "set", "get", "has", "delete", "remove"];
for (let i = 0; i < methods.length; i++) {
    file_exports[methods[i]] = (key, ...args) => new db(key)[methods[i]](...args);
    if (alilases[methods[i]]) file_exports[alilases[methods[i]]] = file_exports[methods[i]];
}
module.exports = file_exports;