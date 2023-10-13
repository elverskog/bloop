import fs from "fs";
import { writeCssOrJs, writeModuleResult, writePage } from "./write.mjs";
import loadModule from "./utils/module-utils.mjs";
import manageHopper from "./hopper.mjs";
import { utilBaseDir } from "./utils/dir-utils/dir-utils.mjs";


//creates the output for either a full page ("channeling" the result through wrapper)
//or a single module (which may contain child modules)
//only runs on server
export default async function moduleCompiler(options) {

  let bodyRes;
  const { url, isFetch, isBuild } = options;
  const modulePath = url === "/" ? "/a" : url;
  const baseDir = utilBaseDir.getBaseDir();

  //reset the hopper to blank "css", "markup", "script" nodes
  //TODO - is this even needed if a new app is started on each request?
  manageHopper.setHopper();

  //if for build, just use what was passed in, else need to construct the full path from URL  
  const adjustedPath = isBuild ? modulePath : `src/pages${modulePath}.mjs`;

  console.log("PATH SENT: ", adjustedPath);

  //if we can't find the module/page that matches the path, use a 404 page/module
  try {
    bodyRes = await loadModule(adjustedPath);
  } catch(err) {
    console.log("moduleCompiler.mjs load module error: ", err);
  }

  //get the body module. exit and log if bodyMod is not valid
  // const bodyRes = typeof bodyMod === "function" ? await bodyMod() : undefined;
 
  const hopper = manageHopper.getHopper();

  //if we got a full page request, we call wrapper, passing body into it
  if(!isFetch) {
    console.log("IS NOT FETCH");
    // await wrapperMod(bodyRes.markup, bodyRes.title);
    //const { bodyMarkup, title } = args;
    await loadModule("src/components/wrapper.mjs", { bodyMarkup: bodyRes.markup, title: bodyRes.title });
  } else {
    console.log("IS FETCH");
    //write the current compiled page to a JSON file
    writeModuleResult(adjustedPath, JSON.stringify(hopper));
  }

  //write CSS for each module in hopper
  if(Object.keys(hopper.css).length) {
    Object.keys(hopper.css).forEach( key => {
      writeCssOrJs(hopper.css[key], "css", key);
    });
  }

  //write markup/HTML for "end result" hopper
  if(Object.keys(hopper.markup).length) {
    writePage(adjustedPath, hopper.markup);
  }
  
  //write script for each module in hopper
  if(Object.keys(hopper.script).length) { 
    Object.keys(hopper.script).forEach( key => {
      writeCssOrJs(hopper.script[key], "js", key);
    });
  }

  //always return a "compiled" file for all call types
  
  let filePath;
  let fourOhFourPath;

  //if a fetch call, return JSON
  //else pass the full HTML
  if(isFetch) {
    filePath = `${ baseDir }/dist/modules-res${modulePath}.json`;
    fourOhFourPath = `${ baseDir }/dist/modules-res/fourOhFour.json`;
  } else {
    filePath = `${ baseDir }/dist/pages${modulePath}.html`;
    fourOhFourPath = `${ baseDir }/dist/pages/fourOhFour.html`;
  }

  //if in build just return (as the point then is to just write the files)
  console.log("isBuild: ", isBuild);
  if(isBuild) {
    return;
  } else {
    console.log("filePath: ", filePath);
    //return the markup file we wrote above 
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    } else {
      console.log("moduleCompiler - return file missing", );
      //set another fallback in case the file is missing
      //TODO - this should maybe be something besides a 404
      return fs.readFileSync(fourOhFourPath);
    }
  }

}
