import hopper from "../hopper.mjs";
import { utilBaseDir } from "./dir-utils/dir-utils.mjs";

//function to simply import a module
//but at the same time, add its results to the hopper

export default async function loadModule(path, args) {

  let module;
  let moduleRes;
  const baseDir = utilBaseDir.getBaseDir();

  //is the import path a string
  //and if args was passed, is it an object
  if(typeof path === "string") {

    try {
      
      //import and run the module's default function
      module = (await import(`${baseDir}/${path}`)).default; 

      //if the module's default is a function, run it
      if(typeof module === "function") {
        moduleRes = await module(args);
        if(typeof moduleRes === "object") {
          hopper.addToHopper(moduleRes, moduleRes.name);
        }
        // console.log("moduleRes: ", moduleRes);
        return moduleRes;
      } else {
        console.log("loadModule function failed: ");
        console.log("path: ", path);
        return;
      }

    } catch(err){

      console.log("loadModule import path failed: ", err);
      moduleRes = await loadModule("src/pages/fourOhFour.mjs"); 
      return;

    }

  } else {

    console.log("loadModule called with invalid arguments: ");
    console.log("path: ", path);
    console.log("args: ", args);
    return;

  }
    
}
