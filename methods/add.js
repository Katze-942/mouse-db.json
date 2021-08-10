const DataBase = require("../DataBase.js");
module.exports = (key, value) => {
    const db = new DataBase(key);
    if (value == undefined) throw TypeError("Enter the number!");
    if (typeof value != "number") throw TypeError("The value is not a number!");	

    // Добавляем число или создаём.
    let data = db.get();
    if (typeof data === "number") data += value;
    else data = value;
    
    db.set(data);
    return data;
}
