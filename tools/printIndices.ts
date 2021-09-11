import DBError from "../DBError";
interface ConfigurationError {
    key?: string | Array<string>,
    value?: any,
    functionName?: string
}
function printIndices(str: string, options: ConfigurationError): Array<string> {
    if (!str.includes("[")) return [];
    const results: Array<string> = [];
    let isInsideBrackets = false;
    let current: string = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] === "[") {
            isInsideBrackets = true;
        } else if (str[i] === "]") {
            if (isInsideBrackets) {
                results.push(current);
            }
            current = "";
            isInsideBrackets = false;
        } else if (isInsideBrackets) {
            if (str.charCodeAt(i) >= "0".charCodeAt(0) && str.charCodeAt(i) <= "9".charCodeAt(0)) {
                current += str[i];
            } else {
                isInsideBrackets = false;
            }
        }
    };
    // Обрезаем индексы массивов.
    if (results.length) str = str.slice(0, str.indexOf("[" + results[0] + "]"));

    // TODO
    if (str.length === 0) throw new DBError("You didn't specify a key, just an array index!", options);
    return results;
}

export default printIndices;