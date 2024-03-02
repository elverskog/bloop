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

  // console.log("OBJ: ", obj);
  // console.log("OBJ ENTRIES LENGTH: ", Object.keys(obj).length);
  
  for(const [key, val] of Object.entries(jsObjVal)) {
    comma = Object.entries(jsObjVal).length === i ? "" : ","; 
    result += `${ key }: ${ val.toString() }${ comma }\n`;
    i++;
  }
  
  return `{\n\t${result}\n}`;

}


function writeEachJs(page, index) {

  try {
    validateArgs([[page, "object"], [index, "number"]]); 
  } catch (error) {
    throw new Error(error);
  }

  // const jsObj = Object.entries(page.js)[index];
  const jsEntry = Object.entries(page.js)[index];
  // console.log("JSENTRY: ", jsEntry);
  const name = jsEntry[0];
  const jsObj = jsEntry[1];
  // console.log("JSOBJ: ", jsObj);
  const jsVal = jsObj.val;
  const savePath = jsObj.modulePath.replace("src", "dist").replace("components", "js").replace("pages", "js").replace("mjs", "js");
  const inits = page.inits ? page.inits : "";
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

  if (validateObj(Object.entries(page.js)[index][0][1], "object")) {
    writeEachJs(page, index);
  } else {
    //console.log("JS OBJ ERROR: ", page.js[index]);
  }

}


//function to compress and write js files for a full page request///////////////////////////
export function writeJs(page) {

  // console.log("PAGE JS: ", Object.entries(page.js)[0][1]);

  try {
    validateArgs([[page.js, "object"]]); 
  } catch (error) {
    throw new Error(error);
  }
  
  //if we have an "js object" at the current index, try and write it
  //else just exit (doing anything can cause errors in tests)
  if (validateObj(Object.entries(page.js)[0][1], "object")) {
    writeEachJs(page, 0);
  } else {
    throw new Error("writeJS failed: js object not valid at first index");
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


//function to compress and write module ({css, markup,script} passed to browser in one file) //////////////
export function writeModule(page) {

  try {
    validateArgs([
      [page.modulePath, "string"],
      [page.css, "array"],
      [page.markup, "string"],
      [page.js, "object"]
    ]); 
  } catch (error) {
    throw new Error(error);
  }

  const savePath = page.modulePath.replace("src/", "dist/").replace("pages/", "modules/").replace(".mjs", ".json");

  //if in PROD, exit if the file exists (on dev always write the file)
  if(process.env.NODE_ENV === "production" && fs.existsSync(savePath)) return;

  console.log("Page: ", page);
  const pagePathsRemoved = cleanObjects(page, "modulePath");
  console.log("Page: ", pagePathsRemoved);

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
