import { validateArgs } from "./validation-utils.mjs";

//function to add module to a dictionary/object of results
//it is used in the buildPage function
// and also needs to be passed down the "chain" of module thay might comprise a page


export async function buildPage(options) {

  console.log("BUILDPAGE - OPTIONS: ", options);

  let moduleRes;
  const collectedModules = {};
  
  try {
    validateArgs([
      [options.path, "string"],
      [options.isFetch, "boolean"],
      [options.isBuild, "boolean"]
    ]); 
  } catch (error) {
    return;
  }

  const { path, isFetch, isBuild } = options;
  
  async function addModule(modulePath, args) {

    // console.log("ADD MODULE: ", modulePath, "\n", args);

    let module;
    let moduleRes;

    try {
      module = (await import(modulePath)).default;    
    } catch (error) {
      console.log("IMPORT MODULE ERROR: ", error);
    }

    try {
      moduleRes = await module(addModule, args);
    } catch (error) {
      console.log("RUN MODULE ERROR: ", error);
    }

    if(!collectedModules[ moduleRes ]) {
      collectedModules[ moduleRes.name ] = moduleRes;
    }

    return moduleRes;
  }

  const pagePath = path === "/" ? "/a" : path;

  //if for build, just use what was passed in, else need to construct the full path from URL  
  const adjustedPath = isBuild ? `../../${pagePath}` : `../src/pages${pagePath}.mjs`;

  try {
    moduleRes = await addModule(adjustedPath, { label: "Label for mod 1" }); 
  } catch(err) {
    console.log("moduleCompiler.mjs add module error: ", err);
    return;
  }

  try {
    await addModule("../../src/components/wrapper.mjs", { moduleRes });
  } catch(err) {
    console.log("moduleCompiler.mjs add module error: ", err);
    return;
  }

  return collectedModules;

}
