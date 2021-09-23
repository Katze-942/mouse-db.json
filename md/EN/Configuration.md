# Module Configuration **mouse-db.json**
### There are two types of configuration, these are **local** and **global**. Let's analyze each of them.
---
# Global Configuration:
## The global config is global, it is logical. It will be applied to each initialization of the class, set using the **`setConfig(object)`** function.
```js
const db = new DataBase("key");
db.setConfig({ fileName: "file.json" });
db.set("vаlue"); // It will be written to file.json

const db2 = new DataBase("key");
db2.set("vаlue"); // It will still be written to file.json
```
# Local configuration:
## The local config is applied only to one instance of the class, it is applied in two ways:
1. Through **`setConfig(object, true)`**
2. Through the second argument in the class.

Let's consider both options.
```js
// The first option.
const db = new DataBase("key");
db.setConfig({ fileName: "file.json" }, true);
db.set("vаlue"); // It will be written to file.json

const db2 = new DataBase();
db2.set("vаlue"); // It will already be written to mouse.json
```
```js
// The second option is more compact.
// Note: If you don't need a key, you don't need to specify it, for example:
// new DataBase({ fileName: "file.json" });
const db = new DataBase("key", { fileName: "file.json" });
db.set("vаlue"); // 3апишется в file.json

const db2 = new DataBase("key");
db2.set("vаlue"); // Уже запишется в sqlite.json
```
---
# What can I configure?
## Starting from the version **2.0** you can configure things like:
- `fileName - The name, the path to the file.`


--- 
# Description of all properties:
## <span color="FADADD">></font> <font color="FF6800">**fileName**:</font> <font color="42AAFF">***string***</font>
> ### **It is used to specify a file as a database.** 

> ### > *By default: <font color="FFFF00">"mouse.json"*</font>
```js
new DataBase({ fileName: "file.json" });
```
*There will be more in the future, just for now this is an introduction!*