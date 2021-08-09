module.exports = {
    isObject: (obj) => Object.prototype.toString.call(obj) === "[object Object]",
    pathFixed: () => {
        let path = __dirname.split("/");
        if (path.includes("node_modules")) path = path.slice(0, path.indexOf("node_modules") - 1);
        return path.join("/");
    }
}