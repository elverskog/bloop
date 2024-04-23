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


export const page = {

  title: "",
  name: "",
  modulePath: "",  //write files to dirs based off this
  css: [],
  markup: "",
  js: [],
  inits: "",

  addModule: async (modulePath, args) => {

    let module;
    let moduleRes;
    const modulePathRel = modulePath === "/" ? "../../../a" : `../../../${modulePath}`; //handle homepage

    try {
      module = (await import(modulePathRel)).default;    
    } catch (error) {
      throw new Error(`IMPORT MODULE: ${error}`);
    }

    try {
      moduleRes = await module(page, args);
    } catch (error) {
      throw new Error(`RUN MODULE: ${error}`);
    }

    console.log("MODULE RES: ", moduleRes);

    validateArgs([ moduleRes ], [ "object" ]);

    const { name, title, css, markup, js } = moduleRes;

    // validateArgs([ name, title, css, markup, js ], [ "string", "string", "string", "string", "object" ]);

    //add a name for the page if it doesn't exist (use the first module in chains name)
    page.name = page.name.length ? page.name : name;    

    //add a title for the page if it doesn't exist (use the first module in chains title)
    page.title = page.title.length ? page.title : title;    

    // add CSS
    page.css.push({
      name: moduleRes.name,
      modulePath,
      val: moduleRes.css    
    });

    // add inits if js has init function
    if(js) {
      if(typeof js.init === "function") {
        const initArgs = typeof moduleRes.initArgs === "object" ? JSON.stringify(moduleRes.initArgs) : "";
        page.inits += `\n p_p.${moduleRes.name}.init(${initArgs});`; 
      }

      // add JS
      page.js.push({
        name: moduleRes.name,
        modulePath,
        val: convertJsToString(js)
      });
    }

    //add markup here we just use the markup from the last module
    page.markup = markup;

    return page;

  },


  getPage: async () => page,


  buildPage: async function (path, isFetch) {

    validateArgs(arguments, ["string", "boolean"]);

    let moduleRes;

    // I am here
    // can i break this function out
    // likely moving pageRes outside buildPage
    // OR can I funnel it's result into pageRes
    // each time it is called

    moduleRes = await page.addModule(path); 

    //add the title for page's main module (used for setting the page title on frontend)
    page.title = typeof moduleRes?.title === "string" ? moduleRes.title : ""; 

    //add the name for page's main module
    page.name = typeof moduleRes?.name === "string" ? moduleRes.name : "";    

    // get the wrapper for the page
    if (!isFetch) {
      try {
        await page.addModule("src/components/wrapper.mjs", { addModule, moduleRes });
      } catch(err) {
        console.log("buildPage: add wrapper error: ", err);
        return;
      }
    }

    return page;

  }

};
