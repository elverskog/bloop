import hopper from "../hopper.mjs"

//function to simply import a module
//but at the same time add it's run results to the hopper

export default async function loadModule(path, args) {

  let module;
  let moduleRes;

  module = (await import(path)).default; 

  moduleRes = await module(args);

  hopper.addToHopper(moduleRes, moduleRes.name);

  return moduleRes;

}