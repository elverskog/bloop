//if the command "npm prod" is run, here we run code to build every page found in /pages
//for each page the HTML, CSS and JS for each will be stored in an analogous location in /dist

import { validateArgs } from "../validation-utils.mjs";
// import fsExtra from "fs-extra";
import { buildPage } from "../build-page-utils.mjs";


export async function build(pagePathsArray) {

  console.log("BUILD - PAGEPATHSARRAY: ", pagePathsArray);

  try {
    validateArgs([
      [pagePathsArray, "array"]
    ]); 
  } catch (error) {
    console.log("CAUGHT ERROR: ", error);
    return;
  }

  // return await moduleCompiler({ url: pagePathsArray[0], isFetch: false, res: null, isBuild: true });

  return Promise.all(pagePathsArray.map( async path => {
    return await buildPage({ path, isFetch: false, res: null, isBuild: true });
  }));

  // //if in build mode, clear the JS and CSS directories in /src
  // //so if in prod mode we don't need to keep writing the files on each page serve
  // if (process.env.NODE_ENV === "production") { 
  //   fsExtra.emptyDirSync(`${baseDir}/dist/css`);
  //   fsExtra.emptyDirSync(`${baseDir}/dist/js`);
  //   fsExtra.emptyDirSync(`${baseDir}/dist/pages`);
  //   fsExtra.emptyDirSync(`${baseDir}/dist/modules-res`);
  // }

}


//Note - rework moduleCompiler so that it returns an object with markup, css, js
//have server.js (or whatever) then write files, then return result
//I guess for build...?
//need to decide where/when to write 
