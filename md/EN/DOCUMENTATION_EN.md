# Documentation...
If you read the README, you probably realized that this module is a rewritten `quick. db`, but under the `json` format.
And although a lot of things converge, I recommend reading this documentation, because I will be adding new things and features to this module, so I think it will be useful to know about them.
After initializing the module, a `sqlite.json` file will be created in your directory, which will contain the entire database.

## What functions are there at the moment?
- `db.add(key, value)`         - Add a number.
- `db.subtract(key, value)`    - Subtract a number.
- `db.all()`                   - Return all the data as an object.
- `db.push(key, value)`        - Add an element to an array.
- `db.set(key, value)`         - Write an element to the database.
- `db.get(key)`                - Get an item from the database.
- `db.has(key, { checkNull })` - Check whether there is such an element in the database.
- `db.delete(key)`             - Delete an item from the database.
## Examples of how functions work:
```js
// P.S: The symbol "->" will indicate what this or that function returns.
const db = require("mouse-db.json");

// The function will create a profile object in sqlite.json:
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
// The checkNull parameter allows you to specify whether to return false if the parameter is null
db.has("profile.unknown_user"); // -> false
db.set("profile.unknown_user", null); // -> null
db.has("profile.unknown_user"); // -> true
db.has("profile.unknown_user", { checkNull: true }); // -> false

// Deleting an element by key. Returns true if the element is deleted and false if not.
db.delete("profile.unknown_user"); // -> true

// Adds a number or creates it if it does not exist.
db.add("profile.mouse.age", 1);         // -> 3
db.add("profile.mouse.cheese", 1);      // -> 1
db.subtract("profile.mouse.cheese", 1); // -> 0

// Adds an element to the array ( or creates it )
db.push("profile.mouse.friends", "Zlagger"); // -> ["Zlagger"]

// Returns the object of the entire database:
/*
{
    "profile": {
        "mouse": {
            "age": 2,
            "cheese": 0
        }
    }
}
*/
db.all(); // -> {...}
```
## Alilases:
Aliases are an alternative name for some functions. For example, instead of `db.get` - `db.fetch`. There are only a few of them, that's all:
- `db.get` - `db.fetch`
- `db.has` - `db.exists`
- `db.subtract` - `db.remove`
## Initializing a class table:
If you are working with the same key, it will be much more productive to initialize the class with this key and already work with it.
### Example:
```js
const db = require("quick.db");
const table = new db.table("profile.mouse.cheese");

table.has(); // -> false
table.set(1); // -> 1
table.has(); // -> true
```

As you have noticed, it is not necessary to specify the key in the function. The table class also has 3 useful functions:
- `table.setKey(key)` - Set a new key for the class ( the class is not called again, which does not spoil performance )
- `table.addKey(key)` - Add a new key for the class.
- `table.removeKey(number)` - Remove a certain number of keys.
### Examples of work:
```js
const db = require("quick.db");
const table = new db.table("money");

table.setKey("profile.mouse");
table.addKey("cheese"); // Now the class is on the key "profile.mouse.cheese"
table.add(1);
table.get(); // 1
table.removeKey(1); // We remove one key from the end. Now the class has "profile.mouse"
table.get(); // -> { "cheese": 1 }
```
The class also has two parameters that may be useful to you:
- `table.path` - Returns the global path to your project.
- `table.json` - Analogue `db.all();`
---
# That's all, I hope you will like my module. If anything, I'm waiting for everything in #Issues of this GitHib repository :]

###### The documentation was translated using an online translator...
