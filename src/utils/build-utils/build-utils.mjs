//if the command "npm prod" is run, here we run code to build every page found in /pages
//for each page the HTML, CSS and JS for each will be stored in an analogous location in /dist

import { validateArgs } from "../validation-utils.mjs";
// import fsExtra from "fs-extra";
import { buildPage } from "../build-page-utils.mjs";


function buildMarkup(masterRes) {

  console.log("MS: ", masterRes);

  const markupDict = {};

  try {
    validateArgs([
      [masterRes, "object"]
    ]); 
  } catch (error) {
    console.log("CAUGHT ERROR: ", error);
    return;
  }

  Object.keys(masterRes).forEach(key => {
    console.log("KEY: ", key);
    const page = masterRes[key];
    if (typeof page.name === "string" && typeof page.markup === "string") {
      markupDict[page.name] = page.markup;    
    } else {
      throw new Error("masterRes.markup is not a string");
    }
  });

  return markupDict;

}


export async function build(pagePathsArray) {

  const masterRes = {};
  let markup;

  try {
    validateArgs([
      [pagePathsArray, "array"]
    ]); 
  } catch (error) {
    console.log("CAUGHT ERROR: ", error);
    return;
  }

  // const masterRes = Promise.all(pagePathsArray.map( async path => {
  //   return await buildPage({ path, isFetch: false, res: null, isBuild: true });
  // }));

  pagePathsArray.forEach( async path => {
    const dedupedRes = {};
    const page = await buildPage({ path, isFetch: false, res: null, isBuild: true });
    // console.log("PAGE: ", page[0].name);
    // console.log("PAGE: ", page);
    // Object.keys(page).forEach(key => {
    //   const module = page[key];
    //   dedupedRes[module.name] = module;
    // });
    // masterRes[page[0].name] = await page;
  });

  // markup = buildMarkup(await masterRes);

  // console.log("MARKUP: ", markup);

  // dedupe the css and script nodes
  // e.g. we only need to create one css file for say "menu"

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


