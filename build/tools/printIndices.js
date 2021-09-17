"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function printIndices(str) {
    if (!str.includes("["))
        return [];
    const results = [];
    let isInsideBrackets = false;
    let current = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === "[") {
            isInsideBrackets = true;
        }
        else if (str[i] === "]") {
            if (isInsideBrackets) {
                results.push(current);
            }
            current = "";
            isInsideBrackets = false;
        }
        else if (isInsideBrackets) {
            if (str.charCodeAt(i) >= "0".charCodeAt(0) && str.charCodeAt(i) <= "9".charCodeAt(0)) {
                current += str[i];
            }
            else {
                isInsideBrackets = false;
            }
        }
    }
    ;
    // Обрезаем индексы массивов.
    if (results.length)
        str = str.slice(0, str.indexOf("[" + results[0] + "]"));
    return results;
}
exports.default = printIndices;
