const fs = require("fs");
const isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
class DataBase {
  static _dirnameSplit = __dirname.split("/");
  static path = this._dirnameSplit.slice(0, this._dirnameSplit.includes("node_modules")
    ? this._dirnameSplit.indexOf("node_modules") - 1
    : this._dirnameSplit.length).join("/");
  static json = require(DataBase.path + "/sqlite.json");

  constructor(key) {
    if (!key) throw TypeError("No key specified.");
    if (typeof key != "string") throw TypeError("The key value must be a string!");
    //this.key = key;

    this.keySplit = key.split(".").filter(key => key != "").map(key => `["${key}"]`);
  };
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
  get() {
    return eval("DataBase.json" + this.keySplit.join("?."));
  }
};
module.exports = DataBase;
