import printIndices from "./tools/printIndices"
import scanValue from "./tools/scan-tools"
import writeFile from "./tools/writeFile"
import checkFile from "./tools/checkFile"
import DBError from "./DBError"

const isObject = (obj: any): boolean => Object.prototype.toString.call(obj) === "[object Object]";
const _dirnameSplit = __dirname.split("/");

type ValidScalars = null | string | boolean | number;
type JSONType = ValidScalars | ValidScalars[] | { [key: string]: ValidScalars | JSONType } | JSONType[];

type CallbackArguments = (key: Array<string>, i: number, keyIndices: Array<string>, stop: () => void) => void;

interface KeyHandlingObject {
	process: (func: CallbackArguments) => void
};

// Конфигурация для модели-конфига
interface ConfigModel {
	name: string,
	type: string,
	default: any,
	check: (data: any) => void
};

// Конфигурация которую юзер может указывать.
interface ConfigUser {
	fileName?: string,
};
/**
 * Database class, contains settings, key and functions
*/
export default class DataBase {
	// Параметры в this.
	public key: string[];
	public config: ConfigUser;

	// База данных.
	static json: object = {}

	// Глобальный путь до проекта, где нужно создать mouse.json.
	static globalPath = (_dirnameSplit.slice(0, _dirnameSplit.includes("node_modules") ? _dirnameSplit.indexOf("node_modules") : _dirnameSplit.length).join("/")) + "/";

	// Глобальный путь до модуля...
	static globalPathToTheModule = _dirnameSplit.slice(0, _dirnameSplit.includes("node_modules") ? _dirnameSplit.indexOf("node_modules") + 2 : _dirnameSplit.length).join("/") + "/";

	// Проверенные файлы.
	static checkedFiles: Array<string> = [];

	// Модель конфига...
	static configModel: ConfigModel[] = [
		{
			name: "fileName", type: "string", default: "mouse.json", check: function(data) {
				if (!data.endsWith(".json")) throw new DBError(`Instance "config.${this.name}" has an incorrect setting. File endings must end with ".json"`, { code: 300 });
				if (!DataBase.checkedFiles.includes(data)) {
					DataBase.json[data] = {};
					checkFile(data);
					DataBase.checkedFiles.push(data);
				};
			}
		},
	];

	// Глобальная конфигурация модуля...
	static config = DataBase.configModel.map(function(data) {
		this[data.name] = data.default;
		return this;
	}, {})[0];
	
	// Инициализация конструктора.
	/**
	 * ! You can omit the arguments, but keep in mind that you have to specify the keys in the functions!
	 * @param { string }  key 
	 * @param { ConfigUser } config 
	 */
	constructor(key?: string, config?: ConfigUser);
	constructor(config?: ConfigUser)
	constructor(key?: string | ConfigUser, config?: ConfigUser) {
		this.key = [];
		this.config = {};
		if (key !== undefined) {
			if (!config) {
				if (typeof key !== "string" && !isObject(key)) throw new DBError(`Unknown data type "${typeof key}" during class initialization. Specify either a key or a object.`, { code: 100 })
			} else {
				if (typeof key !== "string") 	 throw new DBError(`The first argument of the class initialization must be a string (key), not "${typeof key}"\nIf you want to put a configuration instead of a key, remove the second argument`, { code: 101, value: key });
				if (config && !isObject(config)) throw new DBError(`The second argument to the initialization of the class must be an object! You have type "${typeof config}"`, { code: 102, value: config }); 
			};
			if (typeof key === "string") this.setKey(key);
		} else this.key = [];
		let value = isObject(key) ? key : config;
		if (!value) value = {};
		this.setConfig(<ConfigUser>value, true);
	};

	// Функция для проверки ключа.
	private _checkKey(key: any, functionName: string, checkGlobalKey: boolean = true): void | never {
		if (checkGlobalKey && !key && !this.key.length)   throw new DBError("You did not specify a key or value when initializing the class, you must now specify it in functions!", { code: 200.1, functionName, key });
		if (typeof key != "string")                       throw new DBError("The key value must be a string!", { code: 201, functionName, key });
	};

	// Функция для разделения ключа.
	private _splitKey(key: string): Array<string> {
		return key.split(".").filter(key => key != "");
	};

	setConfig(config: ConfigUser, local?: boolean): void	 {
		if (!config)   throw new DBError("Specify config!", { code: 400, functionName: "setConfig" });
		if (!isObject(config)) throw new DBError("The configuration must be in the form of an object!", { code: 401, functionName: "setConfig" });
		
		const configModel = DataBase.configModel
		for (let i = 0; i < configModel.length; i++) {
			if (!config[configModel[i].name]) {
				configModel[i].check(configModel[i].default);
				this.config[configModel[i].name] = configModel[i].default;
			} else {
				const value = config[configModel[i].name];
				if (typeof value !== configModel[i].type) throw new DBError(`The type is incorrectly specified in the setting "config.${configModel[i].name}". Type is required: "${configModel[i].type}", and you have: "${typeof value}"`, { code: 402 });
				configModel[i].check(value);
				this.config[configModel[i].name] = config[configModel[i].name];
				if (!local) DataBase.config[configModel[i].name] = config[configModel[i].name];
			};
		};
	};

	private _keyHandling(keyString: string, value: JSONType | undefined, functionName: string): KeyHandlingObject {
		// Создаём новый ключ...
		const key = this.key.concat(this._splitKey(keyString));

		// Проверяем ошибки в значении.
		if (value) scanValue(value, "value", { code: 212, functionName, key });
		
		return {
			process: (callback: CallbackArguments) => {
				let stop;
				for (let i = 0; i < key.length; i++) {
					if (stop) break;

					// Получаем все индексы массивов в ключе.
					const keyIndices = printIndices(key[i]); 
					
					// Обрезаем индексы массивов.
					if (keyIndices.length) key[i] = key[i].slice(0, key[i].indexOf("[" + keyIndices[0] + "]"));
					
					// Если юзер введёт просто "[0]" вместо "key[0]"
					if (key[i].length === 0) throw new DBError("You didn't specify a key, just an array index!", { code: 202.1, functionName, value }); 
					callback(key, i, keyIndices, () => stop = true);
				};
			}
		};
	};

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
	setKey(key: string): string | never {
		if (!key) throw new DBError("No key specified.", { code: 203, functionName: "setKey" });
		this._checkKey(key, "setKey", false);

		this.key = this._splitKey(key);
		return this.key.join(".");
	};


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
	addKey(key: string): string | never {
		if (!key) throw new DBError("No key specified.", { code: 204, functionName: "addKey" });
		this._checkKey(key, "addKey", false);
		this.key = this.key.concat(this._splitKey(key));
		return this.key.join(".");
	};

	
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
	removeKey(num: number = 1): string | never {
		if (this.key.length == 1)                 throw new DBError("You only have one key, you have nothing to clean!", { code: 205, functionName: "removeKey", value: num });
		if (isNaN(num) || typeof num != "number") throw new DBError("The value is not a number!",                        { code: 206, functionName: "removeKey", value: num });
		if (this.key.length <= num)               throw new DBError(`You have only ${this.key.length} keys, you cannot remove ${num} keys. You can only remove a maximum of ${this.key.length-1}.`, { code: 207, functionName: "removeKey", value: num });

		this.key = this.key.slice(0, -num);
		return this.key.join(".");
	};

	

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
	set(key: string, value: JSONType);
	set(value: JSONType);
	set(keyString: string, value?: JSONType): JSONType | never {
		// Меняем переменные местами.
		if (value === undefined) [keyString, value] = [value = "", keyString];
		this._checkKey(keyString, "set"); // Проверяем ключ.
		
		let tmp = DataBase.json[<string>this.config.fileName];
		this._keyHandling(keyString, value, "set").process((key, i, keyIndices) => {
			let skipCheck = false;

			// В случае если хоть один ключ не является объектом - все проверки последующие пропускаются.
			// Если значение в базе не является объектом.
			if (skipCheck || !isObject(tmp[key[i]])) {
				tmp[key[i]] = {};
				skipCheck = true;
			};

			// Если есть индексы массивов в ключе...
			if (keyIndices.length) {
				tmp[key[i]] = []; 
				tmp = tmp[key[i]]; // Переключаемся на следующий слой.
				for (let i2 = 0; i2 < keyIndices.length; i2++) { // Перебираем каждый индекс.
					// Если идёт последний индекс.
					if (keyIndices.length-1 === i2) {
						// Если это последний подключ и последний индекс - мы сохраняем value.
						// Если впереди есть ещё необработанные ключи - ставим {}
						tmp[keyIndices[i2]] = key.length - 1 == i ? value : {};
					} else if (skipCheck || Array.isArray(tmp[keyIndices[i2]])) { // Если следующий элемент не является массивом - присваиваем ему массив.
						tmp[keyIndices[i2]] = [];
						skipCheck = true;
					};
					tmp = tmp[keyIndices[i2]]; // Переходим к следующему элементу.
				};
			} else {
				// В последнем ключе делаем присвоение.
				if (key.length - 1 == i) {
					tmp[key[i]] = value;
				} else tmp = tmp[key[i]]; // Переход к следующему элементу.
			}
		});
		writeFile(<string>this.config.fileName, JSON.stringify(DataBase.json[<string>this.config.fileName], null, 4));
		return value;
	};


	/**
		* Get data from the base.
		* @returns { any }
	*/
	get(keyString: string = ""): JSONType | undefined {
		let tmp: any = DataBase.json[<string>this.config.fileName];
		this._keyHandling(keyString, undefined, "get").process((key, i, keyIndices, stop) => {
			if (!isObject(tmp)) {
				tmp = undefined;    
				return stop();
			};
			// Если нужно обработать массив.
			if (keyIndices.length) {
				tmp = tmp[key[i]];
				for (let i2 = 0; i2 < keyIndices.length; i2++) {
					// Если значение в базе не является массивом.
					if (!Array.isArray(tmp)) {
						tmp = undefined;
						break;
					};
					tmp = tmp[keyIndices[i2]]; // Переход к следующему элементу массива.
				}
			} else tmp = tmp[key[i]]; // Переходим к следующему ключу.
		});
		return tmp;
	};


	/**
		* Check if an item is in the database by this key.
		* @param { object } settings
		* @param { boolean } settings.checkNull - With this setting enabled, this will also be checked for null. If the database is null, it will return false.
		* @returns { Boolean }
	*/
	has();
	has(key: string, checkNull: boolean);
	has(key: string);
	has(checkNull: boolean);
	has(keyString?: string | boolean, checkNull?: boolean): boolean | never {
		// Если пользователь ввёл только один аргумент ( checkNull ) меняем местами аргументы.
		if (typeof keyString === "boolean") [keyString, checkNull] = [checkNull, keyString];

		// Проверка ключа.
		else if (keyString != undefined) this._checkKey(keyString, "has")
		
		// Получаем элемент.
		const data = this.get(<string>keyString);

		// Если элемент не равен undefined и не равен ( при checkNull = true ) null - выведет true.
		return data !== undefined && (!checkNull || data !== null) ? true : false
	};


	/**
		* Remove an element from the base.
		* @returns { boolean }
	*/
	delete(keyString: string = ""): boolean {
		// Проверить ключ.
		this._checkKey(keyString, "delete");

		// Создать новый ключ.
		const key = this.key.concat(this._splitKey(keyString));

		let tmp: any = DataBase.json[<string>this.config.fileName]; // Временная переменная.
		let status;              // Удаление прошло удачно или нет?

		this._keyHandling(keyString, undefined, "has").process((key, i, keyIndices, stop) => {
			// Если элемент последний и не надо обрабатывать индексы массивов.
			if (!keyIndices.length && key.length - 1 == i) { 
				// Если нету элемента - сразу останавливаем цикл.
				if (tmp[key[i]] === undefined) return stop();
				delete tmp[key[i]];
				status = true;
				return stop();
			} else if (key.length - 1 != i && !isObject(tmp)) return stop(); // Если элемент не является объектом - тоже останавлиаем цикл.
			
			// Если имеются индксы массивов которые надо обработать.
			if (keyIndices.length) {
				tmp = tmp[key[i]];
				for (let i2 = 0; i2 < keyIndices.length; i2++) {
					// Если это последний элемент ключа и последний элемент индекса.
					if (key.length - 1 == i && keyIndices.length - 1 == i2) {
						// Если tmp или элемент в нём - undefined
						if (tmp === undefined || tmp[keyIndices[i2]] === undefined) break;

						if (keyIndices[i2] === "0") tmp.shift();         // Если нужно удалить нулевой индекс - используем shift.
						else tmp.splice(keyIndices[i2], keyIndices[i2]); // В противном случае удаляем через .splice
						
						status = true;
						break;
					} else if (!Array.isArray(tmp)) break;
					tmp = tmp[keyIndices[i2]];
				}
			} else tmp = tmp[key[i]];
		});
		
		if (!status) return false;
		writeFile(<string>this.config.fileName, JSON.stringify(DataBase.json[<string>this.config.fileName], null, 4));
		return true;
	};

	
	/**
		* Add number
		* @param { number } value 
		* @returns { number }
	*/
	add(key: string, ...value: Array<number>);
	add(...value: Array<number>);
	add(keyString: string | number, ...value: Array<number | string>): number | never {
		// Если есть ключ, но нету значения, меняем местами аргументы.
		if (!value.length) [keyString, value] = [value[0] = "", [keyString]];

		// Если ключ не является числом - помечаем его как второй аргумент. 
		if (typeof keyString === "number") {
			value.push(keyString);
			keyString = "";
		}

		// Создаём переменную которая храинт в себе общую сумму.
		const totalAmount = value.length === 1 ? value[0] : value.map(function(num) { this.sum += num; return this.sum }, { sum: 0 })[value.length-1];

		// Проверяем ключ.
		this._checkKey(<string>keyString, "add/subtract");

		// Создаём новый ключ.
		const key = this.key.concat(this._splitKey(<string>keyString)).join(".");

		// Проверка на ошибки.
		if (totalAmount == undefined)   throw new DBError("Enter the number!",          { code: 208, functionName: "add/subtract", value: totalAmount, key });
		if (isNaN(<number>totalAmount)) throw new DBError("The value is not a number!", { code: 209, functionName: "add/subtract", value: totalAmount, key });

		// Получить данные.
		let data = this.get(<string>keyString);

		if (!isNaN(<number>data)) data = Number(data) + Number(totalAmount); // Если значение в базе равняется числу - добавляем число.
		else if (!this.has(keyString, true)) data = <Array<number>>totalAmount; // Если значение в базе нету - создаём его.
		else throw new DBError("The object in the database is not a number!", { code: 210, functionName: "add/subtract", value: totalAmount, key });

		// Сохраняем значения.
		this.set(<string>keyString, data); 
		return <number>data;
	};

	
	/**
	  	* Minus the number
	  	* @param { number } value
	  	* @returns 
	*/
	subtract(key: string, ...value: Array<number>);
	subtract(...value: Array<number>);
	subtract(keyString: string | number, ...value: Array<number | string>): number | never {
		// Если есть ключ, но нету значения, меняем местами аргументы.
		if (!value.length) [keyString, value] = [value[0] = "", [keyString]];

		// Если ключ не является числом - помечаем его как второй аргумент. 
		if (typeof keyString === "number") {
			value.push(keyString);
			keyString = "";
		}

		// Создаём переменную которая храинт в себе общую сумму.
		const totalAmount = value.length === 1 ? value[0] : value.map(function(num) { this.sum += num; return this.sum }, { sum: 0 })[value.length-1];
		
		return this.add(keyString, -totalAmount);
	}


	/**
	  	* Add an item to the array.
		* @param { any } value 
	  	* @returns { array<any> }
	*/
	push (key: string, ...value: Array<JSONType>);
	push (...value: Array<JSONType>);
	push (keyString: JSONType, ...value: Array<JSONType>): Array<JSONType> | never {
		// Опять меняем местами аргументы.
		if (!value.length) [keyString, value] = [value[0] = "", [keyString]];

		// Если ключ не является строкой - помечаем его как второй аргумент. 
		if (typeof keyString !== "string") {
			value.push(keyString);
			keyString = "";
		}

		// Вновь создаём новый ключ.
		const key = this.key.concat(this._splitKey(<string>keyString));

		// Получаем данные.
		let data: any = this.get(<string>keyString);

		// Делаем нужные действия.
		if (Array.isArray(data)) data = data.concat(value);           // Добавляем новый элемент если значение в базе - массив.
		else if (!this.has(<string>keyString, true)) data = value;    // Если элемента в базе нет - создаём новый массив.
		else throw new DBError("The array is not in the database for this key!", { code: 211, functionName: "push", value, key });

		// Сохраняем значения.
		this.set(<string>keyString, data);
		return data;
	}

	/**
		* Alilas db.get();
		* @returns { any }
	*/
	fetch(key: string = ""): JSONType | undefined {   // Дополнительная функция ( алилас ) get
		return this.get(key);
	};

	/**
		* Alilas db.has();
		* @returns { boolean }
	*/
	exists(key: string, checkNull: boolean);
	exists(key: string);
	exists(checkNull: boolean);
	exists(keyString?: string | boolean, checkNull?: boolean): boolean | never {  // Дополнительная функция ( алилас ) has
		return this.has(<string>keyString, <boolean>checkNull);  
	};
};