import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

//a simple util module (a singleton? oh no!) to set and pass the base file path around
let baseDir; 

export const utilBaseDir = {
 
  //takes a function as an arg that should return a base directory 
  setBaseDir: function(metaUrl) {

    let baseDirTemp;     

    if (typeof metaUrl === "string" && metaUrl.substring(0, 7) === "file://") {

      try {
        baseDirTemp = path.dirname(fileURLToPath(metaUrl));
      } catch (error) {
        console.log("setBaseDir - genBaseDir failed", error);
      }

      if (typeof baseDirTemp === "string") {
        baseDir = baseDirTemp;
        return baseDir;
      } else {
        console.log("setBaseDir produced non-string", );
        return false;
      }
     
    } else {
      
      console.log("setBaseDir passed non-string or a invalid file://");
      return false;

    }

  },

  getBaseDir: () => {
    return baseDir;
  }

};


//get an array of all valid file paths inside dirPath
//function will augment an existing array, if passed in
export function getAllFiles(dirPath, result = [], extension = "mjs") { 

  try {

    const currentFiles = fs.readdirSync(`./${dirPath}`);
    // const currentFiles = fs.readdirSync(`./`);
   
    console.log("CURRENT FILES: ", currentFiles);

    //loop through the files found
    currentFiles.forEach(function(file) {
      //if the file is a dir, call this function with that dir as dirPath
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        getAllFiles(`${dirPath}/${file}`, result);
        //if the file is an MJS file add it to results
      } else if (file.split(".")[ file.split(".").length - 1 ] === extension) {
        //TODO should I check the mime-type?
        // with something like https://www.npmjs.com/package/mime-types?
        result.push(`${dirPath}/${file}`);
        // result.push(`${file}`);
      }
    });

  } catch (err) {
    throw new Error(`Error while reading directory ${dirPath}: ${err.message}`);
  }
  
  return result;

}
