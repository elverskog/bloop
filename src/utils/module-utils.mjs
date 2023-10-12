import hopper from "../hopper.mjs";
import { utilBaseDir } from "./dir-utils/dir-utils.mjs";

//function to simply import a module
//but at the same time, add its results to the hopper

export default async function loadModule(path, moduleArgs) {

  //is the import path a string
  //and if moduleArgs was passed, is it an object
  if(typeof path === "string") {

    let module;
    let moduleRes;
    //get absolute path to ./src
    const baseDir = utilBaseDir.getBaseDir();

    //if the module path is already absolute, use it, else add baseDir
    const modulePath = path.at(0) === "/" ? path :`${baseDir}/${path}`;

    try {

      // console.log("module-utils path: ", `${baseDir}/${path}`);
      console.log("module-utils path: ", path);

      //import and run the module's default function
      
      module = (await import(modulePath)).default; 

      //if the module's default is a function, run it
      if(typeof module === "function") {
        moduleRes = await module(moduleArgs);
        if(typeof moduleRes === "object") {
          hopper.addToHopper(moduleRes, moduleRes.name);
        }
        // console.log("moduleRes: ", moduleRes);
        return moduleRes;
      } else {
        console.log("loadModule function failed: ");
        console.log("path: ", modulePath);
        return;
      }

    } catch(err){

      console.log("loadModule import path failed: ", err);
      moduleRes = await loadModule(`${baseDir}/src/pages/fourOhFour.mjs`); 
      return;

    }

  } else {

    console.log("loadModule called with invalid arguments: ");
    console.log("path: ", path);
    console.log("moduleArgs: ", moduleArgs);
    return;

  }
    
}
