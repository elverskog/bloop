import http from "http";
import { moduleOrPageCompiler } from "./src/main.mjs";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import {fileURLToPath} from "url";

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

  console.log("reqExtension: ", reqExtension);

  //if the request is for an allowed filetype or a node_module
  if(typeof fileTypesObject[reqExtension] === "string" || req.url.indexOf("node_modules") > -1) {

    //set the contenttype in the header based on extension for now
    //TODO: need to look into a better way to determine the file type
    let contentType = (typeof fileTypesObject[reqExtension] === "string") ? fileTypesObject[reqExtension] : fileTypesObject["js"];

    if(reqExtension === "css" || reqExtension === "js") {
    // if(contentType === "text/css") {
      console.log("WRITE HEAD CSS");
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
        "Expires": "-1",
        "Pragma": "no-cache",
        "Content-Encoding": "br",
      });

      //read and return the static file
      const data = fs.readFileSync(`${__basedir}${req.url}`);
      res.write(data);
      res.end();

    } else {
      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
        "Expires": "-1",
        "Pragma": "no-cache",
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

    }

  } else {

    res.writeHead(200, {
      "Content-Type": "text/html",
      "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
      "Expires": "-1",
      "Pragma": "no-cache"
    });

    const compilerOptions = { req, res, __basedir };
    const output = await moduleOrPageCompiler(compilerOptions);

    res.write(output);
    res.end();

  }

});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});