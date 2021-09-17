"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DBError extends Error {
    constructor(message, options) {
        super(message);
        this.options = options;
        this.name = "[MouseDBError]";
        // Если ключ - массив, превращаем его в строку.
        if (this.options.key && Array.isArray(this.options.key))
            this.options.key = this.options.key.join(".");
        this.message += this.options.key ? "\n  >> Full key: " + this.options.key : "";
        this.message += this.options.value ? "\n  >> Value: " + this.options.value : "";
        this.message += this.options.functionName ? "\n  >> Function: DataBase." + this.options.functionName + "();" : "";
        this.message += "\n  >> Code: " + (this.options.code) + "\n";
    }
    ;
}
exports.default = DBError;
