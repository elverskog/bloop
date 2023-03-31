import fs from "fs";
import wrapperMod from "./components/wrapper.mjs";
import { writeCssOrJs, writeModuleResult, writePage } from "./write.mjs";
import manageHopper from "./hopper.mjs";

//creates the output for either a full page (channeling through wrapper)
//or a single module (which may contain child modules)
//oily runs on server
export async function moduleCompiler(options) {

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

  //if we are on PROD and not in build process
  //for async calls, return either the (presumably) compiled and compressed JSON files
  //for full-page calls, return either the (presumably) compiled and compressed HTML files
  if(process.env.NODE_ENV === "production" && isBuild !== true) {

    let filePath;
    let fourOhFourPath;

    if(isFetch) {
      filePath = `${__basedir}/dist/modules-res${modulePath}.json`;
      fourOhFourPath = `${__basedir}/dist/modules-res/fourOhFour.json`;
    } else {
      filePath = `${__basedir}/dist/pages${modulePath}.html`;
      fourOhFourPath = `${__basedir}/dist/pages/fourOhFour.html`;
    }

    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    } else {
      return fs.readFileSync(fourOhFourPath);
    }
  }

  //if for build, just use what was passed in, else need to construct the full path from URL  
  const adjustedPath = isBuild ? modulePath : `${__basedir}/src/pages${modulePath}.mjs`;
  let bodyMod;

  //if we can't find the module/page that matches the path, use a 404 page/module
  try {
    bodyMod = (await import(adjustedPath)).default;
  } catch(err) {
    bodyMod = (await import(`${__basedir}/src/pages/fourOhFour.mjs`)).default; 
  }

  //get the body module. exit and log if bodyMod is not valid
  // const bodyRes = await bodyMod();
  const bodyRes = typeof bodyMod === "function" ? await bodyMod() : undefined;
  
  //if this function was called as part of a build process
  //write the current compiled page to a JSON file
  //we do this before wrapper is added to the hopper
  if(isBuild) {
    writeModuleResult(req.url, JSON.stringify(p_p.hopper));
  }

  //if we got a full page request, we call wrapper, passing body into it
  if(!isFetch) {
    await wrapperMod(bodyRes.markup, bodyRes.title);
  }

  //write CSS for each module in hopper
  if(Object.keys(p_p.hopper.css).length) {
    Object.keys(p_p.hopper.css).forEach( key => {
      writeCssOrJs(p_p.hopper.css[key], "css", key);
    });
  }

  //write markup for "end result" hopper
  if(Object.keys(p_p.hopper.markup).length && isBuild) {
    writePage(req.url, p_p.hopper.markup);
  }
  
  //write script for each module in hopper
  if(Object.keys(p_p.hopper.script).length) { 
    Object.keys(p_p.hopper.script).forEach( key => {
      writeCssOrJs(p_p.hopper.script[key], "js", key);
    });
  }

  //if we made it this far we are in dev and either we
  //if request is for a module, return the whole hopper/module results
  //else return the full page
  //TODO it likely makes more sense to have dev write and serve from a file
  //it will be slower but may avoid bugs caused by handling dev vs prod differently
  return isFetch ? JSON.stringify(p_p.hopper) : p_p.hopper.markup;

}