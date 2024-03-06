import { validateArgs } from "./validation-utils.mjs";

//function to add module to a dictionary/object of results
//it is used in the buildPage function
// and also needs to be passed down the "chain" of module thay might comprise a page


export async function buildPage(options) {

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
    title: "",
    name: "",
    modulePath: path,  //add the pathname into the page output. Need to know where to write dist files
    css: [],
    markup: "",
    js: [],
    inits: ""
  };


  async function addModule(modulePath, args) {

    const path = modulePath === "/" ? "/a" : modulePath;
    //if for build, just use what was passed in, else need to construct the full path from URL  
    const adjustedPath = isBuild ? `../../${path}` : `../src/pages${path}.mjs`;

    let module;
    let moduleRes;

    try {
      module = (await import(adjustedPath)).default;    
    } catch (error) {
      throw new Error(`IMPORT MODULE: ${error}`);
    }

    try {
      moduleRes = await module(addModule, args);
    } catch (error) {
      console.log("RUN MODULE ERROR: ", error);
    }

    //add a title for the page if it doesn't exist
    if(typeof moduleRes?.title === "string" && !pageRes.title.length) {
      pageRes.title = moduleRes.title;    
    }

    //add a name for the page if it doesn't exist
    if(typeof moduleRes?.name === "string" && !pageRes.name.length) {
      pageRes.name = moduleRes.name;    
    }

    // add CSS
    if(typeof moduleRes?.name === "string" && typeof moduleRes.css === "string") {
      pageRes.css.push({
        name: moduleRes.name,
        modulePath,
        val: moduleRes.css    
      });
    }

    // add JS
    if(typeof moduleRes?.name === "string" && typeof moduleRes.js === "object") {
      
      if(typeof moduleRes.js.init === "function" && typeof moduleRes.name === "string") {
        const initArgs = typeof moduleRes.initArgs === "object" ? JSON.stringify(moduleRes.initArgs) : "";
        pageRes.inits += `\n p_p.${moduleRes.name}.init(${initArgs});`; 
      }

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

    return pageRes;

  }


  try {

    moduleRes = await addModule(path, { addModule }); 

    //add the title for page's main module (used for setting the page title on frontend)
    pageRes.title = typeof moduleRes?.title === "string" ? moduleRes.title : ""; 

    //add the name for page's main module
    pageRes.name = typeof moduleRes?.name === "string" ? moduleRes.name : "";    

  } catch(err) {
    console.log("buildPage: add module error: ", err);
    return;
  }


  // get the wrapper for the page
  if (!isFetch) {
    try {
      await addModule("src/components/wrapper.mjs", { addModule, moduleRes });
    } catch(err) {
      console.log("buildPage: add wrapper error: ", err);
      return;
    }
  }

  return pageRes;

}
