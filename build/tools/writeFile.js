"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const DataBase_1 = require("../DataBase");
const util_1 = require("util");
// Преобразуем callback-функции в асихронные.
const renameAsync = util_1.promisify(fs_1.rename);
const rmAsync = util_1.promisify(fs_1.rm);
// Глобальный путь дo папки кеша, данные о том что надо записывать в файл и последний записанный бекап.
const recordQueue = {};
let lastBackupFile = {};
// Обработчик очередей...
async function queueHandler(fileName) {
    // Запись данных...
    if (!recordQueue[fileName].queuedFile)
        await writeFile(...recordQueue[fileName].recordableFile);
    // Запись данных из очередей...
    while (recordQueue[fileName].queuedFile) {
        const promise = writeFile(...recordQueue[fileName].queuedFile);
        recordQueue[fileName].queuedFile = null;
        await promise;
    }
    ;
    // Показываем что запись снова свободна.
    recordQueue[fileName].recordableFile = null;
}
;
// Контролирует что куда присваивать и если надо вызывает обработчик очередей...
function queueDistributor(fileName, str) {
    // Если нету файла.
    if (!recordQueue[fileName])
        recordQueue[fileName] = {};
    // Добавляем новые данные в очередь...
    if (recordQueue[fileName].recordableFile) {
        recordQueue[fileName].queuedFile = [fileName, str];
    }
    else { // Или только запускаем обработчик...
        recordQueue[fileName].recordableFile = [fileName, str];
        queueHandler(fileName);
    }
    ;
}
;
// Запись файла.
function writeFile(fileName, str) {
    fileName = fileName.slice(0, -5);
    // Пути к кешу и путь к самой базе.
    const pathToCache = DataBase_1.default.globalPathToTheModule + "cache/" + fileName + "/" + Date.now() + "-" + Math.random() + ".json";
    const pathToDB = DataBase_1.default.globalPath + "/" + fileName + ".json";
    // Создаём стримы для обоих файлов.
    const dbFileStream = fs_1.createWriteStream(pathToDB);
    const backupFileStream = fs_1.createWriteStream(pathToCache + ".write");
    // Промиз записи данных в базу.
    const promiseBase = new Promise((resolve) => dbFileStream.write(str, () => resolve()));
    // Промиз записи данных в кеш базы.
    const promiseBackup = new Promise((resolve) => backupFileStream.write(str, async () => {
        // Для НАДЁЖНОСТИ мы копируем переменную.
        // Хоть и функция не вызывается второй раз когда первая не закончилась, всё же лишняя страховка не помешает.
        const copyOfAVariable = lastBackupFile[fileName] ? lastBackupFile[fileName].slice() : null;
        // Убираем окончание ".write" у переменной.
        // Для справки: ".write" означает что файл ещё не записался до конца.
        await renameAsync(pathToCache + ".write", pathToCache);
        // Удаляем старый кеш-файл.
        if (copyOfAVariable) {
            await rmAsync(copyOfAVariable);
        }
        ;
        // Присваиваем новый кеш-файл.
        lastBackupFile[fileName] = pathToCache;
        resolve();
    }));
    // Если запись кеша и базы будет окончено.
    return Promise.all([promiseBase, promiseBackup]);
}
;
exports.default = queueDistributor;
