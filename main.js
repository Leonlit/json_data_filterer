const prompts = require("prompts");
const utils = require("./utility.js");
const path = require("path");

let fileName = "";

//first method to be invoked
(async () => {
    
    //getting the file location from user
    console.log("Please input the location of the JSON file : \n");
    const getLocation = await getUserInput("text", "Please provide the program with the file location of the json file \n");
    fileName = path.basename(getLocation);

    //getting the file content of the data
    utils.getFileData((data)=> {
        if(utils.isJson(data)) {
            try {
                data = JSON.parse(data);
                getFilterOptions(data)
            }catch (err) {
                console.log("The file contents isn't in JSON format")
            }
        }else {
            console.log("\nWrong file format, the file isn't in JSON format. exiting program...\n")
        }
    }, getLocation); 
})();

async function getFilterOptions(json) {
    //get the available key of the json (works for either array of objects or object)
    const avObjKeys = utils.getAvObjKeys(json, Array.isArray(json));

    //getting the key to be deleted
    let done  = false;
    while (!done) {
        
        //listing out the available key in the json
        console.log("The available keys are : \n");
        avObjKeys.forEach(element => {
            console.log(`\t + ${element}`);
        });
        console.log("\n");
        
        //getting user input
        let options = await getUserInput("text", "Please specify which key that you want to remove from the json file?\nmultiple key are separated with commas (,)\n\n");
        let inputError = true;
        
        //make sure that the input is correct
        while (inputError) {
            const confirm = await getUserInput("text", `\n\nIs this/these the keys that you want to remove from the json file? [y/n] : \n\n\t${options}\n\n`);
            if (confirm[0] == "y") {
                let optionsArr;
                try {
                    //converting strings to array
                    optionsArr = options.split(",")
                                .map(e=>e.trim());
                }catch (err) {
                    console.log("\nError in seperating the options. Please make surer they're separated by commas (,)\n");
                    break;
                }

                //check if the options given by user is a valid JSON object's key
                const isValidOptions = utils.checkOptions(optionsArr, avObjKeys);
                
                //if not valid skip other operation and loop back the options input again
                if (!isValidOptions) {
                    console.log("\nError : Some of the options that you've provided are not valid. Please re-enter the options...\n")
                    break;
                }

                const newJson = utils.filteredJson(json, optionsArr, Array.isArray(json));
                console.log("data example");
                if (Array.isArray(newJson)) {
                    console.log(newJson[0]);
                }else {
                    console.log(newJson);
                }

                console.log("\ngenerating file in desktop...");
                utils.generateJsonFile(newJson, fileName);

                inputError = false;
                done = true;
                break;
            }else if (confirm[0] == "n"){
                console.log("restarting operation...");
                inputError = false;
            }else {
                console.log("Wrong operation"); 
            }
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