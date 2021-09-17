interface Configuration {
    key?: string | Array<string>;
    value?: any;
    functionName?: string;
    code: number;
}
export default class DBError extends Error {
    readonly options: Configuration;
    message: string;
    constructor(message: string, options: Configuration);
}
export {};
