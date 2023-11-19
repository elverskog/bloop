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

  let buff;
  let compressed;

  try {
    validateArgs([[content, "string"], [path, "string"]]); 
  } catch (error) {
    throw new Error(error);
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


//function to compress and write markup files for a full page request
export function writeCssOrJs(page, type) {

  let savePath;
  let saveDirPath;

  try {
    validateArgs([[page.modulePath, "string"], [page[type], "object"], [type, "string"]]); 
  } catch (error) {
    throw new Error(error);
  }

  if(typeof page.modulePath === "string" && page.modulePath.indexOf("src/") > -1 && page.modulePath.indexOf(".mjs") > -1) {
    //change path of module to that of where we should store the page in /dist
    savePath = page.modulePath.replace("src", "dist").replace("mjs", type);
  } else {
    throw new Error("writePage: page.modulePath not a string or is otherwise invalid");
  }

  //if in PROD, exit if the file exists. on dev always write the file
  if(process.env.NODE_ENV === "production" && fs.existsSync(savePath)) return;

  //if the dirs in the path don't exist create them (cut the filename off the end)
  saveDirPath = savePath.split("/").slice(0, -1).join("/").toString();
  if(!fs.existsSync(saveDirPath)) {
    fs.mkdirSync(saveDirPath, { recursive: true });
  }

  //iterate over the object and write each top level node to a file
  Object.keys(page[type]).forEach(key => {
    const val = page[type][key];
    write(val, savePath);
  });

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
