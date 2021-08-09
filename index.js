const fs = require("fs");

try {
    JSON.parse(fs.readFileSync("sqlite.json", { encoding: 'utf8', flag: 'r' }));
} catch (err) {
    fs.writeFileSync("sqlite.json", "{}");
}

const file_exports = {};
fs.readdirSync("./methods").filter(file => file.endsWith(".js")).forEach(file => {
    file = file.slice(0, -3);
    const fileSplit = file.split("-");
    if (fileSplit.length == 1) file_exports[file] = require("./methods/" + file + ".js");
    else fileSplit.forEach(f => file_exports[f] = require("./methods/" + file + ".js"));
});

module.exports = file_exports;