const fs = require("fs");

try {
    JSON.parse(fs.readFileSync("sqlite.json", { encoding: 'utf8', flag: 'r' }));
} catch (err) {
    fs.writeFileSync("sqlite.json", "{}");
}

module.exports = { 
    set: require("./methods/set.js"),
};