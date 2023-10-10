import fs from "fs";

//a simple util (a singleton? oh no!) to pass the base file path around
let baseDir; 

export const utilBaseDir = {
 
  //takes a function that should return a base directory 
  setBaseDir: function(genBaseDir) {
    baseDir = genBaseDir();
  },

  getBaseDir: () => {
    console.log("dfsdf ", baseDir);
    return baseDir;
  }

};


//get an array of all valid files paths inside dirPath
//function will augment an existing array, if passed in
export function getAllPages(dirPath, result = [], extension = "mjs") { 

  //get the files in the root of dirPath
  
  try {
    const currentFiles = fs.readdirSync(dirPath);
    
    //loop through the files found
    currentFiles.forEach(function(file) {
      //if the file is a dir, call this function with that dir as dirPath
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        getAllPages(`${dirPath}/${file}`, result);
      //if the file is an MJS file add it to results
      } else if (file.split(".")[ file.split(".").length - 1 ] === extension) {
        //TODO should I check the mime-type?
        // with something like https://www.npmjs.com/package/mime-types?
        result.push(`${dirPath}/${file}`);
      }
    });

  } catch (err) {
    throw new Error(`Error while reading directory ${dirPath}: ${err.message}`);
  }

  return result;

}
