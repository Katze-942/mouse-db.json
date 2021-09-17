# Documentation...
### >> [**Module configuration**](https://github.com/DarkVessel/mouse-db.json/blob/main/md/EN/Configuration.md)
### >> [**Error codes and their description**](https://github.com/DarkVessel/mouse-db.json/blob/main/md/EN/Errors.md)
### >> [**Latest updates**](https://github.com/DarkVessel/mouse-db.json/blob/main/md/EN/Updates.md)
---
After initializing the module, a `mouse.json` file will be created in your directory containing the entire database. All of it is built on objects and keys in them. Here's an example:
```json
{
    "key": "vаlue"
}
```
The `"key"` holds the `"value"`. 
Consider a more complex object:
```json
{
    "profile": {
        "name": "Иван"
    }
}
```
How do I refer to the `name` key? Simple !: `profile.name`

You can also refer to arrays:
```json
{
    "profile": {
        "names": ["Иван"]
    }
}
```
Here's an example: **`"profile.names[0]"`**

Below you will understand how it works with examples!
## Class initialization.
The class takes two arguments:
- Key.
- Object with settings.

Example:
> ### > JаvаScript
```js
const DataBase = require("mouse-db.json");
const db = new DataBase("key", { fileName: "users.json" });
```
> ### > TypeScript
```js
import DataBase = require("mouse-db.json");
const db = new DataBase("key", { fileName: "users.json" });
```
*For those who write in TypeScript, `@types/node` types are provided by default already in the library, so you probably won't need to install anything.*

In fact, the class is flexible, and you can, for example, omit the second or first argument. Here are examples of options:
```js
new DataBase();
new DataBase("key");
new DataBase({ fileName: "users.json" });
new DataBase("key", { fileName: "users.json" });
```
## What functions are there at the moment?
- `db.add(key, value)`         - Add a number.
- `db.subtract(key, value)`    - Subtract the number.
- `db.push(key, value)`        - Add an item to the array.
- `db.set(key, value)`         - Write the element to the base.
- `db.get(key)`                - Get an item from the base.
- `db.has(key, checkNull)`     - Check if there is such an element in the database.
- `db.delete(key)`             - Remove an element from the base.
- `db.setConfig(key)`          - Install the key for the base.
- `db.addKey(key)`             - Add key.
- `db.removeKey(number)`       - Remove the key.
## Примеры работы функций:
```js
// The symbol "->" will denote what this or that function returns.
const DataBase = require("mouse-db.json");
const db = new DataBase();

// The function will create a profile object in mouse.json:
/*
{
    "profile": {
        "mouse": { "age": 2 }
    }
}
*/
db.set("profile.mouse.age", 2); // -> 2

// Returns what is located by a specific key.
db.get("profile.mouse.age"); // -> 2

// Returns true if there is something for such a key
// The checkNull parameter allows you to specify whether to return false if the value is null
db.has("profile.unknown_user"); // -> false
db.set("profile.unknown_user", null); // -> null
db.has("profile.unknown_user"); // -> true
db.has("profile.unknown_user", true); // -> false

// Deleting an element by key. Returns true if the element is deleted and false if not.
db.delete("profile.unknown_user"); // -> true

// Adds a number or creates it if it does not exist.
db.add("profile.mouse.age", 1);         // -> 3
db.add("profile.mouse.cheese", 1);      // -> 1
db.add("profile.mouse.cheese", 2, 2);   // Добавит 4 сыра.

// Subtracts a number.
db.subtract("profile.mouse.cheese", 1); // -> 4
db.subtract("profile.mouse.cheese", 2, 2); // It will subtract 4 cheeses -> 0

// Adds an element to the array ( or creates it )
db.push("profile.mouse.friends", "Zlagger"); // -> ["Zlagger"]
db.push("profile.mouse.friends", "Аndrey", "Mаshа"); // -> ["Zlagger", "Аndrey", "Mаshа"]

// An alternative way to pass elements to push:
const friends = ["Zlagger", "Аndrey", "Mаshа"];
db.push("profile.mouse.friends", ...friends);
```
## Aliases:
Aliases are an alternative name for some functions. For example, instead of `db.get` - `db.fetch`. There are only a few of them, that's all:
- `db.get` - `db.fetch`
- `db.has` - `db.exists`
## Let's talk about the class.
If you are working with the same key, it will be much easier to initialize the class with the key and already work.
### Example:
```js
const DataBase = require("mouse-db.json");
const db = new DataBase("profile.mouse");

db.has(); // -> false
db.set({}); // -> {}
db.has(); // -> true

// An interesting feature, if you specify the key in the functions, it will be supplemented with the main one. Example:
db.set("age", 3); // A key addition occurred ( profile.mouse.age )
db.get(); // -> { age: 3 }
```
The class also has 3 useful functions:
- `db.setKey(key)` - Set a new key for the class.
- `db.addKey(key)` - Add a new key for the class.
- `db.removeKey(number)` - Remove a certain number of keys.
### Examples of work:
```js
const DataBase = require("mouse-db.json");
const db = new DataBase();

db.setKey("profile.mouse");
db.addKey("cheese"); // Now the key = "profile.mouse.cheese"
console.log(db.key); // -> ["profile", "mouse", "cheese"]

db.removeKey(1); // We remove one key from the end. Now the class has a key = "profile.mouse"
console.log(db.key); // -> ["profile", "mouse"]
```
The class also has a couple of statistical variables that may be useful to you:
- `db.key`     - Returns the key as an array.
- `db.config`  - Local configuration.
- `DataBase.globalPath` - Returns the global path to your project.
- `DataBase.config`     - Global configuration.
- `DataBase.json`       - An object that shows what is stored in each file.
---
## **!? Questions/Answers ?!**
> 1. *soon...*
---
# That's all, I hope you will like my module. If anything, I'm waiting for everything in #Issues of this GitHib repository :]

###### The documentation was translated using an online translator...
