const prompts = require("prompts");
const utils = require("./utility.js");

console.log("Please input the location of the JSON file : \n");
const loc = "C:\\Users\\User\\Desktop\\cityList.json";
(async () => {
    
    /*//getting the file location from user
    const getLocation = await prompts({
        type: "text",
        name: "file",
        message: "Please provide the program with the file location of the json file \n"
    });
    */

    //getting the file content of the data
    utils.getFileData((data)=> {
        
        if(!utils.isJson(data)) {
            json = data;
        }else {
            json = JSON.parse(data);
        }

        getFilterOptions(json)

    }, loc);//getLocation.file);
})();

async function getFilterOptions(json) {
    //get the available key of the json (works for either array of objects or object)
    const avObjKeys = utils.getAvObjKeys(json, Array.isArray(json));
        
    //listing out the available key in the json
    console.log("The available keys are : \n");
    avObjKeys.forEach(element => {
        console.log(`\t + ${element}`);
    });

    //getting the key to be deleted
    let tempJson = json;    // just in case user messed up
    let done  = false;
    while (!done) {
        let option = await getUserInput("text", "Please specify which key that you want to remove from the json file?  \n");
        let confirm = await getUserInput("text", `Is this/these the keys that you want to remove from the json file? [y/n] : \n ${option}\n`);
        if (confirm[0] == "y") {
            console.log("ok");
            break;
        }
    }
    
}

async function getUserInput (type, message) {
    const getData = await prompts({
        type: type,
        name: "data",
        message: message
    });
    return getData.data;
}