const fs = require("fs");

try {
    JSON.parse(fs.readFileSync("sqlite.json", { encoding: 'utf8', flag: 'r' }));
} catch (err) {
    fs.writeFileSync("sqlite.json", "{}");
}

const isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";

function set(key, value) {
    // Проверки...
    if (!key) throw TypeError("No key specified.");
    if (typeof key != "string") throw TypeError("The key value must be a string!");
    if (value === undefined) return;

    // Вызов файла...
    const file = JSON.parse(fs.readFileSync("sqlite.json", { encoding: 'utf8', flag: 'r' }));
    const keySplit = key.split(".").filter(key => key != "").map(key => `["${key}"]`);

    // Обработка...
    if (keySplit.length === 1) file[keySplit[0].slice(2, -2)] = value;
    else if (!isObject(eval("file" + keySplit.join("?.")))) {
        for (let i = 0; i < keySplit.length; i++) {
            if (!isObject(eval("file" + keySplit.slice(0, i + 1).join("")))) eval("file" + keySplit.slice(0, i + 1).join("") + "={}");
        };
        eval("file" + keySplit.join("") + "=value");
    };
    fs.writeFileSync("sqlite.json", JSON.stringify(file, null, 4));
}

module.exports = { set };
// test