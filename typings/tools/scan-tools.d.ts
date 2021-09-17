interface Configuration {
    key?: string | Array<string>;
    value?: any;
    functionName?: string;
    code: number;
}
declare function scanValue(value: any, keyPath: string, options: Configuration): void | never;
export default scanValue;
