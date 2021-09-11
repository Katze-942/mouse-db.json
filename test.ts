import { readdir, rm, rmdir, statSync, stat, rmSync, readdirSync } from "fs";
import table from "./DataBase"
//const db = new table("32001", { fileName: "/ok/sas.json" });

//console.log(db.delete("ok10.s"));
//db.setConfig({ fileName: "dsds.json" }, true)
//console.log(table.json);
//console.log(db.config);
//console.log(table.json);
//db.set(9);
//console.log(table.json);
//console.log(db.config);

async function rmDir(path: string | string[]) {
    const pathSplit = typeof path === "string" ? path.split("/").filter(k => k != "") : path;

    if (statSync(pathSplit.join("/")).isDirectory()) {
        const files = readdirSync(pathSplit.join("/"));
        for (let i = 0; i < files.length; i++) {
            if (statSync(pathSplit.join("/") + "/" + files[i]).isDirectory()) {
                const copyPathSplit = pathSplit.slice();
                copyPathSplit.push(files[i]);
                rmDir(copyPathSplit);
                
            } else {
                rmSync(pathSplit.join("/") + files[i])
            };
        }
    } else {
        rmSync(pathSplit.join("/"));
    };
};
rmDir("build/ok");
