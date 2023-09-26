import fs from "fs";
import wrapperMod from "./components/wrapper.mjs";
import { writeCssOrJs, writeModuleResult, writePage } from "./write.mjs";
import loadModule from "./utils/module-utils.mjs";
import manageHopper from "./hopper.mjs";


//creates the output for either a full page ("channeling" the result through wrapper)
//or a single module (which may contain child modules)
//only runs on server
export default async function moduleCompiler(options) {

  let bodyRes;
  
  const { isBuild } = options;

  const isFetch = options?.req?.headers ? options?.req?.headers["is-fetch"] : false;

  //set modulePath to the URL pathname
  //need to account for the homepage or whatever the pathname "/" should load
  //TODO - may want to move 
  const modulePath = options.req.url === "/" ? "/a" : options.req.url;

  //reset the hopper to blank "css", "markup", "script" nodes
  //TODO - is this even needed if a new app is started on each request?
  manageHopper.setHopper();

  //if for build, just use what was passed in, else need to construct the full path from URL  
  const adjustedPath = isBuild ? modulePath : `${baseDir}/src/pages${modulePath}.mjs`;
  let bodyMod;

  //if we can't find the module/page that matches the path, use a 404 page/module
  try {
    // bodyMod = (await import(adjustedPath)).default;
    bodyRes = await loadModule(adjustedPath);
    // console.log("bodyRes: ", bodyRes);
  } catch(err) {
    // bodyMod = (await import(`${baseDir}/src/pages/fourOhFour.mjs`)).default; 
    bodyRes = await loadModule(`${baseDir}/src/pages/fourOhFour.mjs`); 
  }

  //get the body module. exit and log if bodyMod is not valid
  // const bodyRes = typeof bodyMod === "function" ? await bodyMod() : undefined;
 
  const hopper = manageHopper.getHopper();

  //if we got a full page request, we call wrapper, passing body into it
  if(!isFetch) {
    // await wrapperMod(bodyRes.markup, bodyRes.title);
    const args = { hopper, bodyMarkup: bodyRes.markup, title: bodyRes.title };
    const inWrapper = await loadModule(`${baseDir}/src/components/wrapper.mjs`, args);
    console.log("inWrapper: ", inWrapper);
    // await loadModule(`${baseDir}/src/components/wrapper.mjs`, bodyRes);
  } else {
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

  if(isFetch) {
    filePath = `${baseDir}/dist/modules-res${modulePath}.json`;
    fourOhFourPath = `${baseDir}/dist/modules-res/fourOhFour.json`;
  } else {
    filePath = `${baseDir}/dist/pages${modulePath}.html`;
    fourOhFourPath = `${baseDir}/dist/pages/fourOhFour.html`;
  }

  //if in build just return (as the point then is to just write the files)
  if(isBuild) {
    return;
  } else {
    //return the markup file we wrote above 
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    } else {
      //set another fallback in case the file is missing
      //TODO - this should maybe be something besides a 404
      return fs.readFileSync(fourOhFourPath);
    }
  }

}
