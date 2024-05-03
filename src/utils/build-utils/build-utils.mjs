import { validateArgs } from "../validation-utils.mjs";
import { page } from "./build-page-utils.mjs";


export async function build(pagesData, isFetch) {

  validateArgs(arguments, ["array", "boolean"]);

  const masterRes = Promise.all(pagesData.map( async pagesData => {
    const pageObj = new page();
    return await pageObj.buildPage(pagesData, isFetch);
  }));

  return masterRes;

}
