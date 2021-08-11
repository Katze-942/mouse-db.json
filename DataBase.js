const fs = require("fs");
const isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
class DataBase {
  static _dirnameSplit = __dirname.split("/");
  static path = this._dirnameSplit // Глобальный путь до проекта.
    .slice(0, this._dirnameSplit.includes("node_modules")
      ? this._dirnameSplit.indexOf("node_modules") - 1
      : this._dirnameSplit.length).join("/");
  static json;// json файл.

  constructor(key) {
    try {
      DataBase.json = require(DataBase.path + "/sqlite.json");
      if (Object.prototype.toString.call(DataBase.json) !== "[object Object]") throw TypeError("!");
    } catch {
      DataBase.json = {};
      fs.writeFileSync(DataBase.path + "/sqlite.json", "{}");
    }
    this.setKey(key);
  };

  _checkKey(key) {
    if (!key) throw TypeError("No key specified.");
    if (typeof key != "string") throw TypeError("The key value must be a string!");
  }

  // Сохранить ключ.
  setKey(key) {
    this._checkKey(key);

    this.keySplit = key.split(".").filter(key => key != "").map(key => `["${key}"]`);
  }

  // Прибавить ключ.
  addKey(key) {
    this._checkKey(key);
    this.keySplit = this.keySplit.concat(key.split(".").filter(key => key != "").map(key => `["${key}"]`));
  }

  // Убрать ключ.
  removeKey(num = 1) {
    if (this.keySplit.length == 1) throw Error("You only have one key, you have nothing to clean!");
    if (typeof num != "number") throw TypeError("The value is not a number!");
    if (this.keySplit.length <= num) throw Error(`You have only ${this.keySplit.length} keys, you cannot remove ${num} keys. You can only remove a maximum of ${this.keySplit.length-1}.`)
    this.keySplit = this.keySplit.slice(0, -num);
  }

  // Сохранить значение.
  set(value = null) {
    if (JSON.stringify({ a: value }) === "{}") throw TypeError("Unsupported data type! Check what you are passing as a JSON entry.");
    if (this.keySplit.length > 1 && !isObject(eval("DataBase.json" + this.keySplit.join("?.")))) { // Проверяем, является ли основной путь - объектом. 
      for (let i = 0; i < this.keySplit.length - 1; i++) { // Перебираем каждый ключ и если что присваиваем ему объект.
        if (!isObject(eval("DataBase.json" + this.keySplit.slice(0, i + 1).join("")))) eval("DataBase.json" + this.keySplit.slice(0, i + 1).join("") + "={}");
      };
    };
    eval("DataBase.json" + this.keySplit.join("") + "=value");
    fs.writeFileSync(DataBase.path + "/sqlite.json", JSON.stringify(DataBase.json, null, 4));
    return value;
  }

  // Получить данные по ключу.
  get() { return eval("DataBase.json" + this.keySplit.join("?.")); }

  // Добавить число.
  add(value) {
    if (value == undefined) throw TypeError("Enter the number!");
    if (typeof value != "number") throw TypeError("The value is not a number!");

    let data = this.get();
    if (typeof data === "number") data += value;
    else data = value;

    return this.set(data);
  }

  // Добавить элемент к массиву.
  push(value) { // 
    let data = this.get();
    if (Array.isArray(data)) data.push(value);
    else data = [value];

    return this.set(data);
  }

  all() { return DataBase.json; }
};
module.exports = DataBase;
