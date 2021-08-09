const fs = require("fs");
const { objFixed, pathFixed } = require("../tools.js");
const path = pathFixed();
module.exports = (key, value) => {
    // Проверки...
    if (!key) throw TypeError("No key specified.");
    if (typeof key != "string") throw TypeError("The key value must be a string!");
    if (value === undefined) value = null;

    // Проверка, можно ли записать такой тип данных...
    if (JSON.stringify({ a: value }) === "{}") throw TypeError("Unsupported data type! Check what you are passing as a JSON entry.");

    // Вызов файла...
    let file = require(path + "/sqlite.json");
    const keySplit = key.split(".").filter(key => key != "").map(key => `["${key}"]`);

    // Обработка...
    if (keySplit.length === 1) file[keySplit[0].slice(2, -2)] = value;
    else {
        file = objFixed(file, keySplit);
        eval("file" + keySplit.join("") + "=value");
    }

    // Записываем и возвращаем значение...
    fs.writeFileSync(path + "/sqlite.json", JSON.stringify(file, null, 4));
    return value;
}