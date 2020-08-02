const fs = require("fs");
const homeDir = require('os').homedir();

//specifying the desktop directory location to a variable
const desktopLoc = `${homeDir}\\Desktop`;

//getting JSON file data
function getFileData (callback ,file) {
    fs.readFile(file, "utf8", (err, data)=> {
        if (err) {
            console.log(err);
        }else {
            callback(data);
        }
    });
}

//generate new file for the filtered data
function generateJsonFile (json, oldName) {
    const newName = `filtered_${oldName}`;
    fs.writeFile(`${desktopLoc}\\${newName}`, JSON.stringify(json), function (err) {
        if (err) throw err;
        console.log('File is created successfully.\n\n');
    }); 
}

//return all the availble key of the json data
function getAvObjKeys (json) {
    let avKeys = [];
    if (isObject(json)) {
        //in current level, is the element in array form or object form?
        if (isArray(json)) {
            //if is array loop through the element and pass its content to the getInnerKey() function
            //to find its inner elements key 
            json.forEach(ele => {
                let getKeys = Object.keys(ele);
                getKeys.forEach(key => {
                    getInnerKey(ele, key, avKeys);
                });
            });
        }else {
            //else if its not an array (means an object) 
            //get the current level keys and pass the json, inner key and available-key array (avKeys) to the getInnerkey()
            let getKeys = Object.keys(json);
            getKeys.forEach(key => {
                getInnerKey(json, key, avKeys); 
            });
        }
        return avKeys
    }else {
        console.log("Error when parsing the JSON data");
    }
}

//in this function, find the name for the inner key and check if the content of an property is an object or value
//  parentEle   - an json object
//  currEle     - the key name
//  avKeys      - the array which contains the list of available keys for the json file
//  head        - the string that hold the name of the previous level json key
function getInnerKey (parentEle, currEle, avKeys, head="") {
    let theELe = parentEle[currEle];
    if (isObject(theELe)) {
        //since we'll be using recursion for the function, we need a variable to hold the name of the previous level (head)
        let nameTemp = "";

        //if the head is empty, that means that this is the initial level operation 
        if (head == "") {
            nameTemp = currEle;
        }

        //if the avKeys does not have this key name in its array, push the value into avKeys
        if (!avKeys.includes(nameTemp) && nameTemp != "") {
            avKeys.push(nameTemp);
        }

        //then if the content of parentEle[currEle] is a array, loop through it and call the function generateInnerKey()
        if (isArray(theELe)) {
            theELe.forEach(arrEle => {
                let getKeys = Object.keys(arrEle);
                getKeys.forEach(innerKey => {
                    //  arrEle      - an json array element
                    //  currEle     - the name of the current key
                    //  innerKey    - the name of the next level property key
                    //  avKeys      - the array which contains the list of available keys for the json file
                    //  head        - the string that hold the name of the previous level json key
                    generateInnerKey(arrEle, currEle, innerKey, avKeys, head);
                });
            });
        }else {
            let inner = Object.keys(theELe);
            inner.forEach(innerKey => {
                //if its now a array of object, then call the function but this time the first value will be the 
                //element of the parent's key
                generateInnerKey(theELe, currEle, innerKey, avKeys, head);
            });
        }
    }else {
        //when the value is not an object (literally the value), check if the name already exists or not. 
        //If not add it into it the avKeys array, ignore it otherwise. 
        if (!avKeys.includes(currEle)) {
            avKeys.push(currEle);
        }
    }
    return avKeys;
}

//function for generating the name of lower level json key
//important note is that the program also print out keys no matter if its an array or an object

function generateInnerKey (theELe, currEle, innerKey, avKeys, head) {
    //getting the current key for the lower level json key
    let childKey = `${currEle}.${innerKey}`;

    //if the head is not empty, means that its from a higher level (its a child key) 
    //replace the child key with the combination of head with its inner key
    if (head != "") {
        childKey = `${head}.${innerKey}`;
    }

    //if the current edited key name is not in the avKeys array, push it into the array
    if (!avKeys.includes(childKey)) {
        avKeys.push(childKey);
    }
    //if the inner element content is an object, call the getInnerKey() again.
    if (isObject(theELe[innerKey])) {
        let tempHolder = getInnerKey(theELe, innerKey, avKeys, childKey);
        //if the returned value isn't null, combine the array with avKeys
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

//comparing the value choosen by the user with the available json keys
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

//function for filtering json data from the selected options
function filteredJson (json, options) {
    //if the current json data is in array form
    if (isArray(json)) {
        json.forEach(ele => {
            //loop through the element and also loop through the options array
            options.forEach(key => {
                if (key.includes(".")) {
                    //if the current options contains '.' in the string means that the key is at a lower level.
                    //if so pass the key and element into the filterInnerData() function
                    filterInnerData(ele, key)
                }else {
                    //else if it does not contains "." in the string, its the initial level key
                    delete ele[key]
                }
            });
        });
    }else {
        //if the json initial content is not an array but an object
        options.forEach(ele => {
            //loop through the options
            if (ele.includes(".")) {
                //and if the options contain s ".", call the filterInnerData() function
                filterInnerData(json, ele)
            }else {
                delete json[ele]
            }
        });
    }
    return json;
}

//used to filter lower level content
//  parent - a json object | value | array
//  key - specifying which key to be filtered out
function filterInnerData (parent, key) {
    //split the string into sub-keys array
    let tempKey = key.split(".");
    let arrLen = tempKey.length
    
    //referencing the object to a new variable
    let obj = parent;

    //if the lower level of the json data is an object
    //  obj[tempKey[0]] - used to check if the lower level is an array
    //  obj[key]       - if the key can be referenced to an actual object it means that 
    //                   it is the last location of the intended data to be filtered out
    if (isObject(obj[tempKey[0]]) || isObject(obj[key])) {
        //if the content of the object is an array
        if  (isArray(obj[tempKey[0]])) {
            let theObj = obj[tempKey[0]]
            theObj.forEach(inner=>{
                if (isObject(theObj[inner])) {
                    filterInnerData(inner, key.substring(tempKey[0].length, key.length - tempKey[0].length));
                }else {
                    delete theObj[inner];
                }
            });
        }else {
            //if the content of the element is not an array, its an object
            //loop through the option string array to get the reference to the object by stacking the object
            for (let i = 0; i < arrLen - 1; i++) {
                let ele = tempKey[i];
                if( !obj[ele] ) {
                    obj[ele] = {};
                }
                //if the element is an array, then call the filterInnerData() function again
                if (isArray(obj[ele])) {
                    obj[ele].forEach(inner=> {
                    //with the content of the array passed to the function
                    //  inner               - the content of the lower level json
                    //  tempKey.splice(.... - to cut of the processed key name before the current loop
                    filterInnerData(inner, tempKey.splice(i + 1, tempKey.length).join("."));
                })
                }
                //then if there's no array, just continue with the object reference stacking
                //accessing objects by stacking them together and pass them to the delete section
                obj = obj[ele];
            }
            //then after the loop has finished referencing the object, delete the object key
            delete obj[tempKey[arrLen-1]];
        }
    }else {
        //incase its not a object, delete the value from the object by using its key name
        delete obj[key];
    }
}

module.exports = {getFileData, getAvObjKeys, isJson, 
                filteredJson, checkOptions, generateJsonFile}