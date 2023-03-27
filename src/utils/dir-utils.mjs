import fs from "fs";

//get an array of all valid files paths inside dirPath
//function will augment an existing array, if passed in
export function runAllPages(dirPath, result) { 

  const currentFiles = fs.readdirSync(dirPath);

  //loop through the files found
  currentFiles.forEach(async file => {
    //if the file is a dir, call this function with that dir as dirPath
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      getAllPages(`${dirPath}/${file}`, result);
    //if the file is an MJS file import and run it
    //this will add it's "various parts" to the hopper
    } else if (file.split(".")[ file.split(".").length - 1 ] === "mjs") {
      //TODO if this function is needed, should I check the mime-type?
      // with something like https://www.npmjs.com/package/mime-types?
      const module = (await import(`${dirPath}/${file}`)).default;
      module();
    }
  })

  return result;

}


//get an array of all valid files paths inside dirPath
//function will augment an existing array, if passed in
export function getAllPages(dirPath, result) { 

  result = result || [];
  const currentFiles = fs.readdirSync(dirPath);

  //loop through the files found
  currentFiles.forEach(function(file) {
    //if the file is a dir, call this function with that dir as dirPath
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      getAllPages(`${dirPath}/${file}`, result);
    //if the file is an MJS file add it to results
    } else if (file.split(".")[ file.split(".").length - 1 ] === "mjs") {
      //TODO if this function is needed, should I check the mime-type?
      // with something like https://www.npmjs.com/package/mime-types?
      result.push(`${dirPath}/${file}`);
    }
  })

  return result;

}