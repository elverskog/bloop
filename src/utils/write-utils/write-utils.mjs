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

  if(savePath.indexOf("wrapper.js") > -1) {
    // console.log("SAVEPATH: ", savePath);
    // console.log("VAL: ", val);
  }

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


function writeEachJs(pageJs, index) {

  const jsObj = pageJs[index];
  // console.log("JS OBJ: ", jsObj);
  
  const savePath = jsObj.modulePath.replace("src", "dist").replace("components", "js").replace("pages", "js").replace("mjs", "js");
  const scriptsAsString = convertFuncsToStrings(jsObj.val);
  let scriptResAll;


  if (typeof scriptsAsString === "string" && typeof savePath === "string") {
    scriptResAll = `window.p_p.${jsObj.name} = \n${scriptsAsString}\n`;
    write2(scriptResAll, savePath);
  } else {
    throw new Error("writeJS failed because scriptResAll or savePath invalid");
  }
  
  index++;

  if (validateObj(pageJs[index], "object")) {
    writeEachJs(pageJs, index);
  } else {
    console.log("JS OBJ: ", pageJs[ index.js ]);
  }

}



//function to compress and write js files for a full page request///////////////////////////
export function writeJs(page) {

  try {
    validateArgs([[page.js, "array"]]); 
  } catch (error) {
    throw new Error(error);
  }
  
  //if we have an "js object" at the current index, try and write it
  //else just exit (doing anything can cause errors in tests)
  if (validateObj(page.js[0], "object")) {
    // writeEachJs(page.js[index]);
    writeEachJs(page.js, 0);
  } else {
    throw new Error("writeJS failed: js object not valid at first index");
  }

  return true;

}


// //function to create a specific js file to fire init functions for modules that have them
// export function writeJsInits(page) {

//   try {
//     validateArgs([[page.js, "array"]]); 
//   } catch (error) {
//     throw new Error(error);
//   }


//   //if it has been added, still add any init functions (for event listeners for repeated modules etc)
//   if(typeof moduleResult.script === "object") {

//     //don't add script if it's module (by key/name) doesn't exist in this.hopper already
//     if(typeof this.hopper.script[moduleName] === "undefined") {

//       //loop through scripts and add a stringified function in the script object, for the given key
//       let scripts = "";
            
//       for(const [key, val] of Object.entries(moduleResult.script)) {
//         scripts += `${key}: ${val.toString()},\n`;
//       }

//       //assign the result to a var (for now) so we can access it
//       //for now the variable (when loaded in browser) adds that var to window
//       scriptResAll = `window.p_p.${moduleName} = {\n${scripts}\n}`;

//     }

//     //even if (main) script for the module was already added,
//     //add call to init function if a function named init exists (add initArgs if also declared in moduleResult) 
//     if(typeof moduleResult.script.init ==="function") {
//       const initArgs = typeof moduleResult.initArgs === "object" ? JSON.stringify(moduleResult.initArgs) : "";
//       scriptResAll += `\n p_p.${moduleName}.init(${initArgs});` 
//     }

//     //minify (remove breaks etc) the JS before we write it to file, if in prod  
//     if(typeof scriptResAll === "string" && process.env.NODE_ENV === "production") {
//       const minifiedScriptResAll = UglifyJS.minify(scriptResAll);
//       if(typeof minifiedScriptResAll.code === "string") {
//         scriptResAll = minifiedScriptResAll.code;
//       } else {
//         console.log("JS minified error", moduleName, "\n", minifiedScriptResAll.error);
//         console.log("JS minified error", moduleName, "\n", scriptResAll);
//       }
//     }

//     //add script to this.hopper
//     if(typeof scriptResAll === "string") {
//       //if the node/key exists, add to it, else create it  
//       if(typeof this.hopper.script[moduleName] === "string") {
//         this.hopper.script[moduleName] += scriptResAll;
//       } else {
//         this.hopper.script[moduleName] = scriptResAll;
//       }
//     }



// }


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
      [page.js, "array"]
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
