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

function filteredJson (json, options, isArray) {
    if (isArray) {
        json.forEach(ele => {
            options.forEach(key => {
                delete ele[key]
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