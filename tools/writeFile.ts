import { rename, rm, createWriteStream } from "fs";
import DataBase from "../DataBase";
import { promisify } from "util";

// Преобразуем callback-функции в асихронные.
const renameAsync    = promisify(rename);
const rmAsync        = promisify(rm);

// Название папки кеша, данные о том что надо записывать в файл и последний записанный бекап.
const folderName = "cache/";
const recordQueue = {};
let lastBackupFile = {};

// Какие аргументы принимает функция "write"
type WriteArguments = [string, string];

// Обработчик очередей...
async function queueHandler(fileName: string) {
    // Запись данных...
    if (!recordQueue[fileName].queuedFile) await writeFile(...<WriteArguments>recordQueue[fileName].recordableFile);

    // Запись данных из очередей...
    while (recordQueue[fileName].queuedFile) {
        const promise = writeFile(...<WriteArguments>recordQueue[fileName].queuedFile);
        recordQueue[fileName].queuedFile = null;
        await promise;
    };

    // Показываем что запись снова свободна.
    recordQueue[fileName].recordableFile = null;
};

// Контролирует что куда присваивать и если надо вызывает обработчик очередей...
function queueDistributor(fileName: string, str: string) {
    // Если нету файла.
    if (!recordQueue[fileName]) recordQueue[fileName] = {};

    // Добавляем новые данные в очередь...
    if (recordQueue[fileName].recordableFile) {
        recordQueue[fileName].queuedFile = [fileName, str];
    } else { // Или только запускаем обработчик...
        recordQueue[fileName].recordableFile = [fileName, str];
        queueHandler(fileName);
    };
};

// Запись файла.
function writeFile(fileName: string, str: string) {
    fileName = fileName.slice(0, -5);

    // Пути к кешу и путь к самой базе.
    const pathToCache = folderName + fileName + "/" + Date.now() + "-" + Math.random() + ".json";
    const pathToDB = DataBase.globalPath + "/" + fileName + ".json";

    // Создаём стримы для обоих файлов.
    const dbFileStream = createWriteStream(pathToDB);
    const backupFileStream = createWriteStream(pathToCache + ".write");

    // Промиз записи данных в базу.
    const promiseBase = new Promise<void>((resolve) =>
        dbFileStream.write(str, () => resolve()));

    // Промиз записи данных в кеш базы.
    const promiseBackup = new Promise<void>((resolve) =>
        backupFileStream.write(str, async () => {
            // Для НАДЁЖНОСТИ мы копируем переменную.
            // Хоть и функция не вызывается второй раз когда первая не закончилась, всё же лишняя страховка не помешает.
            const copyOfAVariable = lastBackupFile[fileName] ? lastBackupFile[fileName].slice() : null;

            // Убираем окончание ".write" у переменной.
            // Для справки: ".write" означает что файл ещё не записался до конца.
            await renameAsync(pathToCache + ".write", pathToCache);

            // Удаляем старый кеш-файл.
            if (copyOfAVariable) {  
                await rmAsync(copyOfAVariable);
            };

            // Присваиваем новый кеш-файл.
            lastBackupFile[fileName] = pathToCache;
            resolve();
        }));

    // Если запись кеша и базы будет окончено.
    return Promise.all([promiseBase, promiseBackup]);
};
export default queueDistributor;