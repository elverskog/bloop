import { validateArgs } from "./validation-utils.mjs";

//function to add module to a dictionary/object of results
//it is used in the buildPage function
// and also needs to be passed down the "chain" of module thay might comprise a page
async function addModule(modulePath, args) {

  let module;
  let moduleRes;
  const result = {};

  console.log("MODULEPATH: ", modulePath);

  try {
    module = (await import(modulePath)).default;    
  } catch (error) {
    console.log("IMPORT MODULE ERROR: ", error);
  }

  console.log("MODULE: ", module);

  try {
    moduleRes = module(addModule, args);
  } catch (error) {
    console.log("RUN MODULE ERROR: ", error);
  }

  if(!result[ moduleRes ]) {
    result[ moduleRes.name ] = moduleRes;
  }

  return result;
  
}


export async function buildPage(options) {

  let result;
  const { path, isFetch, isBuild } = options;

  if (!validateArgs([ 
    [path, "string"],
    [isFetch, "boolean"],
    [isBuild, "boolean"]
  ])) return;
  
  const pagePath = path === "/" ? "/a" : path;

  //if for build, just use what was passed in, else need to construct the full path from URL  
  const adjustedPath = isBuild ? `../../${pagePath}` : `../src/pages${pagePath}.mjs`;

  try {
    result = await addModule(adjustedPath, { label: "Label for mod 1" }); 
  } catch(err) {
    console.log("moduleCompiler.mjs add module error: ", err);
    return;
  }

  if(!isFetch) {
    // const wrapper = (await import("../../src/components/wrapper.mjs")).default;
    // const wrapperResult = await wrapper(result);
    // console.log("WRAPPER RESULT: ", wrapperResult);
    // result = {...result, ...wrapperResult};
  }

  console.log("RESULT: ", result);

  return result;

}
