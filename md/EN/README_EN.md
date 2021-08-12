# # mouse-db.json
#### This module was created for those who have problems with the original quick.db (for example installation or work)
#### The documentation of the original quick.db will almost completely fit this module, so ***most likely you won't need to rewrite anything.***
## !! RECOMMENDED VERSION NODE.JS: 14.17.5 OR ABOVE !!
---
## The main differences of quick.db and mouse-db.json:
- In quick.db is used by `sqlite`, and in my module: `json`, which means you don't need to compile and install anything, everything is already pre-installed.
- In the original quick.db, `new db.table(key)` will return you a class with all the functions. However, there is one thing, in my module, you do NOT need to specify the key in the functions from `table`. Example:
```js
// quick.db
const db = require("quick.db");
const economy = new db.table('economy'); 
economy.set('myBalance', 500); // economy.myBalance
economy.get('myBalance'); // -> 500
db.get('economy'); // -> { myBalance: 500 }
```
```js
// mouse-db.json
const db = require("mouse-db.json");
const economy = new db.table('economy'); 
economy.set(500);  // -> 500
economy.get();     // -> 500
db.get('economy'); // -> 500
```
- The `db.all()` function does not return an array, but a JSON object of the file.
- The `db.get(key)` function returns `undefined` if the element is not found. In the original module, the function returns `null`
- The `db.push(key, value)` function returns the modified array.
- Instead of `json.sqlite`, is created `sqlite.json`
### These were the main differences from the original quick.db
### My module will also have its own chips and functions that are independent of the original `quick.db`, it's just a matter of time.
# That's all, if anything, I'm waiting for questions/bugs/ideas in the #Issues of this GitHub repository.
---
#### P.s: The translation was done through a translator, I don't know English :(
#### If anyone knows - please suggest a translation, I will be glad. Thanks.