//if the command "npm prod" is run, here we run code to buildPage every page found in /pages

import { validateArgs } from "../validation-utils.mjs";
import { buildPage } from "./build-page-utils.mjs";


export async function build(pagePathsArray, isFetch) {

  validateArgs(arguments, ["array", "boolean", "boolean"]);

  const masterRes = Promise.all(pagePathsArray.map( async path => {
    return await buildPage(path, isFetch, true);
  }));

  return masterRes;

}
