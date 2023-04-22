import http from "http";
import moduleCompiler from "./src/moduleCompiler.mjs";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import {fileURLToPath} from "url";
import {getAllPages} from "./src/utils/dir-utils/dir-utils.mjs";


//for node set a base directory as full path
//for browser we set it in ./src/components/main.js 
//so we can use the same import path in node as in browser

const __filename = fileURLToPath(import.meta.url);
global.__basedir = path.dirname(__filename);

const PORT = 3000;

//clear the JS and CSS directories in /src
//so if in prod mode we don't need to keep writing the files on each page serve
fsExtra.emptyDirSync(`${__basedir}/dist/css`);
fsExtra.emptyDirSync(`${__basedir}/dist/js`);
fsExtra.emptyDirSync(`${__basedir}/dist/pages`);
fsExtra.emptyDirSync(`${__basedir}/dist/modules-res`);


//if on prod, here we run code to request (build) every page
//this will create CSS and JS files for each page on run, 
//so that said file creation will be skipped on request
//in this current location the files will be created right on server start
//and the request handling defined below will skip writing any CSS and JS files, as they should already exist (again, if on prod) 
//TODO: need to decide if this should be in this file or split off

async function build() {

  //get an array of paths to all valid pages
  const allPages = getAllPages(`${__basedir}/src/pages`);

  //console.log("ALL PAGES: ", allPages);

  let index = 0;

  async function buildModule() {
    if(typeof allPages[index] === "string") {
      //fabricate req.url, as that is all we use from the request (for now)
      const req = { url: allPages[index] };
      //pass the url/path to our page builder 
      await moduleCompiler({ req, res: null, __basedir, isBuild: true });
      index++;
      buildModule();
    } else {
      return;
    }
  }

  buildModule();

}


const server = http.createServer(async (req, res) => {

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
    const fileExists = fs.existsSync(`${__basedir}${req.url}`);
    if(fileExists) {
      output = fs.readFileSync(`${__basedir}${req.url}`, readFileOptions);
    } else {
      console.log("file not found error: ", `${__basedir}${req.url}`);
      output = "";
      status = 404;
    }

    //add brotli header if file is JS or CSS
    if(reqExtension === "css" || reqExtension === "js") {
      headerOptions["Content-Encoding"] = "br";
    }

    headerOptions["Content-Type"] = contentType;

    //console.log("OUTPUT: ", req.url, "\n", output);

  } else {

    //add compression flag for all current file types served
    //we may need to alter this later
    headerOptions["Content-Encoding"] = "br";

    headerOptions["Content-Type"] = "html";
    output = await moduleCompiler({ req, res, __basedir });

  }

  res.writeHead(status, headerOptions);
  res.write(output);
  res.end();

});


//run build script if on prod on start
if(process.env.NODE_ENV === "production") {
  console.log("BUILD");
  await build();
}

server.listen(PORT, () => {
  console.log(`PROD listening on port ${PORT}`);
});


//// TODO need to test if async readFile is any faster/better than sync
// fs.readFile(`${__basedir}${req.url}`, {encoding:'utf8', flag:'r'}, (err, data) => {
//   if(err) {
//     console.error(err);
//   } else {
//     output = data;
//   }
// });