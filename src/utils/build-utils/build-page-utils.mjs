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


async function addModule(modulePath, args) {

  // console.log("ADDMODULE: ", this, modulePath, args);
  
  let module;
  let moduleRes;
  const modulePathRel = modulePath === "/" ? "../../../a" : `../../../${modulePath}`; //handle homepage

  try {
    module = (await import(modulePathRel)).default;    
  } catch (error) {
    throw new Error(`IMPORT MODULE: ${error}`);
  }

  try {
    moduleRes = await module(args);
  } catch (error) {
    throw new Error(`RUN MODULE: ${error}`);
  }

  // console.log("MODULERES-----------: ", moduleRes);
  
  // validateArgs([ moduleRes ], [ "object" ]);

  const { name, title, css, markup, js } = moduleRes;

  // validateArgs([ name, title, css, markup, js ], [ "string", "string", "string", "string", "object" ]);

  //add a name for the page if it doesn't exist (use the first module in chains name)
  this.modulePath = this.modulePath.length ? this.modulePath : modulePath;    

  // console.log("PAGERES PATH: ", this.modulePath);

  //add a name for the page if it doesn't exist (use the first module in chain)
  this.name = this.name.length ? this.name : name;    

  // console.log("PAGERES NAME: ", this.name);

  //add a title for the page if it doesn't exist (use the first module in chains title)
  this.title = this.title.length ? this.title : title;    

  // add CSS
  this.css.push({
    name: moduleRes.name,
    modulePath,
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
      name: moduleRes.name,
      modulePath,
      val: convertJsToString(js)
    });
  }

  //add markup here we just use the markup from the last module
  this.markup = markup;

  return this;

}


export async function buildPage(path, isFetch) {

  validateArgs(arguments, ["string", "boolean"]);

  console.log("BUILDPAGE: ", this, path, isFetch);

  await this.addModule.call(this, path); 


  // get the wrapper for the page if a fullpage request
  if (!isFetch) {
    console.log("GET WRAPPER");
    try {
      await this.addModule.call(this, "src/components/wrapper.mjs", { moduleRes: this });
    } catch(err) {
      throw new Error(`buildPage: add wrapper error: ${ err }`);
    }
  }
  
  console.log("MOD RES: ", this);
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

  this.buildPage = async function(path, isFetch) {
    await buildPage.call(this, path, isFetch);
  };

  this.addModule = async function(modulePath, args) {
    await addModule.call(this, modulePath, args);
  };
}

