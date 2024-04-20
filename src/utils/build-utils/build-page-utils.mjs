import { validateArgs } from "../validation-utils.mjs";

//function to add module to a dictionary/object of results
//it  used in the buildPage function
// and also needs to be passed down the "chain" of module thay might compre a page


//converts { init: [Function: init], ...etc } to an object where "Function: init" is a string
function convertJsToString(jsObjVal) {

  let resultInner = "";
  let result = "";

  for(const [key, val, index] of Object.entries(jsObjVal)) {
    const comma = (index !== Object.entries.length - 1) ? ",\n" : "\n";
    resultInner += `${ key }: ${ val.toString() }${ comma }`; 
  }

  result = `\n{ ${ resultInner } \n}`; 

  return result;

}


//check if imported module
//returns an object
//returns "name" as a string 
//returns "css" as a string 
//returns "markup" as a string 
//if returns "title" it should be an string
//if returns "js" it should be an object
//if returns "initArgs" it should be an object
export function validateModuleRes(moduleRes) {
  if (typeof moduleRes !== "object") {
    throw new Error("moduleRes is not an object");
  }
  if (typeof moduleRes.name !== "string") {
    throw new Error("moduleRes.name is not a string");
  }
  if (typeof moduleRes.css !== "string") {
    throw new Error(`${ moduleRes.name }: moduleRes.css is not a string`);
  }
  if (typeof moduleRes.markup !== "string") {
    throw new Error(`${ moduleRes.name }: moduleRes.markup is not a string`);
  }
  if (moduleRes.title && typeof moduleRes.title !== "string") {
    throw new Error(`${ moduleRes.name }: moduleRes.title is not a string`);
  }
  if (moduleRes.js && typeof moduleRes.js !== "object") {
    throw new Error(`${ moduleRes.name }: moduleRes.js is not an object`);
  }
  if (moduleRes.initArgs && typeof moduleRes.initArgs !== "object") {
    throw new Error(`${ moduleRes.name }: moduleRes.initArgs is not an object`);
  }
  return true;
}



export async function buildPage(path, isFetch, isProd) {

  validateArgs(arguments, ["string", "boolean", "boolean"]);

  let moduleRes;
  const pageRes = {
    title: "",
    name: "",
    modulePath: path,  //add the pathname into the page output. Need to know where to write dt files
    css: [],
    markup: "",
    js: [],
    inits: ""
  };


  // I am here
  // can i break this function out
  // likely moving pageRes outside buildPage
  // OR can I funnel it's result into pageRes
  // each time it is called


  async function addModule(modulePath, args) {

    console.log("ADD MODULE: ", modulePath);

    const path = modulePath === "/" ? "/a" : modulePath;
    //if for build, just use what was passed in, else need to construct the full path from URL  
    const adjustedPath = isProd ? `../../../${path}` : `../../src/pages${path}.mjs`;

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
      throw new Error(`RUN MODULE: ${error}`);
    }

    (args => validateArgs(args, [ "object" ]))(moduleRes);

    const { name, title, css, js, markup } = moduleRes;

    (args => {
      validateArgs(args, [ "string", "string", "string", "string", "object"  ]);
    })(name, title, css, js, markup);

    //add a name for the page if it doesn't ext
    pageRes.name = pageRes.name.length ? pageRes.name : name;    

    //add a title for the page if it doesn't ext
    pageRes.title = pageRes.title.length ? pageRes.title : title;    

    // add CSS
    pageRes.css.push({
      name: moduleRes.name,
      modulePath,
      val: moduleRes.css    
    });

    // add inits if js has init function
    if(typeof js.init === "function") {
      const initArgs = typeof initArgs === "object" ? JSON.stringify(moduleRes.initArgs) : "";
      pageRes.inits += `\n p_p.${moduleRes.name}.init(${initArgs});`; 
    }

    // add JS
    pageRes.js.push({
      name: moduleRes.name,
      modulePath,
      val: convertJsToString(js)
    });

    //add markup here we just use the markup from the last module
    pageRes.markup = markup;

    return pageRes;

  }


  try {

    moduleRes = await addModule(path, { addModule }); 

    //add the title for page's main module (used for setting the page title on frontend)
    pageRes.title = typeof moduleRes?.title === "string" ? moduleRes.title : ""; 

    //add the name for page's main module
    pageRes.name = typeof moduleRes?.name === "string" ? moduleRes.name : "";    

  } catch(error) {
    // console.log("buildPage: add module error: ", err);
    // return;
    throw new Error(error);
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
