//if the command "npm prod" is run, here we run code to build every page found in /pages
//for each page the HTML, CSS and JS for each will be stored in an analogous location in /dist

import fsExtra from "fs-extra";
import moduleCompiler from "../moduleCompiler.mjs";
import { utilBaseDir } from "./dir-utils/dir-utils.mjs";

export async function build(pagePathsArray) {

  const baseDir = utilBaseDir.getBaseDir();

  //if in build mode, clear the JS and CSS directories in /src
  //so if in prod mode we don't need to keep writing the files on each page serve
  if (process.env.NODE_ENV === "production") { 
    fsExtra.emptyDirSync(`${baseDir}/dist/css`);
    fsExtra.emptyDirSync(`${baseDir}/dist/js`);
    fsExtra.emptyDirSync(`${baseDir}/dist/pages`);
    fsExtra.emptyDirSync(`${baseDir}/dist/modules-res`);
  }

  //then loop through all paths in as arg
  let index = 0;
  async function buildModule() {
    if(typeof pagePathsArray[index] === "string") {
      //fabricate req.url, as that is all we use from the request (for now)
      const url = pagePathsArray[index];
      //pass the url/path to our page builder 
      await moduleCompiler({ url, isFetch: false, res: null, baseDir, isBuild: true });
      //pass the url/path to our module builder 
      await moduleCompiler({ url, isFetch: true, res: null, baseDir, isBuild: true });
      index++;
      //recursively call this function
      buildModule();
    } else {
      return;
    }
  }

  buildModule();

}


//Note - rework moduleCompiler so that it returns an object with markup, css, js
//have server.js (or whatever) then write files, then return result
//
//I guess for build...?
//need to decide where/when to write 
