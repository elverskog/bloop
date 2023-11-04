import { validateArgs } from "./validation-utils.mjs";

//function to add module to a dictionary/object of results
//it is used in the buildPage function
// and also needs to be passed down the "chain" of module thay might comprise a page


export async function buildPage(options) {

  // console.log("BUILDPAGE - OPTIONS: ", options);

  //const collectedModules = [];
  
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
  let moduleRes;
  let wrappedRes;
  let pageRes = {
    name: "",
    css: {},
    markup: "",
    script: {},
  };


  async function addModule(modulePath, args) {

    // console.log("ADD MODULE: ", modulePath, "\n", args);
    console.log("ADD MODULE: ", modulePath);

    const path = modulePath === "/" ? "/a" : modulePath;
    //if for build, just use what was passed in, else need to construct the full path from URL  
    const adjustedPath = isBuild ? `../../${path}` : `../src/pages${path}.mjs`;

    let module;
    let moduleRes;

    try {
      module = (await import(adjustedPath)).default;    
    } catch (error) {
      console.log("IMPORT MODULE ERROR: ", error);
    }

    try {
      moduleRes = await module(addModule, args);
    } catch (error) {
      console.log("RUN MODULE ERROR: ", error);
    }

    // if(!collectedModules[ moduleRes ]) {
    //   collectedModules.push(moduleRes);
    // }

    // console.log("WRAPPER: ", moduleRes);
    // console.log("TYPEOF MARKUP: ", typeof moduleRes?.wrapper?.markup === "string");

    // console.log("MODULERES: ", moduleRes, "\n\n");

    return moduleRes;

  }


  function processModule(moduleRes) {

    if(typeof moduleRes?.name === "string" && typeof moduleRes.css === "string") {
      pageRes.name = moduleRes.name;    
    }

    if(typeof moduleRes?.name === "string" && typeof moduleRes.css === "string") {
      pageRes.css[moduleRes.name] = moduleRes.css;    
    }

    if(typeof moduleRes?.name === "string" && typeof moduleRes.script === "object") {
      pageRes.script[moduleRes.name] = moduleRes.script;    
    }

    if(moduleRes?.name === "wrapper" && typeof moduleRes.markup === "string") {
      pageRes.markup = moduleRes.markup;    
    }

  }


  try {
    moduleRes = await addModule(path, { label: "Label for mod 1" }); 
  } catch(err) {
    console.log("moduleCompiler.mjs add module error: ", err);
    return;
  }


  // get the wrapper for the page
  try {
    wrappedRes = await addModule("src/components/wrapper.mjs", { moduleRes });
    //need to add the name to the w
    //I AM HERE
    //DO I NEED TO ADD A NAME REALLY JUST FOR THE MARKUP
    //THE CSS AND JS SHOULD BE UNDER WRAPPER
    processModule(wrappedRes);
  } catch(err) {
    console.log("moduleCompiler.mjs add wrapper error: ", err);
    return;
  }


  console.log("PAGERES: ", pageRes);
  return pageRes;

}
