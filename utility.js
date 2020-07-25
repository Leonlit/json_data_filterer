const fs = require("fs");
const homeDir = require('os').homedir();

function getFileData (callback ,file) {
    fs.readFile(file, "utf8", (err, data)=> {
        if (err) {
            console.log(err);
        }else {
            callback(data);
        }
    });
}

const desktopLoc = `${homeDir}\\Desktop`;

function generateJsonFile (json, oldName) {
    const newName = `filtered_${oldName}`;
    fs.writeFile(`${desktopLoc}\\${newName}`, JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
    }); 
}

function getAvObjKeys (json, isArray) {
    let avKeys = []
    if (isArray) {
        json.forEach(ele => {
            let getKeys = Object.keys(ele);
            getKeys.forEach(key => {
                if (typeof ele[key] === "object") {
                    if (!avKeys.includes(key)) {
                        avKeys.push(key);
                    }
                    let inner = Object.keys(ele[key]);
                    inner.forEach(innerKey => {
                        let temp = `${key}.${innerKey}`;
                        if (!avKeys.includes(temp)) {
                            avKeys.push(temp);
                        }
                    });
                }else {
                    if (!avKeys.includes(key)) {
                        avKeys.push(key);
                    }
                }
            });
        });
    }else {
        return Object.keys(json);
    }
    return avKeys
}

function isJson (data) {
    try {
        JSON.parse(data);
    }catch (err) {
        return false;
    }
    return true;
}

function checkOptions (optionsArr, objKeys) {
    let result = true;
    optionsArr.forEach(element => {
        if (!objKeys.includes(element)) {
            result = false;
            return false;
        }
    });
    return result;
}

function filteredJson (json, options, isArray) {
    if (isArray) {
        json.forEach(ele => {
            options.forEach(key => {
                if (key.includes(".")) {
                    let tempKey = key.split(".");
                    let arrLen = tempKey.length
                    
                    //referencing the object to a new variable
                    let obj = ele;
                    //loop through the accessing query
                    for (let i = 0; i < arrLen - 1; i++) {
                        let ele = tempKey[i];
                        if( !obj[ele] ) obj[ele] = {}
                        //accessing objects by stacking them together and pass them to the delete section
                        obj = obj[ele];
                    }
                    delete obj[tempKey[arrLen-1]];
                }else {
                    delete ele[key]
                }
            });
        });
    }else {
        options.forEach(ele => {
            delete json[ele]
        });
    }
    return json;
}

module.exports = {getFileData, getAvObjKeys, isJson, 
                filteredJson, checkOptions, generateJsonFile}