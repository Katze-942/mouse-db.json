import DBError from "../DBError"
const checkTypes = ["undefined", "function", "symbol"];
const isObject = (obj: any): boolean => Object.prototype.toString.call(obj) === "[object Object]";
const scanError = (keyPath: string, type: string, options: object = {}): never => {
    throw new DBError(`Unsupported data type "${type}" found "${keyPath}"`, options);
};
    
function scanArray(arr: Array<any>, keyPath: string, options: object): void | never {
    for (let i = 0; i < arr.length; i++)        scanValue (arr[i], keyPath + "[" + i + "]", options);
};

function scanValue(value: any, keyPath: string, options: object): void | never {
    if (checkTypes.includes(typeof value))      scanError (keyPath, typeof value, options);
    else if (Array.isArray(value))              scanArray (value,   keyPath,      options);
    else if (isObject(value))                   scanObject(value,   keyPath,      options);
};

function scanObject(obj: object, keyPath: string, options: object): void | never {
    for (const key in obj)                      scanValue (obj[key], keyPath + "." + key, options);
};

export default scanValue;