import fs from "fs";
import path from "path";

//get an array of all valid paths inside dirPath
//function will augment an existing array, if passed in
export function getAllDirs(dirPath, arrayOfDirs, baseDir) {

  arrayOfDirs = arrayOfDirs || [];
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfDirs.push(`${dirPath}/${file}`);
      arrayOfDirs = getAllDirs(dirPath + "/" + file, arrayOfDirs);
    }
  })

  return arrayOfDirs;

}


//get an array of all valid paths inside /src/pages
// export function getAllFiles(dirPath, extension, arrayOfFiles) {

//   arrayOfFiles = arrayOfFiles || [];
//   const files = fs.readdirSync(dirPath);

//   files.forEach(function(file) {
//     if (fs.statSync(dirPath + "/" + file).isDirectory()) {
//       arrayOfFiles = getAllFiles(dirPath + "/" + file, "css", arrayOfFiles)
//     } else {
//       extension = file.split(".")[ file.split(".").length - 1 ];
//       if(extension === "css") {
//         arrayOfFiles.push(path.join(dirPath, "/", file))
//       }
//     }

//   })

//   return arrayOfFiles;

// }