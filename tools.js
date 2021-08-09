const isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
module.exports = {
    isObject,
    pathFixed: () => {
        let path = __dirname.split("/");
        if (path.includes("node_modules")) path = path.slice(0, path.indexOf("node_modules") - 1);
        return path.join("/");
    },
    objFixed: (obj, keySplit) => { // Фиксит объекты.
        if (!isObject(eval("obj" + keySplit.join("?.")))) { // Проверяем, является ли основной путь - объектом. 
            for (let i = 0; i < keySplit.length-1; i++) { // Перебираем каждый ключ и если что присваиваем ему объект.
                if (!isObject(eval("obj" + keySplit.slice(0, i + 1).join("")))) eval("obj" + keySplit.slice(0, i + 1).join("") + "={}");
            };
        };
        return obj;
    }
}