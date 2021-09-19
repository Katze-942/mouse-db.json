# A list of mouse-db.json updates will be stored here
## Versions:
- **`2.0.1`** - Fix with the fact that there were no build files in the module, which is why it could not start.
- **`2.0.0`** - Rewriting the module from scratch, changing the structure and adding a config. The module is no longer dependent on `quick.db`
---
## **`v2.0.0`** - Global update!
#### Initially, this module could be put in place of `quick.db`, there was no need to rewrite anything. Now this module is living its own life, it will develop its functions. The module was rewritten in **TypeScript** and now has support for **JSDoc** documentation.
### It was removed:
- 1\. `db.all()`, its replacement will be `DataBase.json`
- 2\. One alias, `db.remove`. I thought it was too strange.
### Was added/changed:
- 1\. `TypeScript` and `JSDoc` support
- 2\. Protection against an emergency shutdown of the project, your data will not be lost now!
- 3\. The new versions will have a full-fledged configuration, at the moment you can choose in which file to save the database.
- 4\. The config can be applied locally and globally.
- 5\. Added support for arrays in keys.
- 6\. Extended documentation.
- 7\. Its own error system, each error tells its own code, value, key and function in which the error occurred.
- 8\. Asynchronous secure file recording via streams.
- 9\. The module no longer uses `eval`
- 10\. has now takes `boolean` as the second argument, instead of the `object`.
- 11\. To work with the module, you need to initialize the class
- 12\. Methods in the class can now accept keys, which is very convenient.
- 13\. Now the module checks arrays, objects COMPLETELY and shows the FULL path to the unsupported value
- 14\. It has become much safer to write huge files.
- 15\. The module code structure has been completely redesigned.
- 16\. Added syntactic sugar for the `add`/`subtract`/`push` functions
- 17\. `DаtаBаse.json` now returns an object from filenames along with their data.
- 18\. `DаtаBаse.path` renamed to `DаtаBаse.globаlPаth`
