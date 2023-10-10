import fs from "fs";
import brotli from "brotli";
import { utilBaseDir } from "./utils/dir-utils/dir-utils.mjs";


//settings for brotli compression - TODO adjust these settings
const brotliSettings = {
  extension: "css",
  skipLarger: true,
  mode: 1, // 0 = generic, 1 = text, 2 = font (WOFF2)
  quality: 10, // 0 - 11,
  lgwin: 12 // default
};


//function to compress and write files, in subsection of hopper (css vs js)
export function writeCssOrJs(contentString, fileType, moduleName) {

  const baseDir = utilBaseDir.getBaseDir();
  const filePath = `${baseDir}/dist/${fileType}/${moduleName}.${fileType}`;

  //if in PROD, exit if the file exists (on dev always write the file)
  if(process.env.NODE_ENV === "production" && fs.existsSync(filePath)) return;

  if(typeof contentString === "string" && typeof fileType === "string" && typeof moduleName === "string") {

    //brotli compress the css-string
    const buff = Buffer.from(contentString, "utf-8");
    const compressed = brotli.compress(buff, brotliSettings);
    //const compressed = contentString;

    fs.writeFileSync(filePath, compressed);

  } else {
    console.log("compressAndWrite passed invalid values", arguments);
  }

}


//function to compress and write markup files for a full page request
export function writePage(modulePath, content) {

  console.log("WRITE PAGE: ", modulePath);

  if(typeof modulePath === "string" && typeof content === "string") {

    //change path of module to that of where we should store the page in /dist
    const pagePath = modulePath.replace("src", "dist").replace("mjs", "html");

    //if in PROD, exit if the file exists (on dev always write the file)
    if(process.env.NODE_ENV === "production" && fs.existsSync(pagePath)) return;

    //if the dirs in the path don't exist create them
    const pageDirPath = pagePath.split("/").slice(0, -1).join("/").toString();

    if(!fs.existsSync(pageDirPath)) {
      fs.mkdirSync(pageDirPath, { recursive: true });
    }

    //brotli compress the css-string
    const buff = Buffer.from(content, "utf-8");
    const compressed = brotli.compress(buff, brotliSettings);
    //const compressed = content;

    fs.writeFileSync(pagePath, compressed);

  } else {
    console.log("compressAndWrite passed invalid page content", modulePath);
  }

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
