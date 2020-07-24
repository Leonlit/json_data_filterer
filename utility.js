const fs = require("fs");

function getFileData (callback ,file) {
    fs.readFile(file, "utf8", (err, data)=> {
        if (err) {
            throw err;
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

module.exports = {getFileData, getAvObjKeys, isJson}