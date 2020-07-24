const fs = require("fs");

function getFileData (callback ,file) {
    fs.readFile(file, "utf8", (err, data)=> {
        if (err) {
            console.log(err);
        }else {
            callback(data);
        }
    });
}

function getAvObjKeys (jsonArr, isArray) {
    if (isArray) {
        return Object.keys(jsonArr[0]);
    }else {
        return Object.keys(jsonArr);
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
    json.forEach(ele => {
        options.forEach(key => {
            delete ele[key]
        });
    });
    console.log(json[0]);
}

module.exports = {getFileData, getAvObjKeys, isJson, filteredJson, checkOptions}