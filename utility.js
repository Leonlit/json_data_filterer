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
    if (typeof json == "object") {
        if (isArray) {
            json.forEach(ele => {
                let getKeys = Object.keys(ele);
                getKeys.forEach(key => {
                    getInnerKey(ele, key, avKeys)
                });
            });
        }else {
            let getKeys = Object.keys(json);
            getKeys.forEach(key => {
                getInnerKey(json, key, avKeys)
            });
        }
        return avKeys
    }else {
        return Object.keys(json);
    }
}

function getInnerKey (parentEle, currEle, avKeys) {
    if (typeof parentEle[currEle] === "object") {
        if (!avKeys.includes(currEle)) {
            avKeys.push(currEle);
        }
        let inner = Object.keys(parentEle[currEle]);
        inner.forEach(innerKey => {
            let temp = `${currEle}.${innerKey}`;
            if (!avKeys.includes(temp)) {
                avKeys.push(temp);
            }
        });
    }else {
        if (!avKeys.includes(currEle)) {
            avKeys.push(currEle);
        }
    }
    return avKeys;
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