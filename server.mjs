import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import moduleCompiler from "./src/moduleCompiler.mjs";
import { build } from "./src/utils/build-utils.mjs";
import { utilBaseDir, getAllPages } from "./src/utils/dir-utils/dir-utils.mjs";


//for node set a base directory as full path
//for browser we set it in ./src/components/main.js 
//so we can use the same import path in node as in browser

utilBaseDir.setBaseDir(() => {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
});

const baseDir = utilBaseDir.getBaseDir();

const PORT = 3000;

const server = http.createServer(async (req, res) => {

  //set default status as success
  let status = 200;

  //set if the call is a fetch (non-fullpage call)
  const isFetch = req?.headers ? req?.headers["is-fetch"] : false;
  
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
  const reqExtension = req.url.split(".")[ req.url.split(".").length - 1 ];

  //set baseline header for all file/response types
  const headerOptions = {
    "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
    "Expires": "-1",
    "Pragma": "no-cache",
  };

  //if the request is for an allowed filetype
  if(typeof fileTypesObject[reqExtension] === "string") {

    //set the content-type in the header based on extension for now
    //TODO: need to look into a better way to determine the file type
    let contentType = (typeof fileTypesObject[reqExtension] === "string") ? fileTypesObject[reqExtension] : fileTypesObject["js"];
    const readFileOptions = {};

    //read and return the static file
    const fileExists = fs.existsSync(`${baseDir}${req.url}`);
    if(fileExists) {
      output = fs.readFileSync(`${baseDir}${req.url}`, readFileOptions);
    } else {
      console.log("file not found error: ", `${baseDir}${req.url}`);
      output = "";
      status = 404;
    }

    //add brotli header if file is JS or CSS
    if(reqExtension === "css" || reqExtension === "js") {
      headerOptions["Content-Encoding"] = "br";
    }

    headerOptions["Content-Type"] = contentType;

  //if thls is a full page request
  } else if(!isFetch) {

    //add compression flag for all current file types served
    //we may need to alter this later
    headerOptions["Content-Encoding"] = "br";
    headerOptions["Content-Type"] = "html";
    const readFileOptions = {};

    //if there is a file found for the pathname, return it
    //else compile the module(s) and write the related files
    try {
      output = fs.readFileSync(`${baseDir}/dist/pages${req.url}.html`, readFileOptions);
    } catch (error) {
      console.log("server.mjs read HTML page error: ", error);
    }

    if (typeof output !== "object") {
      try {
        output = fs.readFileSync(`${baseDir}/dist/pages/fourOhFour.html`, readFileOptions);
      } catch (error) {
        console.log("server.mjs read HTML 404 page error: ", error);
      }
    }

    if (typeof output !== "object") {
      output = await moduleCompiler({ req, res, baseDir });
    }

  //if this is a fetch request, output a module/component JSON file
  //TODO make this not the default
    //TODO check for an already rendered module and return that, if found
  } else {

    //add compression flag for all current file types served
    //we may need to alter this later
    headerOptions["Content-Encoding"] = "br";
    headerOptions["Content-Type"] = "json";


    output = await moduleCompiler({ req, res, baseDir });
  
  }

  res.writeHead(status, headerOptions);
  res.write(output);
  res.end();

});


//run build script if on prod on start
if(process.env.NODE_ENV === "production") {
  console.log("BUILD");
  //get an array of paths to all valid pages
  const pagePathsArray = getAllPages(`${baseDir}/src/pages`);
  await build(pagePathsArray);
}

server.listen(PORT, () => {
  console.log(`PROD listening on port ${PORT}`);
});
