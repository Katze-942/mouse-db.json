const fs = require("fs");
const db = require("./DataBase.js");
try {
    db.json = require(db.path + "/sqlite.json");
    if (Object.prototype.toString.call(db.json) !== "[object Object]") throw TypeError("!");
} catch {
    db.json = {}
    fs.writeFileSync(db.path + "/sqlite.json", "{}");
}

const alilases = {
    get: ["fetch"],
    has: ["exists"],
    remove: ["subtract"]
}

const file_exports = {
    all: () => db.json,
};
file_exports.table = db;
const methods = ["add", "push", "set", "get", "has", "delete", "remove"];
for (let i = 0; i < methods.length; i++) {
    file_exports[methods[i]] = (key, ...args) => new db(key)[methods[i]](...args);
    if (alilases[methods[i]]?.length) {
        for (alias of alilases[methods[i]]) {
            file_exports[alias] = file_exports[methods[i]];
        }
    }
}
module.exports = file_exports;
