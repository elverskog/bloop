import http from "http";
import { moduleOrPageCompiler } from "./src/main.mjs";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";
import {getAllDirs} from "./src/utils/dir-utils.mjs";

//for node set a base directory as full path
//for browser we set it in ./src/components/main.js 
//so we can use the same import path in node as in browser

const __filename = fileURLToPath(import.meta.url);
global.__basedir = path.dirname(__filename);

const PORT = 3000;

//write a JSON file with the valid /pages directories
const validDirs = getAllDirs(`${__basedir}/src/pages`, null, __basedir);

try {
  fs.writeFileSync(`${__basedir}/dist/json/valid-dirs.json`, JSON.stringify(validDirs));
} catch(err) {
  console.error(err);
}

const server = http.createServer(async (req, res) => {

  //define the filetypes we will try and handle
  const fileTypesObject = {
    css: "text/css",
    js: "text/javascript",
    mjs: "text/javascript",
    ico: "image/x-icon",
  };

  //get the extension from the file requested 
  const reqExtension = req.url.split(".")[ req.url.split(".").length - 1 ];

  //if the request is for an allowed filetype or a node_module
  if(typeof fileTypesObject[reqExtension] === "string" || req.url.indexOf("node_modules") > -1) {

    //set the contenttype in the header based on extension for now
    //TODO: need to look into a better way to determine the file type
    let contentType = (typeof fileTypesObject[reqExtension] === "string") ? fileTypesObject[reqExtension] : fileTypesObject["js"];
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
      "Expires": "-1",
      "Pragma": "no-cache"
    });

    //read and return the static file
    fs.readFile(`${__basedir}${req.url}`, {encoding:'utf8', flag:'r'}, (err, data) => {
      if(err) {
        console.error(err);
      } else {
        res.write(data);
        res.end();
      }
    });

  } else {

    res.writeHead(200, {
      "Content-Type": "text/html",
      "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
      "Expires": "-1",
      "Pragma": "no-cache"
    });

    const frameOptions = { req, res, __basedir, validDirs };
    const frame = await moduleOrPageCompiler(frameOptions);

    res.write(frame);
    res.end();

  }

});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});