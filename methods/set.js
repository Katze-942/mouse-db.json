const fs = require("fs");
const { objFixed, pathFixed, checkKeyValue } = require("../tools.js");
const path = pathFixed();
module.exports = (key, val) => {
    const { value } = checkKeyValue(key, val);
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