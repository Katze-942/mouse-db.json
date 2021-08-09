const fs = require("fs");

const path = require("./tools.js").pathFixed();

try {
    require(path + "/sqlite.json");
} catch {
    fs.writeFileSync(path + "/sqlite.json", "{}");
}

const file_exports = {};
fs.readdirSync("./methods").filter(file => file.endsWith(".js")).forEach(file => {
    file = file.slice(0, -3);
    const fileSplit = file.split("-");
    if (fileSplit.length == 1) file_exports[file] = require("./methods/" + file + ".js");
    else fileSplit.forEach(f => file_exports[f] = require("./methods/" + file + ".js"));
});

module.exports = file_exports;