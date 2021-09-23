# A list of all error codes in **mouse-db.json**
## After each error, you can see its code. Thanks to this code, you can quickly find out what you did wrong.
![Alt-текст](https://autumn.revolt.chat/attachments/4FtKZkgUEs1pQ5OaQe5SeoweVQUd6MXlWy4ZUDeaUj/Screenshot_20210916_215636.png "Error example")

## Brief summary:
- Error code greater than 100 - `errors related to specifying arguments and types `**`in the class`**.
- Error code greater than 200 - `errors related to arguments and types are already` **`in functions`**.
- Error code greater than 300 - `errors related to file paths`.
- Error code greater than 400 - `errors related to the config`.
## The codes themselves:
- [**`100`**](#100) >> When initializing the class, you specified an unknown data type, you need to specify either an object or a key.
- [**`101`**](#101) >> If the first argument of the class is NOT a string ( __has the second argument__ );
- [**`102`**](#102) >> If the second argument of the class is NOT an object.
- [**`200.1`**](#201) >> If you have not specified a key in the class, and you are trying to use the function without specifying the key again.
- [**`201`**](#201) >> The error occurs if you pass a different data type instead of the key.
- [**`202.1`**](#202) >> You specified only the array index, instead of the key.
- [**`203`**](#203) >> You didn't specify a key in the `setKey` function.
- [**`204`**](#204) >> You didn't specify a key in the `addKey` function.
- [**`205`**](#205) >> You use `removeKey` when you have only one key in the class.
- [**`206`**](#206) >> You specified a different data type instead of a number in `removeKey`.
- [**`207`**](#207) >> Error in `removeKey` when you pass a number more than you have keys.
- [**`208`**](#208) >> You didn't specify a number in the `add/subtract` function.
- [**`209`**](#209) >> You specified a different data type in `add/subtract` instead of a number.
- [**`210`**](#210) >> The error that occurs in `add/subtract` occurs if you are trying to overwrite other data.
- [**`211`**](#211) >> Identical to the `210` error, but only for the `push` function.
- [**`212`**](#212) >> It can occur in any functions where a value is accepted. The error appears if you specify the data type incorrectly.
- [**`300`**](#300) >> If you specified a file without the `.json` extension.
- [**`301`**](#301) >> Incorrect path to the file in the config.
- [**`400`**](#400) >> You didn't specify anything in the `setConfig` function.
- [**`401`**](#401) >> In `setConfig`, a different data type is specified instead of the object.
- [**`402`**](#402) >> The configuration in the config has an incorrect data type.
# Detailed description of errors:
## 100
> ### When initializing the class, you specified an unknown data type, you need to specify either an object or a key.
```js
// ❌
const db = new DataBase(942);

// ✅
const db = new DataBase();
const db = new DataBase("key");
const db = new DataBase({ fileName: "file.json" });
const db = new DataBase("key", { fileName: "file.json" })
```
## 101
> ### If the first argument of the class is NOT a string ( __has the second argument__ )
```js
// ❌
const db = new DataBase(942, { configuraion });

// ✅
const db = new DataBase("key", { configuraion });
```
## 102
> ### If the second argument of the class is NOT an object.
```js
// ❌
const db = new DataBase("key", 942);

// ✅
const db = new DataBase("key", { configuraion });
```
## 200.1
> ### If you have not specified a key in the class, and you are trying to use the function without specifying the key again.
```js
// ❌
const db = new DataBase();
db.set("value");

// ✅
const db = new DataBase();
db.set("key", "value");

const db = new DataBase("key");
db.set("value");
```
## 201
> ### The error occurs if you pass a different data type instead of the key.
```js
// ❌
tаble.set(942, "vаlue");
db.set([], "vаlue");

// ✅
db.set("key", "value");
```
## 202.1
> ### You specified only the array index, instead of the key.
```js
// ❌
db.set("[0]", "value");

// ✅
db.setConfig("key[0]", "value");
```
## 203
> ### You didn't specify a key in the `setKey` function.
```js
// ❌
db.setKey();

// ✅
db.setKey("key");
```
## 204
> ### You didn't specify a key in the `addKey` function.
## 205
> ### You use `removeKey` when you have only one key in the class.
```js
// ❌
const db = new DataBase("key");
db.removeKey();

// ✅
const db = new DataBase("key.key2");
db.removeKey(); // key
```
## 206
> ### You specified a different data type instead of a number in `removeKey`.
```js
// ❌
db.removeKey("string");

// ✅
db.removeKey();

db.removeKey(1);
```
## 207
> ### Error in `removeKey` when you pass a number more than you have keys.
```js
const db = new DataBase("key.key2.key3");

// ❌
db.removeKey(3);

// ✅
db.removeKey(2); // key
```
## 208
> ### You didn't specify a number in the `add/subtract` function.
```js
// ❌
db.аdd();

// ✅
db.аdd(2);
```
## 209
> ### You specified a different data type in `add/subtract` instead of a number.
## 210
> ### The error that occurs in add/subtrаct occurs if you are trying to overwrite other data.
```js
db.set("user.name", "Masha");
db.set("year", 0);

// ❌
db.add("user.name", 5);
db.add("user", 5);

// ✅
db.add("user.age", 5);
db.add("year", 1);
```
## 211
> ### Identical to the [`210`](#210) error, but only for the `push` function.
## 212
> ### It can occur in any functions where a value is accepted. The error appears if you specify the data type incorrectly.
```js
// ❌
db.set("key", function () { /* ... */ });
db.set("key", Symbol());
// And so on...
```
## 300
> ### If you specified a file without the `.json` extension.
```js
const db = new DataBase({ fileName: "users.txt" });
```
## 301
> ### Incorrect path to the file in the config.
```js
const db = new DataBase({ fileName: "not_existing_folder/file.json" });
```
## 400
> ### Вы ничего не указали в функции `setConfig`.
```js
// ❌
db.setConfig();

// ✅
db.setConfig({ configuraion });
```
## 401
> ### You didn't specify anything in the `setConfig` function.
```js
// ❌
db.setConfig("string");

// ✅
db.setConfig({ configuraion });
```
## 402
> ### The configuration in the config has an incorrect data type.
```js
// ❌
const db = new DataBase({ fileName: 120 });

db.setConfig({ fileName: 120 });

// ✅
const db = new DataBase({ fileName: "file.json" });

db.setConfig({ fileName: "file.json" });
```