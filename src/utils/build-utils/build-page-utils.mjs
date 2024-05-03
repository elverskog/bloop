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


async function addModule(data, args) {

  // console.log("ADDMODULE PATH: ", modulePath);
  // console.log("ADDMODULE ARGS: ", args);

  validateArgs(arguments, ["object", "~object"]);
 
  if(data.template !== "string") {
    throw new Error("addModule passed data without template path");
  }

  let module;
  let moduleRes;

  try {
    module = (await import(`../../../${ data.template }.mjs`)).default;    
  } catch (error) {
    throw new Error(`IMPORT MODULE: ${error}`);
  }

  try {
    moduleRes = await module.call(this, data);
  } catch (error) {
    throw new Error(`RUN MODULE: ${error}`);
  }

  
  validateArgs([ moduleRes ], [ "object" ]);

  const { css, markup, js } = moduleRes;

  // validateArgs([ name, title, css, markup, js ], [ "string", "string", "string", "string", "object" ]);

  //add a path for the page if it doesn't exist (e.g. use the first module in chains name)
  //we use this as the save location
  this.modulePath = this.modulePath.length ? this.modulePath : data.name;    

  //add a name for the page if it doesn't exist (e.g. use the first module in chain)
  this.name = this.name.length ? this.name : data.name; 

  //add a title for the page if it doesn't exist (e.g. use the first module in chains title)
  this.title = this.title.length ? this.title : data.title;    

  // add CSS
  this.css.push({
    name: data.name,
    modulePath: this.modulePath,
    val: css    
  });

  // add inits if js has init function
  if(js) {

    if(typeof js.init === "function") {
      const initArgs = typeof moduleRes.initArgs === "object" ? JSON.stringify(moduleRes.initArgs) : "";
      this.inits += `\n p_p.${moduleRes.name}.init(${initArgs});`; 
    }

    // add JS
    this.js.push({
      name: data.name,
      modulePath: this.modulePath,
      val: convertJsToString(js)
    });

  }

  //add markup here we just use the markup from the last module
  this.markup = markup;

  return this;

}


export async function buildPage(pageData, isFetch, args) {

  validateArgs(arguments, ["object", "boolean", "~object"]);

  await this.addModule.call(this, pageData, args); 

  // get the wrapper for the page if a fullpage request
  if (!isFetch) {
    await this.addModule.call(this, { template: "src/components/wrapper.mjs" }, { moduleRes: this });
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

  this.buildPage = async function(pageData, isFetch, args) {
    return await buildPage.call(this, pageData, isFetch, args);
  };

  this.addModule = async function(modulePath, args) {
    return await addModule.call(this, modulePath, args);
  };

}

