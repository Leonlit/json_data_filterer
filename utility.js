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
    if (isObject(json)) {
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

function getInnerKey (parentEle, currEle, avKeys, head="") {
    let theELe = parentEle[currEle];
    if (isObject(theELe)) {
        let nameTemp = "";
        if (head == "") {
            nameTemp = currEle;
        }
        if (!avKeys.includes(nameTemp) && nameTemp != "") {
            avKeys.push(nameTemp);
        }
        if (isArray(theELe)) {
            theELe.forEach(arrEle => {
                let getKeys = Object.keys(arrEle);
                getKeys.forEach(innerKey => {
                    generateInnerKey(theELe, currEle, innerKey, avKeys, head);
                });
            });
        }else {
            let inner = Object.keys(theELe);
            inner.forEach(innerKey => {
                generateInnerKey(theELe, currEle, innerKey, avKeys, head);
            });
        }
    }else {
        if (!avKeys.includes(currEle)) {
            avKeys.push(currEle);
        }
    }
    return avKeys;
}

function generateInnerKey (theELe, currEle, innerKey, avKeys, head) {
    let childKey = `${currEle}.${innerKey}`;
    if (head != "") {
        childKey = `${head}.${innerKey}`;
    }
    if (!avKeys.includes(childKey)) {
        avKeys.push(childKey);
    }
    if (isObject(theELe[innerKey])) {
        let tempHolder = getInnerKey(theELe, innerKey, avKeys, childKey);
        if (tempHolder != null && tempHolder != undefined && tempHolder != []) {
            avKeys.concat(tempHolder);
        }
    }
}

function isJson (data) {
    try {
        JSON.parse(data);
    }catch (err) {
        return false;
    }
    return true;
}

function isArray (data) {
    return Array.isArray(data);
}

function isObject (data) {
    return typeof data == "object";
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

function filteredJson (json, options) {
    if (isArray(json)) {
        json.forEach(ele => {
            options.forEach(key => {
                if (key.includes(".")) {
                    filterInnerData(ele, key)
                }else {
                    delete ele[key]
                }
            });
        });
    }else {
        options.forEach(ele => {
            if (ele.includes(".")) {
                filterInnerData(json, ele)
            }else {
                delete json[ele]
            }
        });
    }
    return json;
}

function filterInnerData (parent, key) {
    let tempKey = key.split(".");
    let arrLen = tempKey.length
    
    //referencing the object to a new variable
    let obj = parent;
    //loop through the accessing query
    for (let i = 0; i < arrLen - 1; i++) {
        let ele = tempKey[i];
        if( !obj[ele] ) obj[ele] = {}
        //accessing objects by stacking them together and pass them to the delete section
        obj = obj[ele];
    }
    delete obj[tempKey[arrLen-1]];
}

module.exports = {getFileData, getAvObjKeys, isJson, 
                filteredJson, checkOptions, generateJsonFile}