import fs from "fs";
import wrapperMod from "./components/wrapper.mjs";
import { writeCssOrJs, writeModuleResult, writePage } from "./write.mjs";
import setP_P from "./setGlobal.mjs";
import loadModule from "./utils/module-utils.mjs";


//creates the output for either a full page ("channeling" the result through wrapper)
//or a single module (which may contain child modules)
//only runs on server
export default async function moduleCompiler(options) {

  let bodyRes;
  
  //make call to set some globals
  setP_P(options);
  if(!global.p_p) return;

  //reset the hopper to blank "css", "markup", "script" nodes
  //TODO - is this even needed if a new app is started on each request?
  p_p.manageHopper.setHopper();

  //set modulePath to the URL pathname
  //need to account for the homepage or whatever the pathname "/" should load
  //TODO - may want to move 
  const modulePath = p_p.req.url === "/" ? "/a" : p_p.req.url;

  //if for build, just use what was passed in, else need to construct the full path from URL  
  const adjustedPath = p_p.isBuild ? modulePath : `${p_p.baseDir}/src/pages${modulePath}.mjs`;
  let bodyMod;

  //if we can't find the module/page that matches the path, use a 404 page/module
  try {
    // bodyMod = (await import(adjustedPath)).default;
    bodyRes = await loadModule(adjustedPath);
  } catch(err) {
    // bodyMod = (await import(`${p_p.baseDir}/src/pages/fourOhFour.mjs`)).default; 
    bodyRes = await loadModule(`${p_p.baseDir}/src/pages/fourOhFour.mjs`); 
  }

  //get the body module. exit and log if bodyMod is not valid
  // const bodyRes = typeof bodyMod === "function" ? await bodyMod() : undefined;
  
  //if we got a full page request, we call wrapper, passing body into it
  if(!p_p.isFetch) {
    await wrapperMod(bodyRes.markup, bodyRes.title);
  } else {
    //write the current compiled page to a JSON file
    writeModuleResult(adjustedPath, JSON.stringify(p_p.hopper));
  }

  //write CSS for each module in hopper
  if(Object.keys(p_p.hopper.css).length) {
    Object.keys(p_p.hopper.css).forEach( key => {
      writeCssOrJs(p_p.hopper.css[key], "css", key);
    });
  }

  //write markup/HTML for "end result" hopper
  if(Object.keys(p_p.hopper.markup).length) {
    writePage(adjustedPath, p_p.hopper.markup);
  }
  
  //write script for each module in hopper
  if(Object.keys(p_p.hopper.script).length) { 
    Object.keys(p_p.hopper.script).forEach( key => {
      writeCssOrJs(p_p.hopper.script[key], "js", key);
    });
  }

  //always return a "compiled" file for all call types
  
  let filePath;
  let fourOhFourPath;

  if(p_p.isFetch) {
    filePath = `${p_p.baseDir}/dist/modules-res${modulePath}.json`;
    fourOhFourPath = `${p_p.baseDir}/dist/modules-res/fourOhFour.json`;
  } else {
    filePath = `${p_p.baseDir}/dist/pages${modulePath}.html`;
    fourOhFourPath = `${p_p.baseDir}/dist/pages/fourOhFour.html`;
  }

  //if in build just return (as the point then is to just write the files)
  if(p_p.isBuild) {
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