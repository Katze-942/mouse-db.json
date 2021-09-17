declare type ValidScalars = null | string | boolean | number;
declare type JSONType = ValidScalars | ValidScalars[] | {
    [key: string]: ValidScalars | JSONType;
} | JSONType[];
interface ConfigModel {
    name: string;
    type: string;
    default: any;
    check: (data: any) => void;
}
interface ConfigUser {
    fileName?: string;
}
/**
 * Database class, contains settings, key and functions
*/
export default class DataBase {
    key: string[];
    config: ConfigUser;
    static json: object;
    static globalPath: string;
    static globalPathToTheModule: string;
    static checkedFiles: Array<string>;
    static configModel: ConfigModel[];
    static config: any;
    /**
     * ! You can omit the arguments, but keep in mind that you have to specify the keys in the functions!
     * @param { string }  key
     * @param { ConfigUser } config
     */
    constructor(key?: string, config?: ConfigUser);
    constructor(config?: ConfigUser);
    private _checkKey;
    private _splitKey;
    setConfig(config: ConfigUser, local?: boolean): void;
    private _keyHandling;
    /**
      * Installing the key.
      * @param { string } key
      * @examle ```js
      * const db = require("mouse-db.json");
      * const table = new db("key");
      * table.setKey("key.me"); // key.me;
      * ```
      * @returns { string }
    */
    setKey(key: string): string | never;
    /**
      * Add key. Example: "key" => "key.me"
      * @param { string } key
      * @examle ```js
      * const db = require("mouse-db.json");
      * const table = new db("key");
      * table.addKey("me"); // key.me;for (let i = 0; i < key.length; i++) {
            // Получаем все индексы массивов в ключе.
            const keyIndices = printIndices(key[i], { functionName: "set", value, key });
            
            // Обрезаем индексы массивов.
            if (keyIndices.length) key[i] = key[i].slice(0, key[i].indexOf("[" + keyIndices[0] + "]"));

            // Если юзер введёт просто "[0]" вместо "key[0]"
            if (key[i].length === 0) throw new DBError("You didn't specify a key, just an array index!", { functionName: "set", value });
      * ```
      * @returns { string }
    */
    addKey(key: string): string | never;
    /**
      * Remove a certain number of keys (from the end); Example: "user.1552.profile" => "user.1552"
      * @param { number } num - How many keys to cut?
      * @examle ```js
      * const db = require("mouse-db.json");
      * const table = new db("user.1552.profile");
      * table.removeKey(2); // user
      * ```
      * @returns { string }
    */
    removeKey(num?: number): string | never;
    /**
      * Save changes to base
      * @param { any } value - The value must be supported in JSON!
      * @example ```js
      * const db = require("mouse-db.json");
      * const table = new db("user.1552.age");
      * table.set(24); // 24
    * table.setKey("user.1552.name");
    * table.set("Иван"); // Иван.
    * ```
    * @returns { any }
    */
    set(key: string, value: JSONType): any;
    set(value: JSONType): any;
    /**
        * Get data from the base.
        * @returns { any }
    */
    get(keyString?: string): JSONType | undefined;
    /**
        * Check if an item is in the database by this key.
        * @param { object } settings
        * @param { boolean } settings.checkNull - With this setting enabled, this will also be checked for null. If the database is null, it will return false.
        * @returns { Boolean }
    */
    has(): any;
    has(key: string, checkNull: boolean): any;
    has(key: string): any;
    has(checkNull: boolean): any;
    /**
        * Remove an element from the base.
        * @returns { boolean }
    */
    delete(keyString?: string): boolean;
    /**
        * Add number
        * @param { number } value
        * @returns { number }
    */
    add(key: string, ...value: Array<number>): any;
    add(...value: Array<number>): any;
    /**
        * Minus the number
        * @param { number } value
        * @returns
    */
    subtract(key: string, ...value: Array<number>): any;
    subtract(...value: Array<number>): any;
    /**
        * Add an item to the array.
        * @param { any } value
        * @returns { array<any> }
    */
    push(key: string, ...value: Array<JSONType>): any;
    push(...value: Array<JSONType>): any;
    /**
        * Alilas db.get();
        * @returns { any }
    */
    fetch(key?: string): JSONType | undefined;
    /**
        * Alilas db.has();
        * @returns { boolean }
    */
    exists(key: string, checkNull: boolean): any;
    exists(key: string): any;
    exists(checkNull: boolean): any;
}
export {};
