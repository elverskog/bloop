import hopper from "../hopper.mjs"

//function to simply import a module
//but at the same time, add its results to the hopper

export default async function loadModule(path, args) {

  let module;
  let moduleRes;

  if(typeof path === "string") {

    module = (await import(path)).default; 

    moduleRes = await module(args);

    hopper.addToHopper(moduleRes, moduleRes.name);

  } else {

    console.log("loadModule called with invalid arguments: ");
    console.log("path: ", path);
    console.log("args: ", args);
  }
  
  return moduleRes;
    
}
