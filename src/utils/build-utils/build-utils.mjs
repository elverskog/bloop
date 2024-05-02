import { validateArgs } from "../validation-utils.mjs";
import { page } from "./build-page-utils.mjs";


// export async function build(pagePathsArray, isFetch, isProd = true) {
export async function build(pagePathsArray, isFetch) {

  validateArgs(arguments, ["array", "boolean"]);

  const masterRes = Promise.all(pagePathsArray.map( async path => {
    const pageObj = new page();
    return await pageObj.buildPage(path, isFetch);
  }));

  return masterRes;

}
