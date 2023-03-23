import http from "http";
import { moduleOrPageCompiler } from "./src/main.mjs";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import {fileURLToPath} from "url";
import {getAllPages} from "./src/utils/dir-utils.mjs";


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

//if on prod, here we run code to request every page
//this is the actual (main) build process
//this will create CSS and JS files for each page on run, 
//so that said file creation will be skipped on request
//TODO: need to decide if this should be run here or elsewhere
//in this current location the files will be created right on server start
//and the request handling defined below will skip writing any CSS and JS files, as they should already exist (again, if on prod) 
function build() {
  console.log("BUILD");

  //get an array of paths to all valid pages
  const allPages = getAllPages(`${__basedir}/src/pages`);
  //loop through said pages/paths
  allPages.forEach( pagePath => {
    console.log("page path: ", pagePath);
    //"fabricate" req.url, as that is all we use from the request (for now)
    const req = { url: pagePath};
    //pass the url/path to our page builder 
    moduleOrPageCompiler({ req, res: null, __basedir });
  });  
}

  //run build script if on prod
  console.log("NODE_ENV: ", process.env.NODE_ENV);

  if(process.env.NODE_ENV === "production") {
    //build();
  }


const server = http.createServer(async (req, res) => {

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

  //if the request is for an allowed filetype or a node_module (which I will likely not server anyways)
  if(typeof fileTypesObject[reqExtension] === "string" || req.url.indexOf("node_modules") > -1) {

    //set the contenttype in the header based on extension for now
    //TODO: need to look into a better way to determine the file type
    let contentType = (typeof fileTypesObject[reqExtension] === "string") ? fileTypesObject[reqExtension] : fileTypesObject["js"];
    const readFileOptions = {};

    headerOptions["Content-Type"] = contentType;

    if(reqExtension === "css" || reqExtension === "js") {
      //add compression flag for CSS and JS
      headerOptions["Content-Encoding"] = "br";
    } else {
      //add options for reading non-compressed files
      readFileOptions.encoding = "utf8";
      readFileOptions.flag = "r";
    }

    //read and return the static file
    output = fs.readFileSync(`${__basedir}${req.url}`, readFileOptions);
    
  } else {

    headerOptions["Content-Type"] = "html";
    output = await moduleOrPageCompiler({ req, res, __basedir });

  }

  res.writeHead(200, headerOptions);
  res.write(output);
  res.end();

});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});


//TODO need to test if async readFile is any faster/better than sync
// fs.readFile(`${__basedir}${req.url}`, {encoding:'utf8', flag:'r'}, (err, data) => {
//   if(err) {
//     console.error(err);
//   } else {
//     output = data;
//   }
// });