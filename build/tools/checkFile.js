"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("util");
const DataBase_1 = require("../DataBase");
const DBError_1 = require("../DBError");
// Преобразуем callback-функции в асихронные.
const rmAsync = util_1.promisify(fs_1.rm);
// Глобальный путь до папки с кешем.
const _dirnameSplit = __dirname.split("/");
const globalFolderPath = (_dirnameSplit.slice(0, _dirnameSplit.includes("node_modules") ? _dirnameSplit.indexOf("node_modules") + 2 : _dirnameSplit.length - 2).join("/") + "/") + "cache/";
let lastBackupFile = {};
function scanFiles(path, files) {
    for (let i = files.length - 1; i != -1; i--) {
        if (files[i].endsWith(".write"))
            continue;
        lastBackupFile[path] = globalFolderPath + path + "/" + files[i];
        if (i === 0)
            files.shift();
        else
            files.splice(i, i);
        break;
    }
    ;
    files = files.concat(files.filter(file => file.endsWith(".write")));
    for (let i = files.length - 1; i != -1; i--)
        rmAsync(globalFolderPath + path + "/" + files[i]);
}
;
function checkFileForErrors(fileName) {
    try {
        if (Object.prototype.toString.call(require(DataBase_1.default.globalPath + fileName)) !== "[object Object]")
            throw TypeError("!");
        return true;
    }
    catch {
        return false;
    }
    ;
}
;
function checkFile(fileName) {
    const workingFile = checkFileForErrors(fileName);
    fileName = fileName.slice(0, -5);
    // Если нету папки "cache"
    if (!fs_1.existsSync(globalFolderPath)) {
        fs_1.mkdirSync(globalFolderPath);
    }
    ;
    const missingFolders = fileName.split("/").filter(k => k != "");
    if (missingFolders.length > 1 && !fs_1.existsSync(DataBase_1.default.globalPath + missingFolders.slice(0, -1).join("/")))
        throw new DBError_1.default(`The path to the file "${missingFolders[missingFolders.length - 1]}" is specified incorrectly. The path you specified: "${missingFolders.join("/")}"`, { code: 301 });
    // Если нету кеша для fайла...
    if (!fs_1.existsSync(globalFolderPath + fileName)) {
        let folderPath = globalFolderPath;
        let skipCheck;
        for (let i = 0; i < missingFolders.length; i++) {
            folderPath += missingFolders[i] + "/";
            if (skipCheck || !fs_1.existsSync(folderPath)) {
                fs_1.mkdirSync(folderPath);
                skipCheck = true;
            }
            ;
        }
        ;
    }
    else {
        if (workingFile) {
            fs_1.readdir(globalFolderPath + fileName, (err, files) => {
                if (err)
                    return console.error(err.stack);
                scanFiles(fileName, files);
            });
        }
        else {
            scanFiles(fileName, fs_1.readdirSync(globalFolderPath + fileName));
        }
        ;
    }
    ;
    if (workingFile)
        DataBase_1.default.json[fileName + ".json"] = require(DataBase_1.default.globalPath + fileName);
    else if (fs_1.existsSync(DataBase_1.default.globalPath + fileName + ".json") && lastBackupFile[fileName])
        DataBase_1.default.json[fileName + ".json"] = require(lastBackupFile[fileName]);
}
;
exports.default = checkFile;
