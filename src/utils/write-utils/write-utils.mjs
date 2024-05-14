import fs from "fs-extra";
import brotli from "brotli";
import path from "path";
import { validateArgs } from "../validation-utils.mjs";
// import { utilBaseDir } from "./utils/dir-utils/dir-utils.mjs";


//settings for brotli compression - TODO adjust these settings
const brotliSettings = {
  extension: "css",
  skipLarger: true,
  mode: 1, // 0 = generic, 1 = text, 2 = font (WOFF2)
  quality: 10, // 0 - 11,
  lgwin: 12 // default
};


function validateObj(obj, valType) {
  return (obj && typeof obj.modulePath === "string" && typeof obj.val === valType); 
}


export function write(val, savePath, compress) {

  validateArgs(arguments, ["string", "string", "boolean"]); 

  let text = val;
  let buff;
  let compressed;
  let dirPath;

  //if in PROD, exit if the file exists. on dev always write the file
  if(process.env.NODE_ENV === "production" && fs.existsSync(path)) return;

  //if the dirs in the path doesn't exist create them (cut the filename off the end)
  dirPath = savePath.split("/").slice(0, -1).join("/").toString();

  // console.log("SAVEPATH: ", savePath);
  // console.log("DIRPATH: ", dirPath);
  // console.log("VAL: ", val.slice(0, 20));

  if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  buff = Buffer.from(val, "utf-8");
 
  if (compress) {
    try {
      text = brotli.compress(buff, brotliSettings);
    } catch (error) {
      throw new Error(`COMPRESS FAILED: ${error}`);
    }
  }

  try {
    fs.writeFileSync(savePath, text);
  } catch (error) {
    throw new Error(`WRITE FAILED: ${error}`);
  }

  return true;

}



function writeEachCss(cssObj, compress) {

  validateArgs(arguments, ["object", "boolean"]); 

  (function() {
    validateArgs(arguments, ["string", "string"]); 
  })(cssObj.val, cssObj.modulePath);

  const val = cssObj.val;

  const savePath = `dist/css/${ cssObj.modulePath.replace("mjs", "css") }`;

  // console.log("WRITEEACHCSS SAVEPATH: ", savePath);

  // const savePath = cssObj.modulePath
  //   .replace("src", "dist")
  //   .replace("pages", "css")
  //   .replace("components", "css")
  //   .replace("mjs", "css");

  write(val, savePath, compress);

}


//function to compress and write css files for a full page request
export function writeCss(page, compress = false) {

  validateArgs(arguments, ["object"]); 

  (function() {
    validateArgs(arguments, ["array"]); 
  })(page.css);

  page.css.forEach(cssObj => {
    writeEachCss(cssObj, compress);
  });

  return true;

}


//function to process/write a file for each module used for a given page
//it calls itself until it runs out of objects in the array page.js ///////////////////////////
function writeEachJs(page, index, compress) {

  validateArgs(arguments, ["object", "number", "boolean"]); 

  const jsObj = page.js[index];
  const name = jsObj.name;
  const jsVal = jsObj.val;
  // const savePath = jsObj.modulePath.replace("src", "dist").replace("components", "js").replace("pages", "js").replace("mjs", "js");


  const savePath = `dist/js/${ jsObj.modulePath.replace("mjs", "js")}`;

  let scriptWithWindow = "";

  if (typeof jsVal === "string" && typeof name === "string") {
    scriptWithWindow += `window.p_p.${jsObj.name} = \n${jsVal}\n`;
  } else {
    throw new Error("1. writeJS failed because scriptAsString or savePath invalid");
  }

  //if we are the first element, as it is the main js for the page,
  //check for inits in page and add them to the end of said js file
  //only add inits (to add listeners for example) if we are creating the main js file
  const inits = (index === 0 && page.inits) ? page.inits : "";
  scriptWithWindow += inits;

  // console.log("INDEX: ", index);
  // console.log("INITS: ", inits);

  if (typeof scriptWithWindow === "string" && typeof savePath === "string") {
    // if(index === 0 || index === 1) {
    // // if(savePath === "dist/js/page-standard.js") {
    //   console.log("PAGE JS SAVEPATH", savePath);
    //   console.log("SCRIPT", scriptWithWindow);
    // }
    write(scriptWithWindow, savePath, compress);
  } else {
    throw new Error("writeJs passed invalid page object");
  }
  
  index++;

  //iterate on this function if there is a next js "object"
  if (validateObj(page.js[index], "string")) {
    writeEachJs(page, index, compress);
  }

}


//function to compress and write js files for a full page request///////////////////////////
export function writeJs(page, compress = false) {

  // console.log("WRITEJS: ", page.js);  

  validateArgs(arguments, ["object"]); 
  (function () { 
    validateArgs(arguments, ["array"]); 
  })(page.js); 

  //if we have an "js object" at the current index, try and write it
  //else just exit (doing anything can cause errors in tests)
  if (validateObj(page.js[0], "string")) {
    writeEachJs(page, 0, compress);
  } else {
    throw new Error("writeJs passed invalid page object");
  } 

  return true;

}


//function to compress and write markup files for a full page request /////////////////////////////////////////
export function writeMarkup(page, compress = false) {

  // console.log("MODULEPATH: ", page.modulePath);
  // console.log("WRITE MARKUP: ", page.markup);

  validateArgs(arguments, ["object"]); 
  validateArgs([ page.modulePath, page.markup ], ["string", "string"]); 

  // const savePath = page.modulePath.replace("src/", "dist/").replace("components/", "markup/").replace(".mjs", ".html");
  const savePath = `dist/markup/${ page.modulePath }.html`;

  // console.log("SAVEPATH: ", savePath);

  //if in PROD, exit if the file exists (on dev always write the file)
  if(process.env.NODE_ENV === "production" && fs.existsSync(savePath)) return;

  return write(page.markup, savePath, compress);

  // return true;

}


function cleanObjects(arrayOfObjects, key) {
  return arrayOfObjects.map( obj => {
    const cleanedObj = { ...obj };
    delete cleanedObj[ key ];
    return cleanedObj;
  });
}


function cleanPage(page, key) {
  return {
    title: page.title,
    css: cleanObjects(page.css, key),
    markup: page.markup,
    js: cleanObjects(page.js, key)
  };
}


//function to compress and write module ({css, markup,script} passed to browser in one file) //////////////
export function writeModule(page, compress = false) {

  (function() {
    validateArgs(arguments, ["string", "string", "array", "string", "array"]);
  })(page.title, page.modulePath, page.css, page.markup, page.js);

  // const savePath = page.modulePath.replace("src/", "dist/").replace("pages/", "modules/").replace(".mjs", ".json");

  const savePath = `dist/modules/${ page.modulePath }.json`;

  //if in PROD, exit if the file exists (on dev always write the file)
  if(process.env.NODE_ENV === "production" && fs.existsSync(savePath)) return;

  delete page.inits;

  const pagePathsRemoved = cleanPage(page, "modulePath");

  return write(JSON.stringify(pagePathsRemoved), savePath, compress);

}
