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


//brotli compress the recieved string/content and write to the received path
//NOTE: side effects occur here
function write(content, path) {

  // console.log("CONTENT: ", content);
  // console.log("PATH: ", path);

  try {
    validateArgs([[content, "string"], [path, "string"]]); 
  } catch (error) {
    throw new Error(error);
  }

  let buff;
  let compressed;
  let dirPath;

  //if in PROD, exit if the file exists. on dev always write the file
  if(process.env.NODE_ENV === "production" && fs.existsSync(path)) return;

  //if the dirs in the path doesn't exist create them (cut the filename off the end)
  dirPath = path.split("/").slice(0, -1).join("/").toString();

  if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  buff = Buffer.from(content, "utf-8");
  
  try {
    compressed = brotli.compress(buff, brotliSettings);
  } catch (error) {
    throw new Error(`COMPRESS FAILED: ${error}`);
  }

  try {
    fs.writeFileSync(path, compressed);
  } catch (error) {
    throw new Error(`WRITE FAILED: ${error}`);
  }

  return true;

}



//function to compress and write css files for a full page request
export function writeCss(page) {

  let path;
  let index = 0;

  try {
    validateArgs([[page.css, "array"]]); 
  } catch (error) {
    throw new Error(error);
  }

  function filterObjs(cssObj) {
    return (cssObj && typeof cssObj.modulePath === "string" && typeof cssObj.val === "string"); 
  }

  function writeEach() {
   
    const cssObj = page.css[index];

    if(cssObj.modulePath.indexOf("src/") > -1 && cssObj.modulePath.indexOf(".mjs") > -1) {
      path = cssObj.modulePath.replace("src", "dist").replace("components", "css").replace("mjs", "css");
    } else {
      throw new Error("writePage - page.modulePath is missing src or mjs");
    }

    write(cssObj.val, path);
    index++;
   
    if(page.css[index]) {

      if (filterObjs(page.css[index])) {
        writeEach();
      } else {
        throw new Error("writePage in write - modulePath or val is not a string");
      }

    }

  }

  if (filterObjs(page.css[index])) {
    writeEach();
  } else {
    throw new Error("writePage outer - modulePath or val is not a string");
  }

  return true;

}


//function to compress and write js files for a full page request
export function writeJs(page) {

  let path;
  let index = 0;

  try {
    validateArgs([[page.js, "array"]]); 
  } catch (error) {
    throw new Error(error);
  }

  function filterObjs(jsObj) {
    return (jsObj && typeof jsObj.modulePath === "string" && typeof jsObj.val === "string"); 
  }

  function writeEach() {
   
    const jsObj = page.js[index];

    if(jsObj.modulePath.indexOf("src/") > -1 && jsObj.modulePath.indexOf(".mjs") > -1) {
      path = jsObj.modulePath.replace("src", "dist").replace("components", "js").replace("mjs", "js");
    } else {
      throw new Error("writePage - page.modulePath is missing src or mjs");
    }

    write(jsObj.val, path);
    index++;
   
    if(page.js[index]) {

      if (filterObjs(page.js[index])) {
        writeEach();
      } else {
        throw new Error("writePage in write - modulePath or val is not a string");
      }

    }

  }

  if (filterObjs(page.js[index])) {
    writeEach();
  } else {
    throw new Error("writePage outer - modulePath or val is not a string");
  }

  return true;

}



//function to compress and write markup files for a full page request
export function writeMarkup(page) {

  let savePath;

  try {
    validateArgs([[page.modulePath, "string"], [page.markup, "string"]]); 
  } catch (error) {
    throw new Error(error);
  }

  if(typeof page.modulePath === "string" && page.modulePath.indexOf("src/") > -1 && page.modulePath.indexOf(".mjs") > -1) {
    //change path of module to that of where we should store the page in /dist
    savePath = page.modulePath.replace("src", "dist").replace("mjs", "html");
  } else {
    throw new Error("writePage: page.modulePath not a string or is otherwise invalid");
  }

  //if in PROD, exit if the file exists (on dev always write the file)
  if(process.env.NODE_ENV === "production" && fs.existsSync(savePath)) return;

  const saveDirPath = savePath.split("/").slice(0, -1).join("/").toString();

  // console.log("SAVE DIR PATH: ", saveDirPath);
  
  //if the dirs in the path don't exist create them
  if(!fs.existsSync(saveDirPath)) {
    fs.mkdirSync(saveDirPath, { recursive: true });
  }

  write(page.markup, savePath);

  return true;

}


//function to compress and write module results ({css, markup,script})
export function writeModuleResult(modulePath, content) {

  if(typeof modulePath === "string" && typeof content === "string") {

    //change path of module to that of where we should store the page in /dist
    const pagePath = modulePath.replace("src", "dist").replace("pages", "modules-res").replace("mjs", "json");

    //if in PROD, exit if the file exists (on dev always write the file)
    if(process.env.NODE_ENV === "production" && fs.existsSync(pagePath)) return;

    //if the dirs in the path don't exist create them
    const pageDirPath = pagePath.split("/").slice(0, -1).join("/").toString();

    if(!fs.existsSync(pageDirPath)) {
      fs.mkdirSync(pageDirPath, { recursive: true });
    }

    //brotli compress the string
    const buff = Buffer.from(content, "utf-8");
    const compressed = brotli.compress(buff, brotliSettings);
    //const compressed = content;

    fs.writeFileSync(pagePath, compressed);

  } else {
    console.log("compressAndWrite passed invalid module output", modulePath);
  }

}
