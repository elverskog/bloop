import http from "http";
import fs from "fs";
import { getPages } from "./src/utils/data-utils.mjs";
import { build } from "./src/utils/build-utils/build-utils.mjs";
import { page } from "./src/utils/build-utils/build-page-utils.mjs";
import { 
  clearFiles, 
  utilBaseDir
} from "./src/utils/dir-utils/dir-utils.mjs";
import { 
  writeCss, 
  writeMarkup, 
  writeJs, 
  writeModule, 
} from "./src/utils/write-utils/write-utils.mjs";


//for node set a base directory as full path
//for browser we set it in ./src/components/main.js 
//so we can use the same import path in node as in browser

// utilBaseDir.setBaseDir((() => {
//   const __filename = fileURLToPath(import.meta.url);
//   return path.dirname(__filename);
// }))();

utilBaseDir.setBaseDir(import.meta.url);
console.log("META URL", import.meta.url);

const baseDir = utilBaseDir.getBaseDir();

const PORT = 3000;

const server = http.createServer(async (req, res) => {

  //need to account for the homepage or whatever the pathname "/" should load
  const url = req.url === "/" ? "/a" : req.url;

  const isFetch = req?.headers ? req?.headers["is-fetch"] : false;

  //set default status as success
  let status = 200;

  //set holder for final oitput to be served
  let output;

  //define the filetypes we will try and handle
  const fileTypesObject = {
    css: "text/css",
    js: "text/javascript",
    mjs: "text/javascript",
    ico: "image/x-icon",
  };

  //get the extension from the file requested 
  const reqExtension = url.split(".")[ url.split(".").length - 1 ];

  //set baseline header for all file/response types
  const headerOptions = {
    "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
    "Expires": "-1",
    "Pragma": "no-cache",
  };

  //if the request is for an allowed filetype (CSS, image etc)
  if(typeof fileTypesObject[reqExtension] === "string") {

    //set the content-type in the header based on extension for now
    //TODO: need to look into a better way to determine the file type
    let contentType = (typeof fileTypesObject[reqExtension] === "string") ? fileTypesObject[reqExtension] : fileTypesObject["js"];
    const readFileOptions = {};

    //read and return the static file
    const fileExists = fs.existsSync(`${baseDir}${url}`);
    if(fileExists) {
      output = fs.readFileSync(`${baseDir}${url}`, readFileOptions);
    } else {
      console.log("file not found error: ", `${baseDir}${url}`);
      output = "";
      status = 404;
    }

    //add brotli header if file is JS or CSS
    if(reqExtension === "css" || reqExtension === "js") {
      // headerOptions["Content-Encoding"] = "br";
    }

    headerOptions["Content-Type"] = contentType;

  //if thls is a full page or module request
  } else {

    //add compression and type flags for current file types served
    //headerOptions["Content-Encoding"] = "br";
    headerOptions["Content-Type"] = isFetch ? "json" : "html";

    //path to rendered files changes based on if request is for a page or a module
    const path = isFetch ? `${baseDir}/dist/modules${url}.json` : `${baseDir}/dist/markup/${url}.html`;
    const fallbackPath = isFetch ? `${baseDir}/dist/modules/four-oh-four.json` : `${baseDir}/dist/markup/four-oh-four.html`;

    //if there is a file found for the pathname, return it
    //else compile the module(s) and write the related files
    try {
      output = fs.readFileSync(path, {});
    } catch (error) {
      console.log("server.mjs read file error: ", error);
    }

    //if no file was found, or we are in dev mode, try to create it and return the result
    if(process.env.NODE_ENV === "development" || typeof output !== "object") {
      try {

        const jsonFileName = `${ url.substring(1).replace("/", "~") }.json`;
        const { default: pageData } = await import(`./content/pages/${jsonFileName}`, { assert: { type: "json" } });
        const pageObj = new page();

        if (isFetch) {
          const pageAsModule = await pageObj.buildPage(pageData.template, pageData, true);
          writeModule(pageAsModule);
          output = fs.readFileSync(`./dist/modules/${url}.json`, {});
        } else {
          const pageFull = await pageObj.buildPage(pageData.template, pageData, false);
          writeMarkup(pageFull);
          writeCss(pageFull);
          writeJs(pageFull);
          output = fs.readFileSync(`./dist/markup/${url}.html`, {});
        }

      } catch (error) {
        console.log("server.js module compile error", error); 
      }

    }

    //if no file was found and we couldn't create it, try to return a 404 page or module from dist
    if (typeof output !== "object") {
      try {
        output = fs.readFileSync(fallbackPath, {});
      } catch (error) {
        console.log("server.mjs read HTML 404 page error: ", error);
      }
    }

    //if we couldn't find and return a 404 page or module from dist, return a simple error message
    if (typeof output !== "object") {
      console.error("server.mjs falling back to plain error message");
      if(isFetch) {
        output = JSON.stringify({ 
          title: "Error",
          css: [{
            name: "moduleFailedError",
            val: `\n .module-failed-error { 
              color: #ff0000;
              text-align: center;
            } /n`
          }],
          markup: "<p class=\"module-failed-error\">Sorry, an error occured trying to return this content.</p>" 
        }); 
      } else {
        output = "<p style=\"color: #ff0000; text-align: center\">Sorry, an error occured trying to return this content.</p>"; 
      }
    }

  }

  res.writeHead(status, headerOptions);
  res.write(output);
  res.end();

});


//run build script if on prod on start
if(process.env.NODE_ENV === "production") {
  
  console.log("BUILD");
  
  clearFiles([
    "dist/css",
    "dist/js",
    "dist/markup",
    "dist/modules"
  ]);

  //get an array of paths to all valid pages
  const pagesData = await getPages();

  console.log("PAGEsDATA: ", pagesData);

  const buildObjectFullPages = await build(pagesData, false);
  const buildObjectModules = await build(pagesData, true);

  // console.log("BUILDOBJECTFULLPAGES: ", buildObjectFullPages);

  buildObjectFullPages.forEach(page => {
    writeMarkup(page);
    writeCss(page);
    writeJs(page);
  });

  buildObjectModules.forEach(page => {
    writeModule(page);
  });

}

server.listen(PORT, () => {
  console.log(`${ process.env.NODE_ENV } listening on port ${ PORT }`);
});
