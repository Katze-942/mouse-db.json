interface Configuration {
    key?: string | Array<string>,
    value?: any,
    functionName?: string
}
export default class DBError extends Error {
    message: string;

    constructor(message: string, readonly options?: Configuration) {
        super(message);
        this.name = "[MouseDBError]"
        if (!options) return;
        if (this.options?.key && Array.isArray(this.options.key)) this.options.key = this.options.key.join(".");
        this.message += this.options?.key          ? "\n  >> Full key: "            + this.options.key                  : "";
        this.message += this.options?.value        ? "\n  >> Value: "               + this.options.value                : "";
        this.message += this.options?.functionName ? "\n  >> Function: DataBase."   + this.options.functionName + "();" : "";
    };
}