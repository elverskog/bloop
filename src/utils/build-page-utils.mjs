import { validateArgs } from "./validation-utils.mjs";

//function to add module to a dictionary/object of results
//it is used in the buildPage function
// and also needs to be passed down the "chain" of module thay might comprise a page


export async function buildPage(options) {

  console.log("BUILDPAGE - OPTIONS: ", options);

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
  const pageRes = {
    modulePath: path,  //add the pathname into the page output. Need to know where to write dist files
    name: "",
    css: [],
    markup: "",
    js: [],
  };


  async function addModule(modulePath, args) {

    // console.log("ADD MODULE: ", modulePath, "\n", args);
    // console.log("ADD MODULE: ", modulePath)

    const path = modulePath === "/" ? "/a" : modulePath;
    //if for build, just use what was passed in, else need to construct the full path from URL  
    const adjustedPath = isBuild ? `../../${path}` : `../src/pages${path}.mjs`;

    let module;
    let moduleRes;

    try {
      module = (await import(adjustedPath)).default;    
    } catch (error) {
      // console.log("IMPORT MODULE ERROR: ", error);
      throw new Error(`IMPORT MODULE: ${error}`);
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


    // console.log("PROCESSMODULE: ", moduleRes?.name);

    if(typeof moduleRes?.name === "string" && typeof moduleRes.css === "string") {
      pageRes.css.push({
        name: moduleRes.name,
        modulePath,
        val: moduleRes.css    
      });
    }

    if(typeof moduleRes?.name === "string" && typeof moduleRes.js === "object") {
      // pageRes.script[moduleRes.name] = moduleRes.script;    
      pageRes.js.push({
        name: moduleRes.name,
        modulePath,
        val: moduleRes.js    
      });
    }

    if(typeof moduleRes?.name === "string" && typeof moduleRes.markup === "string") {
      // pageRes.script[moduleRes.name] = moduleRes.script;    
      pageRes.markup = moduleRes.markup;
    }


    // if(moduleRes?.name === "wrapper" && typeof moduleRes.markup === "string") {
    //   pageRes.markup = moduleRes.markup;    
    // }

    return pageRes;

  }


  try {

    moduleRes = await addModule(path, { addModule, label: "Label for mod 1" }); 

    // console.log("MODULERES: ", moduleRes);

    //add the name for page's main module
    if(typeof moduleRes?.name === "string") {
      pageRes.name = moduleRes.name;    
    }

  } catch(err) {
    console.log("buildPage: add module error: ", err);
    return;
  }


  // get the wrapper for the page
  try {
    await addModule("src/components/wrapper.mjs", { addModule, moduleRes });
  } catch(err) {
    console.log("buildPage: add wrapper error: ", err);
    return;
  }


  // console.log("PAGERES: ", pageRes);
  return pageRes;

}
