"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const printIndices_1 = require("./tools/printIndices");
const scan_tools_1 = require("./tools/scan-tools");
const writeFile_1 = require("./tools/writeFile");
const checkFile_1 = require("./tools/checkFile");
const DBError_1 = require("./DBError");
const isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
const _dirnameSplit = __dirname.split("/");
;
;
;
/**
 * Database class, contains settings, key and functions
*/
class DataBase {
    constructor(key, config) {
        this.config = {};
        if (key !== undefined) {
            if (!config) {
                if (typeof key !== "string" && !isObject(key))
                    throw new DBError_1.default(`Unknown data type "${typeof key}" during class initialization. Specify either a key or a object.`, { code: 100 });
            }
            else {
                if (typeof key !== "string")
                    throw new DBError_1.default(`The first argument of the class initialization must be a string (key), not "${typeof key}"\nIf you want to put a configuration instead of a key, remove the second argument`, { code: 101, value: key });
                if (config && !isObject(config))
                    throw new DBError_1.default(`The second argument to the initialization of the class must be an object! You have type "${typeof config}"`, { code: 102, value: config });
            }
            ;
            if (typeof key === "string")
                this.setKey(key);
        }
        else
            this.key = [];
        let value = isObject(key) ? key : config;
        if (!value)
            value = {};
        this.setConfig(value, true);
    }
    ;
    // Функция для проверки ключа.
    _checkKey(key, functionName, checkGlobalKey = true) {
        if (checkGlobalKey && !key && !this.key.length)
            throw new DBError_1.default("You did not specify a key or value when initializing the class, you must now specify it in functions!", { code: 200.1, functionName, key });
        if (typeof key != "string")
            throw new DBError_1.default("The key value must be a string!", { code: 201, functionName, key });
    }
    ;
    // Функция для разделения ключа.
    _splitKey(key) {
        return key.split(".").filter(key => key != "");
    }
    ;
    setConfig(config, local) {
        if (!config)
            throw new DBError_1.default("Specify config!", { code: 400, functionName: "setConfig" });
        if (!isObject(config))
            throw new DBError_1.default("The configuration must be in the form of an object!", { code: 401, functionName: "setConfig" });
        const configModel = DataBase.configModel;
        for (let i = 0; i < configModel.length; i++) {
            if (!config[configModel[i].name]) {
                configModel[i].check(configModel[i].default);
                this.config[configModel[i].name] = configModel[i].default;
            }
            else {
                const value = config[configModel[i].name];
                if (typeof value !== configModel[i].type)
                    throw new DBError_1.default(`The type is incorrectly specified in the setting "config.${configModel[i].name}". Type is required: "${configModel[i].type}", and you have: "${typeof value}"`, { code: 402 });
                configModel[i].check(value);
                this.config[configModel[i].name] = config[configModel[i].name];
                if (!local)
                    DataBase.config[configModel[i].name] = config[configModel[i].name];
            }
            ;
        }
        ;
    }
    ;
    _keyHandling(keyString, value, functionName) {
        // Создаём новый ключ...
        const key = this.key.concat(this._splitKey(keyString));
        // Проверяем ошибки в значении.
        if (value)
            scan_tools_1.default(value, "value", { code: 212, functionName, key });
        return {
            process: (callback) => {
                let stop;
                for (let i = 0; i < key.length; i++) {
                    if (stop)
                        break;
                    // Получаем все индексы массивов в ключе.
                    const keyIndices = printIndices_1.default(key[i]);
                    // Обрезаем индексы массивов.
                    if (keyIndices.length)
                        key[i] = key[i].slice(0, key[i].indexOf("[" + keyIndices[0] + "]"));
                    // Если юзер введёт просто "[0]" вместо "key[0]"
                    if (key[i].length === 0)
                        throw new DBError_1.default("You didn't specify a key, just an array index!", { code: 202.1, functionName, value });
                    callback(key, i, keyIndices, () => stop = true);
                }
                ;
            }
        };
    }
    ;
    /**
      * Installing the key.
      * @param { string } key
      * @examle ```js
      * const db = require("mouse-db.json");
      * const table = new db("key");
      * table.setKey("key.me"); // key.me;
      * ```
      * @returns { string }
    */
    setKey(key) {
        if (!key)
            throw new DBError_1.default("No key specified.", { code: 203, functionName: "setKey" });
        this._checkKey(key, "setKey", false);
        this.key = this._splitKey(key);
        return this.key.join(".");
    }
    ;
    /**
      * Add key. Example: "key" => "key.me"
      * @param { string } key
      * @examle ```js
      * const db = require("mouse-db.json");
      * const table = new db("key");
      * table.addKey("me"); // key.me;for (let i = 0; i < key.length; i++) {
            // Получаем все индексы массивов в ключе.
            const keyIndices = printIndices(key[i], { functionName: "set", value, key });
            
            // Обрезаем индексы массивов.
            if (keyIndices.length) key[i] = key[i].slice(0, key[i].indexOf("[" + keyIndices[0] + "]"));

            // Если юзер введёт просто "[0]" вместо "key[0]"
            if (key[i].length === 0) throw new DBError("You didn't specify a key, just an array index!", { functionName: "set", value });
      * ```
      * @returns { string }
    */
    addKey(key) {
        if (!key)
            throw new DBError_1.default("No key specified.", { code: 204, functionName: "addKey" });
        this._checkKey(key, "addKey", false);
        this.key = this.key.concat(this._splitKey(key));
        return this.key.join(".");
    }
    ;
    /**
      * Remove a certain number of keys (from the end); Example: "user.1552.profile" => "user.1552"
      * @param { number } num - How many keys to cut?
      * @examle ```js
      * const db = require("mouse-db.json");
      * const table = new db("user.1552.profile");
      * table.removeKey(2); // user
      * ```
      * @returns { string }
    */
    removeKey(num = 1) {
        if (this.key.length == 1)
            throw new DBError_1.default("You only have one key, you have nothing to clean!", { code: 205, functionName: "removeKey", value: num });
        if (isNaN(num) || typeof num != "number")
            throw new DBError_1.default("The value is not a number!", { code: 206, functionName: "removeKey", value: num });
        if (this.key.length <= num)
            throw new DBError_1.default(`You have only ${this.key.length} keys, you cannot remove ${num} keys. You can only remove a maximum of ${this.key.length - 1}.`, { code: 207, functionName: "removeKey", value: num });
        this.key = this.key.slice(0, -num);
        return this.key.join(".");
    }
    ;
    set(keyString, value) {
        // Меняем переменные местами.
        if (value === undefined)
            [keyString, value] = [value = "", keyString];
        this._checkKey(keyString, "set"); // Проверяем ключ.
        let tmp = DataBase.json[this.config.fileName];
        this._keyHandling(keyString, value, "set").process((key, i, keyIndices) => {
            let skipCheck = false;
            // В случае если хоть один ключ не является объектом - все проверки последующие пропускаются.
            // Если значение в базе не является объектом.
            if (skipCheck || !isObject(tmp[key[i]])) {
                tmp[key[i]] = {};
                skipCheck = true;
            }
            ;
            // Если есть индексы массивов в ключе...
            if (keyIndices.length) {
                tmp[key[i]] = [];
                tmp = tmp[key[i]]; // Переключаемся на следующий слой.
                for (let i2 = 0; i2 < keyIndices.length; i2++) { // Перебираем каждый индекс.
                    // Если идёт последний индекс.
                    if (keyIndices.length - 1 === i2) {
                        // Если это последний подключ и последний индекс - мы сохраняем value.
                        // Если впереди есть ещё необработанные ключи - ставим {}
                        tmp[keyIndices[i2]] = key.length - 1 == i ? value : {};
                    }
                    else if (skipCheck || Array.isArray(tmp[keyIndices[i2]])) { // Если следующий элемент не является массивом - присваиваем ему массив.
                        tmp[keyIndices[i2]] = [];
                        skipCheck = true;
                    }
                    ;
                    tmp = tmp[keyIndices[i2]]; // Переходим к следующему элементу.
                }
                ;
            }
            else {
                // В последнем ключе делаем присвоение.
                if (key.length - 1 == i) {
                    tmp[key[i]] = value;
                }
                else
                    tmp = tmp[key[i]]; // Переход к следующему элементу.
            }
        });
        writeFile_1.default(this.config.fileName, JSON.stringify(DataBase.json[this.config.fileName], null, 4));
        return value;
    }
    ;
    /**
        * Get data from the base.
        * @returns { any }
    */
    get(keyString = "") {
        let tmp = DataBase.json[this.config.fileName];
        this._keyHandling(keyString, undefined, "get").process((key, i, keyIndices, stop) => {
            if (!isObject(tmp)) {
                tmp = undefined;
                return stop();
            }
            ;
            // Если нужно обработать массив.
            if (keyIndices.length) {
                tmp = tmp[key[i]];
                for (let i2 = 0; i2 < keyIndices.length; i2++) {
                    // Если значение в базе не является массивом.
                    if (!Array.isArray(tmp)) {
                        tmp = undefined;
                        break;
                    }
                    ;
                    tmp = tmp[keyIndices[i2]]; // Переход к следующему элементу массива.
                }
            }
            else
                tmp = tmp[key[i]]; // Переходим к следующему ключу.
        });
        return tmp;
    }
    ;
    has(keyString, checkNull) {
        // Если пользователь ввёл только один аргумент ( checkNull ) меняем местами аргументы.
        if (typeof keyString === "boolean")
            [keyString, checkNull] = [checkNull, keyString];
        // Проверка ключа.
        else if (keyString != undefined)
            this._checkKey(keyString, "has");
        // Получаем элемент.
        const data = this.get(keyString);
        // Если элемент не равен undefined и не равен ( при checkNull = true ) null - выведет true.
        return data !== undefined && (!checkNull || data !== null) ? true : false;
    }
    ;
    /**
        * Remove an element from the base.
        * @returns { boolean }
    */
    delete(keyString = "") {
        // Проверить ключ.
        this._checkKey(keyString, "delete");
        // Создать новый ключ.
        const key = this.key.concat(this._splitKey(keyString));
        let tmp = DataBase.json[this.config.fileName]; // Временная переменная.
        let status; // Удаление прошло удачно или нет?
        this._keyHandling(keyString, undefined, "has").process((key, i, keyIndices, stop) => {
            // Если элемент последний и не надо обрабатывать индексы массивов.
            if (!keyIndices.length && key.length - 1 == i) {
                // Если нету элемента - сразу останавливаем цикл.
                if (tmp[key[i]] === undefined)
                    return stop();
                delete tmp[key[i]];
                status = true;
                return stop();
            }
            else if (key.length - 1 != i && !isObject(tmp))
                return stop(); // Если элемент не является объектом - тоже останавлиаем цикл.
            // Если имеются индксы массивов которые надо обработать.
            if (keyIndices.length) {
                tmp = tmp[key[i]];
                for (let i2 = 0; i2 < keyIndices.length; i2++) {
                    // Если это последний элемент ключа и последний элемент индекса.
                    if (key.length - 1 == i && keyIndices.length - 1 == i2) {
                        // Если tmp или элемент в нём - undefined
                        if (tmp === undefined || tmp[keyIndices[i2]] === undefined)
                            break;
                        if (keyIndices[i2] === "0")
                            tmp.shift(); // Если нужно удалить нулевой индекс - используем shift.
                        else
                            tmp.splice(keyIndices[i2], keyIndices[i2]); // В противном случае удаляем через .splice
                        status = true;
                        break;
                    }
                    else if (!Array.isArray(tmp))
                        break;
                    tmp = tmp[keyIndices[i2]];
                }
            }
            else
                tmp = tmp[key[i]];
        });
        if (!status)
            return false;
        writeFile_1.default(this.config.fileName, JSON.stringify(DataBase.json[this.config.fileName], null, 4));
        return true;
    }
    ;
    add(keyString, ...value) {
        // Если есть ключ, но нету значения, меняем местами аргументы.
        if (!value.length)
            [keyString, value] = [value[0] = "", [keyString]];
        // Если ключ не является числом - помечаем его как второй аргумент. 
        if (typeof keyString === "number") {
            value.push(keyString);
            keyString = "";
        }
        // Создаём переменную которая храинт в себе общую сумму.
        const totalAmount = value.length === 1 ? value[0] : value.map(function (num) { this.sum += num; return this.sum; }, { sum: 0 })[value.length - 1];
        // Проверяем ключ.
        this._checkKey(keyString, "add/subtract");
        // Создаём новый ключ.
        const key = this.key.concat(this._splitKey(keyString)).join(".");
        // Проверка на ошибки.
        if (totalAmount == undefined)
            throw new DBError_1.default("Enter the number!", { code: 208, functionName: "add/subtract", value: totalAmount, key });
        if (isNaN(totalAmount))
            throw new DBError_1.default("The value is not a number!", { code: 209, functionName: "add/subtract", value: totalAmount, key });
        // Получить данные.
        let data = this.get(keyString);
        if (!isNaN(data))
            data = Number(data) + Number(totalAmount); // Если значение в базе равняется числу - добавляем число.
        else if (!this.has(keyString, true))
            data = totalAmount; // Если значение в базе нету - создаём его.
        else
            throw new DBError_1.default("The object in the database is not a number!", { code: 210, functionName: "add/subtract", value: totalAmount, key });
        // Сохраняем значения.
        this.set(keyString, data);
        return data;
    }
    ;
    subtract(keyString, ...value) {
        // Если есть ключ, но нету значения, меняем местами аргументы.
        if (!value.length)
            [keyString, value] = [value[0] = "", [keyString]];
        // Если ключ не является числом - помечаем его как второй аргумент. 
        if (typeof keyString === "number") {
            value.push(keyString);
            keyString = "";
        }
        // Создаём переменную которая храинт в себе общую сумму.
        const totalAmount = value.length === 1 ? value[0] : value.map(function (num) { this.sum += num; return this.sum; }, { sum: 0 })[value.length - 1];
        return this.add(keyString, -totalAmount);
    }
    push(keyString, ...value) {
        // Опять меняем местами аргументы.
        if (!value.length)
            [keyString, value] = [value[0] = "", [keyString]];
        // Если ключ не является строкой - помечаем его как второй аргумент. 
        if (typeof keyString !== "string") {
            value.push(keyString);
            keyString = "";
        }
        // Вновь создаём новый ключ.
        const key = this.key.concat(this._splitKey(keyString));
        // Получаем данные.
        let data = this.get(keyString);
        // Делаем нужные действия.
        if (Array.isArray(data))
            data = data.concat(value); // Добавляем новый элемент если значение в базе - массив.
        else if (!this.has(keyString, true))
            data = value; // Если элемента в базе нет - создаём новый массив.
        else
            throw new DBError_1.default("The array is not in the database for this key!", { code: 211, functionName: "push", value, key });
        // Сохраняем значения.
        this.set(keyString, data);
        return data;
    }
    /**
        * Alilas db.get();
        * @returns { any }
    */
    fetch(key = "") {
        return this.get(key);
    }
    ;
    exists(keyString, checkNull) {
        return this.has(keyString, checkNull);
    }
    ;
}
exports.default = DataBase;
// База данных.
DataBase.json = {};
// Глобальный путь до проекта, где нужно создать mouse.json.
DataBase.globalPath = (_dirnameSplit.slice(0, _dirnameSplit.includes("node_modules") ? _dirnameSplit.indexOf("node_modules") : _dirnameSplit.length).join("/")) + "/";
// Глобальный путь до модуля...
DataBase.globalPathToTheModule = _dirnameSplit.slice(0, _dirnameSplit.includes("node_modules") ? _dirnameSplit.indexOf("node_modules") + 2 : _dirnameSplit.length).join("/") + "/";
// Проверенные файлы.
DataBase.checkedFiles = [];
// Модель конфига...
DataBase.configModel = [
    {
        name: "fileName", type: "string", default: "mouse.json", check: function (data) {
            if (!data.endsWith(".json"))
                throw new DBError_1.default(`Instance "config.${this.name}" has an incorrect setting. File endings must end with ".json"`, { code: 300 });
            if (!DataBase.checkedFiles.includes(data)) {
                DataBase.json[data] = {};
                checkFile_1.default(data);
                DataBase.checkedFiles.push(data);
            }
            ;
        }
    },
];
// Глобальная конфигурация модуля...
DataBase.config = DataBase.configModel.map(function (data) {
    this[data.name] = data.default;
    return this;
}, {})[0];
;
