import { validateArgs } from "../validation-utils.mjs";

//functions to add module to a dictionary/object of results
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


async function addModule(modulePath, data, args) {

  //note: "this" here is the master object of all the modules for the page

  const modulePathClean = modulePath.replace("src/", "").replace("components/", "");
  // console.log("PAGE/THIS CSS LENGTH: ", this.css.length);
  // console.log("ADDMODULE ARGUMENTS: ", arguments);
  // console.log("ADDMODULE: ", modulePath, data, args);

  validateArgs(arguments, ["string", "~object", "~object"]);

  let module;
  let moduleRes;

  try {
    module = (await import(`../../../${ modulePath }`)).default;    
  } catch (error) {
    throw new Error(`IMPORT MODULE: ${error}`);
  }

  try {
    moduleRes = await module.call(this, data, args);
  } catch (error) {
    throw new Error(`RUN MODULE: ${error}`);
  }
  
  validateArgs([ moduleRes ], [ "object" ]);

  // console.log("MODULE RES: ", moduleRes);

  // validateArgs([ moduleRes.name, moduleRes.css, moduleRes.markup, moduleRes.js ], [ "string", "~string", "~string", "~string", "~object" ]);

  //add a path for the page if it doesn't exist (e.g. use the first module in chains name)
  //we use this as the save location
  if(data?.category && data?.name) {
    // console.log("THIS MOD PATH: ", this.modulePath, this.modulePath.length);
    // console.log("PASSED MOD PATH: ", modulePath);
    this.modulePath = data.category.join("/") + "/" + data.name;    
  }

  //if data.name exists, assume this is a page level module and use it as the page name
  if(data?.name) {
    this.name = data.name; 
  }

  //if data.name exists, assume this is a page level module and use it as the page name
  if(data?.category) {
    this.category = data.category; 
  }

  //add a title for the page if it doesn't exist (e.g. use the first module in chains title)
  if(data?.title) {
    this.title = data.title;    
  }

  // add CSS
  if(typeof moduleRes.css === "string") {
    this.css.push({
      name: moduleRes.name,
      modulePath: modulePathClean,
      val: moduleRes.css    
    });
  }

  // add inits if js has init function
  if(typeof moduleRes.js === "object") {

    const js = moduleRes.js;

    if(typeof js.init === "function") {
      const initArgs = typeof moduleRes.initArgs === "object" ? JSON.stringify(moduleRes.initArgs) : "";
      this.inits += `\n p_p.${moduleRes.name}.init(${initArgs});`; 
    }

    // add JS
    this.js.push({
      name: moduleRes.name,
      modulePath: modulePathClean,
      val: convertJsToString(js)
    });

  }

  //add markup here we just use the markup from the last module
  if(typeof moduleRes.markup === "string") {
    this.markup = moduleRes.markup;
  }

  return this;

}


export async function buildPage(template, pageData, isFetch, args) {

  // console.log("BUILDPAGE: ", pageData);

  validateArgs(arguments, ["string", "object", "boolean", "~object"]);

  await this.addModule.call(this, template, pageData, args); 

  // get the wrapper for the page if a fullpage request
  if (!isFetch) {
    await this.addModule.call(this, "src/components/wrapper.mjs");
  }

  return this;

}


export function page() {

  this.title = "";
  this.name = "";
  this.modulePath = "";  //write files to dirs based off this
  this.css = [];
  this.markup = "";
  this.js = [];
  this.inits = "";

  this.buildPage = async function(template, pageData, isFetch, args) {
    return await buildPage.call(this, template, pageData, isFetch, args);
  };

  this.addModule = async function(modulePath, pageData, args) {
    return await addModule.call(this, modulePath, pageData, args);
  };

}


