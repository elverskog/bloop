//if the command "npm prod" is run, here we run code to build every page found in /pages
//for each page the HTML, CSS and JS for each will be stored in an analogous location in /dist

import { validateArgs } from "../validation-utils.mjs";
// import fsExtra from "fs-extra";
import { buildPage } from "../build-page-utils.mjs";


export async function build(pagePathsArray) {

  try {
    validateArgs([
      [pagePathsArray, "array"]
    ]); 
  } catch (error) {
    console.log("CAUGHT ERROR: ", error);
    return;
  }

  const masterRes = Promise.all(pagePathsArray.map( async path => {
    return await buildPage({ path, isFetch: false, res: null, isBuild: true });
  }));

  return masterRes;

}
