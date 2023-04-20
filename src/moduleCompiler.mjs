import fs from "fs";
import wrapperMod from "./components/wrapper.mjs";
import { writeCssOrJs, writeModuleResult, writePage } from "./write.mjs";
import manageHopper from "./hopper.mjs";

//creates the output for either a full page (channeling through wrapper)
//or a single module (which may contain child modules)
//only runs on server
export default async function moduleCompiler(options) {

  if(typeof global !== "object") return; 

  const { req, __basedir, isBuild } = options;
  const isFetch = req?.headers && req?.headers["is-fetch"];

  //create app to store our global vars in
  global.p_p = {};
  p_p.baseDir = __basedir;
  p_p.isServer = typeof global === "object";
  p_p.req = req;

  //add hopper management to p_p and create blank(ish) hopper (see hopper func above)
  p_p.manageHopper = manageHopper;
  
  //clear the hopper before we populate it
  p_p.manageHopper.setHopper();

  //need to account for the homepage (whatever "/" should load)
  const modulePath = req.url === "/" ? "/a" : req.url;

  //if for build, just use what was passed in, else need to construct the full path from URL  
  const adjustedPath = isBuild ? modulePath : `${__basedir}/src/pages${modulePath}.mjs`;
  let bodyMod;

  console.log("ADJUSTED PATH: ", adjustedPath);

  //if we can't find the module/page that matches the path, use a 404 page/module
  try {
    bodyMod = (await import(adjustedPath)).default;
  } catch(err) {
    bodyMod = (await import(`${__basedir}/src/pages/fourOhFour.mjs`)).default; 
  }

  //get the body module. exit and log if bodyMod is not valid
  // const bodyRes = await bodyMod();
  const bodyRes = typeof bodyMod === "function" ? await bodyMod() : undefined;
  
  //if we got a full page request, we call wrapper, passing body into it
  if(!isFetch) {
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

  if(isFetch) {
    filePath = `${__basedir}/dist/modules-res${modulePath}.json`;
    fourOhFourPath = `${__basedir}/dist/modules-res/fourOhFour.json`;
  } else {
    filePath = `${__basedir}/dist/pages${modulePath}.html`;
    fourOhFourPath = `${__basedir}/dist/pages/fourOhFour.html`;
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