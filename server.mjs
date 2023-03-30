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
fsExtra.emptyDirSync(`${__basedir}/dist/pages`);


//if on prod, here we run code to request every page
//this is the actual (main) build process
//this will create CSS and JS files for each page on run, 
//so that said file creation will be skipped on request
//TODO: need to decide if this should be run here or elsewhere
//in this current location the files will be created right on server start
//and the request handling defined below will skip writing any CSS and JS files, as they should already exist (again, if on prod) 
async function build() {

  //get an array of paths to all valid pages
  const allPages = getAllPages(`${__basedir}/src/pages`);
  let index = 0;

  async function buildModule() {
    if(typeof allPages[index] === "string") {
      //fabricate req.url, as that is all we use from the request (for now)
      const req = { url: allPages[index] };
      //pass the url/path to our page builder 
      await moduleOrPageCompiler({ req, res: null, __basedir, isBuild: true });
      index++;
      buildModule();
    } else {
      return;
    }
  }

  buildModule();

}


//test to run just one page for checking optimization
async function buildTest() {
  const req = { url: `${__basedir}/src/pages/a.mjs` };
  await moduleOrPageCompiler({ req, res: null, __basedir, isBuild: true });

  // const req2 = { url: `${__basedir}/src/pages/b.mjs` };
  // await moduleOrPageCompiler({ req: req2, res: null, __basedir, isBuild: true });

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
    const fileExists = fs.existsSync(`${__basedir}${req.url}`);
    if(fileExists) {
      output = fs.readFileSync(`${__basedir}${req.url}`, readFileOptions);
    } else {
      console.log("file not found error: ", `${__basedir}${req.url}`);
      output = "";
      status = 404;
    }
    
  } else {

    headerOptions["Content-Type"] = "html";
    output = await moduleOrPageCompiler({ req, res, __basedir });

  }

  res.writeHead(status, headerOptions);
  res.write(output);
  res.end();

});


//run build script if on prod
if(process.env.NODE_ENV === "production") {
  await build();
  // await buildTest();

  server.listen(PORT, () => {
    console.log(`PROD listening on port ${PORT}`);
  });
} else {
  server.listen(PORT, () => {
    console.log(`DEV listening on port ${PORT}`);
  });
}


//// TODO need to test if async readFile is any faster/better than sync
// fs.readFile(`${__basedir}${req.url}`, {encoding:'utf8', flag:'r'}, (err, data) => {
//   if(err) {
//     console.error(err);
//   } else {
//     output = data;
//   }
// });