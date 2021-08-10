const DataBase = require("../DataBase.js");
module.exports = (key, value) => {
    const db = new DataBase(key);

    // Добавляем значение к массиву или создаём его.
    let data = db.get();
    if (Array.isArray(data)) data.push(value);
    else data = [value];

    db.set(data);
    return data;
}
