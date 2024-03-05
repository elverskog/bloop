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


function write2(val, savePath) {

  try {
    validateArgs([ [ val, "string" ], [ savePath, "string" ] ]); 
  } catch (error) {
    throw new Error(error);
  }

  let buff;
  let compressed;
  let dirPath;

  //if in PROD, exit if the file exists. on dev always write the file
  if(process.env.NODE_ENV === "production" && fs.existsSync(path)) return;

  //if the dirs in the path doesn't exist create them (cut the filename off the end)
  dirPath = savePath.split("/").slice(0, -1).join("/").toString();

  if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  buff = Buffer.from(val, "utf-8");
  
  try {
    compressed = brotli.compress(buff, brotliSettings);
  } catch (error) {
    throw new Error(`COMPRESS FAILED: ${error}`);
  }

  try {
    // fs.writeFileSync(savePath, compressed);
    // console.log("PATH: ", path);
    fs.writeFileSync(savePath, val);
  } catch (error) {
    throw new Error(`WRITE FAILED: ${error}`);
  }

  return true;

}


//function to compress and write css files for a full page request
export function writeCss(page) {

  let index = 0;

  try {
    validateArgs([[page.css, "array"]]); 
  } catch (error) {
    throw new Error(error);
  }

  function writeEach() {
  
    const cssObj = page.css[index];
    const val = cssObj.val;
    const savePath = cssObj.modulePath
      .replace("src", "dist")
      .replace("pages", "css")
      .replace("components", "css")
      .replace("mjs", "css");

    write2(val, savePath);
    index++;
  
    //recurse on current function (writeEach)
    if(page.css[index]) {

      if (validateObj(page.css[index], "string")) {
        writeEach();
      } else {
        throw new Error("writePage in write - modulePath or val is not a string");
      }

    }

  }

  if (validateObj(page.css[index], "string")) {
    writeEach();
  } else {
    throw new Error("writePage outer - modulePath or val is not a string");
  }

  return true;

}


//this converts { init: [Function: init], ...etc } to an object where "Function: init" is a string
function convertFuncsToStrings(jsObjVal) {

  let result = "";
  let comma;
  let i = 1;

  for(const [key, val] of Object.entries(jsObjVal)) {
    comma = Object.entries(jsObjVal).length === i ? "" : ","; 
    result += `${ key }: ${ val.toString() }${ comma }\n`;
    i++;
  }
  
  return `{\n\t${result}\n}`;

}


//function to process/write a file for each module used for a given page
//it calls itself until it runs out of objects in the array page.js ///////////////////////////
function writeEachJs(page, index) {

  try {
    validateArgs([[page.js, "array"], [index, "number"]]); 
  } catch (error) {
    throw new Error(error);
  }

  // if (index === 0) {
  //   console.log("MODULE NAME: ", page.js[index].name);
  //   console.log("PAGE INITS: ", page.inits);   
  // }

  const jsObj = page.js[index];
  const name = jsObj.name;
  const jsVal = jsObj.val;
  const savePath = jsObj.modulePath.replace("src", "dist").replace("components", "js").replace("pages", "js").replace("mjs", "js");
  //only add inits (to add listeners for example) if we are creating the main js file
  const inits = (index === 0 && page.inits) ? page.inits : "";
  let scriptsAsString = convertFuncsToStrings(jsVal);
  let scriptWithWindow = "";

  if (typeof scriptsAsString === "string" && typeof name === "string") {
    scriptWithWindow += `window.p_p.${jsObj.name} = \n${scriptsAsString}\n`;
  } else {
    throw new Error("1. writeJS failed because scriptAsString or savePath invalid");
  }

  //if we are the first element, as it is the main js for the page,
  //check for inits in page and add them to the end of said js file
  scriptWithWindow += inits;

  if (typeof scriptsAsString === "string" && typeof savePath === "string") {
    write2(scriptWithWindow, savePath);
  } else {
    throw new Error("2. writeJS failed because scriptResAll or savePath invalid");
  }
  
  index++;

  if (validateObj(page.js[index], "object")) {
    writeEachJs(page, index);
  } else {
    //console.log("JS OBJ ERROR: ", page.js[index]);
  }

}


//function to compress and write js files for a full page request///////////////////////////
export function writeJs(page) {

  console.log("PAGE: ", page);

  try {
    validateArgs([[page.js, "object"]]); 
  } catch (error) {
    throw new Error(error);
  }
  
  //if we have an "js object" at the current index, try and write it
  //else just exit (doing anything can cause errors in tests)
  if (validateObj(page.js[0], "object")) {
    writeEachJs(page, 0);
  }

  return true;

}


//function to compress and write markup files for a full page request /////////////////////////////////////////
export function writeMarkup(page) {

  try {
    validateArgs([[page.modulePath, "string"], [page.markup, "string"]]); 
  } catch (error) {
    throw new Error(error);
  }

  const savePath = page.modulePath.replace("src/", "dist/").replace("pages/", "markup/").replace(".mjs", ".html");

  //if in PROD, exit if the file exists (on dev always write the file)
  if(process.env.NODE_ENV === "production" && fs.existsSync(savePath)) return;

  return write2(page.markup, savePath);

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
    css: cleanObjects(page.css, key),
    markup: page.markup,
    js: cleanObjects(page.js, key)
  };
}


//function to compress and write module ({css, markup,script} passed to browser in one file) //////////////
export function writeModule(page) {

  try {
    validateArgs([
      [page.modulePath, "string"],
      [page.css, "array"],
      [page.markup, "string"],
      [page.js, "array"]
    ]); 
  } catch (error) {
    throw new Error(error);
  }

  const savePath = page.modulePath.replace("src/", "dist/").replace("pages/", "modules/").replace(".mjs", ".json");

  //if in PROD, exit if the file exists (on dev always write the file)
  if(process.env.NODE_ENV === "production" && fs.existsSync(savePath)) return;

  delete page.inits;

  // console.log("Page: ", page);
  const pagePathsRemoved = cleanPage(page, "modulePath");
  // console.log("Page: ", pagePathsRemoved);
  const jsFuncsToStrings = [];

  pagePathsRemoved.js.forEach( mod => {
    jsFuncsToStrings.push(convertFuncsToStrings(mod.val));
  });

  pagePathsRemoved.js = JSON.stringify(jsFuncsToStrings);

  return write2(JSON.stringify(pagePathsRemoved), savePath);

}


// //function to compress and write module results ({css, markup,script})
// export function writeModuleResult(modulePath, content) {

//   if(typeof modulePath === "string" && typeof content === "string") {

//     //change path of module to that of where we should store the page in /dist
//     const pagePath = modulePath.replace("src", "dist").replace("pages", "modules-res").replace("mjs", "json");

//     //if in PROD, exit if the file exists (on dev always write the file)
//     if(process.env.NODE_ENV === "production" && fs.existsSync(pagePath)) return;

//     //if the dirs in the path don't exist create them
//     const pageDirPath = pagePath.split("/").slice(0, -1).join("/").toString();

//     if(!fs.existsSync(pageDirPath)) {
//       fs.mkdirSync(pageDirPath, { recursive: true });
//     }

//     //brotli compress the string
//     const buff = Buffer.from(content, "utf-8");
//     const compressed = brotli.compress(buff, brotliSettings);
//     //const compressed = content;

//     fs.writeFileSync(pagePath, compressed);

//   } else {
//     console.log("compressAndWrite passed invalid module output", modulePath);
//   }

// }
