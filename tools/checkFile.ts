import { rm, existsSync, mkdirSync, readdir, readdirSync, statSync } from "fs";
import DataBase from "../DataBase";
import { promisify } from "util";
import DBError from "../DBError"

// Преобразуем callback-функции в асихронные.
const rmAsync = promisify(rm);

const folderName = "cache/";
let lastBackupFile: object = {};



function scanFiles(path: string, files: Array<string>) {
    // Проверяем наличие файла. Если файл есть - ищем последний кеш. если нет - просто всё удалится.
    if (existsSync(DataBase.globalPath + path + ".json")) {
        for (let i = files.length - 1; i != -1; i--) {
            if (files[i].endsWith(".write")) continue;
            lastBackupFile[path] = folderName + path + "/" + files[i];

            if (i === 0) files.shift();
            else files.splice(i, i);
            break;
        };
    } else {
        const pathSplit = path.split("/").filter(k => k != "");
        if (existsSync(folderName + pathSplit[0])) {
            const slicePath = folderName + (pathSplit.length > 1 ? pathSplit.slice(0, pathSplit.length-1).join("/") : pathSplit[0]);
            readdir(folderName + slicePath, (err, files) => {
                if (err) return console.error(err.stack);
                for (let i = 0; i < files.length; i++) {
                    rm(slicePath + "/" + files[i], (err) => {
                        if (err) console.error(err.stack);
                    });
                };
                
            });
        };
    };
    files = files.concat(files.filter(file => file.endsWith(".write")));
    for (let i = files.length - 1; i != -1; i--) rmAsync(folderName + path + "/" + files[i]);
}

function checkFileForErrors(fileName: string): boolean {
    try {
        if (Object.prototype.toString.call(require(DataBase.globalPath + fileName)) !== "[object Object]") throw TypeError("!");
        return true;
    } catch {
        return false;
    };
};

function checkFile(fileName: string): void {
    const workingFile = checkFileForErrors(fileName);
    fileName = fileName.slice(0, -5);

    // Если нету папки "cache"
    if (!existsSync(folderName)) {
        mkdirSync(folderName);
    };
    const missingFolders = fileName.split("/").filter(k => k != "");
    if (missingFolders.length > 1 && !existsSync(DataBase.globalPath + missingFolders.slice(0, -1).join("/"))) throw new DBError(`The path to the file "${missingFolders[missingFolders.length-1]}" is specified incorrectly. The path you specified: "${missingFolders.join("/")}"`);
    if (!existsSync(folderName + fileName)) {

        let folderPath = folderName;
        let skipCheck;

        for (let i = 0; i < missingFolders.length; i++) {
            folderPath += missingFolders[i] + "/";
            if (skipCheck || !existsSync(folderPath)) {
                mkdirSync(folderPath);
                skipCheck = true;
            };
        }
    } else {
        if (workingFile) {
            readdir(folderName + fileName, (err, files) => {
                if (err) return console.error(err.stack);
                scanFiles(fileName, files);
            });
        } else {
            scanFiles(fileName, readdirSync(folderName + fileName));
        };
    };

    if (workingFile) DataBase.json[fileName + ".json"] = require(DataBase.globalPath + fileName);
    else if (lastBackupFile[fileName]) DataBase.json[fileName + ".json"] = require("../../" + lastBackupFile[fileName]);
}
export default checkFile;