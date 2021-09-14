import { statSync, readdirSync, rmSync, rmdirSync } from "fs"

async function rmFileAndFolder(path: string | string[]) {
  // Применяем split к путю, если он - строка.
  const pathSplit = typeof path === "string" ?
    path.split("/").filter(k => k != "") :
    path;

  // Проверяем является ли путь - папкой?
  if (statSync(pathSplit.join("/")).isDirectory()) {
    // Получаем все файлы и папки.
    const files = readdirSync(pathSplit.join("/"));

    // Перебираем их...
    for (let i = 0; i < files.length; i++) {
      // Проверяем является ли путь - директорией.
      if (statSync(pathSplit.join("/") + "/" + files[i]).isDirectory()) {
        // Копируем переменную
        const copyPathSplit = pathSplit.slice();
        copyPathSplit.push(files[i]); // Добавляем к пути наш файл.
        rmFileAndFolder(copyPathSplit); // Вызываем себя вновь, функция сама решит удалять файл или директорию
      } else {
        // Удаляем файл...
        rmSync(pathSplit.join("/") + "/" + files[i]);
      };
    };
    // Удаляем пустую папку.
    rmdirSync(pathSplit.join("/"));
  } else {
    // Удаляем файлы
    rmSync(pathSplit.join("/"));
  };
};
export default rmFileAndFolder;