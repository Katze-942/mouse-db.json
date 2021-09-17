"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBError_1 = require("../DBError");
const checkTypes = ["undefined", "function", "symbol"];
const isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
const scanError = (keyPath, type, options) => {
    throw new DBError_1.default(`Unsupported data type "${type}" found "${keyPath}"`, options);
};
function scanArray(arr, keyPath, options) {
    for (let i = 0; i < arr.length; i++)
        scanValue(arr[i], keyPath + "[" + i + "]", options);
}
;
function scanValue(value, keyPath, options) {
    if (checkTypes.includes(typeof value))
        scanError(keyPath, typeof value, options);
    else if (Array.isArray(value))
        scanArray(value, keyPath, options);
    else if (isObject(value))
        scanObject(value, keyPath, options);
}
;
function scanObject(obj, keyPath, options) {
    for (const key in obj)
        scanValue(obj[key], keyPath + "." + key, options);
}
;
exports.default = scanValue;
