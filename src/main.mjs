import fs from "fs";
import UglifyJS from "uglify-js";
import brotli from "brotli";
import { processCSS } from "./utils/css-utils.mjs";
import wrapperMod from "./components/wrapper.mjs";


//settings for brotli compression - TODO adjust these settings
const brotliSettings = {
  extension: 'css',
  skipLarger: true,
  mode: 1, // 0 = generic, 1 = text, 2 = font (WOFF2)
  quality: 10, // 0 - 11,
  lgwin: 12 // default
};


//function to compress and write files, in subsection of hopper (css vs js)
function compressAndWrite(contentString, fileType, moduleName) {

  //if in PROD, exit if the file exists (on dev always write the file)
  if(process.env.NODE_ENV === "production" && fs.existsSync(`${__basedir}/dist/${fileType}/${moduleName}.${fileType}`)) return;

  console.log("MADE IT PAST FILE EXISTS CHECK");

  if(typeof contentString === "string" && typeof fileType === "string" && typeof moduleName === "string") {

    //brotli compress the css-string
    const buff = Buffer.from(contentString, "utf-8");
    const compressed = brotli.compress(buff, brotliSettings);
    //const compressed = contentString;

    fs.writeFileSync(`${__basedir}/dist/${fileType}/${moduleName}.${fileType}`, compressed);

  } else {
    console.log("compressAndWrite passed invalid values", arguments);
  }

}


//function to compress and write files, in subsection of hopper (css vs js)
function compressAndWritePage(modulePath, content) {

  if(typeof modulePath === "string" && typeof content === "string") {

    //change path of module to that of where we should store the page in /dist
    const pagePath = modulePath.replace("src", "dist").replace("mjs", "json");

    //if in PROD, exit if the file exists (on dev always write the file)
    if(process.env.NODE_ENV === "production" && fs.existsSync(pagePath)) return;

    //console.log(">>>> WRITE PAGE", pagePath, content);

    //if the dirs in the path don't exist create them
    const pageDirPath = pagePath.split("/").slice(0, -1).join("/").toString();

    console.log(">>>> PAGE DIR PATH", pageDirPath);
    console.log(">>>> PAGE DIR PATH EXISTS", fs.existsSync(pageDirPath));

    if(!fs.existsSync(pageDirPath)) {
      console.log(">>>> CREATE DIR", pageDirPath);
      fs.mkdirSync(pageDirPath, { recursive: true });
    }

    //brotli compress the css-string
    //const buff = Buffer.from(content, "utf-8");
    //const compressed = brotli.compress(buff, brotliSettings);
    const compressed = content;

    fs.writeFileSync(pagePath, compressed);

  } else {
    console.log("compressAndWrite passed invalid page content", modulePath);
  }

}


//manageHopper creates and manages a temporary object "hopper" that stores the CSS, markup and JS, for the request of a:
//page - for when the site/app is loaded for the first time, going to a specific pathname
//module - for fetching a new part of the UI, often by a pathname/page change (loadinga new page SPA style) or for getting some new UI element or feature
//in both cases all the child modules (say a field or button module) need to be loaded into the hopper
//hence returning all the CSS and JS needed for said page or module (html is just concated in the string literal)
//whenever a page or module's "compile" is completed, the hopper should be cleared 
//it only should run on server
export const manageHopper = {

  setHopper: function() {
    console.log("SET HOPPER");
    p_p.hopper = {
      css: {},
      markup: "",
      script: {},
    }
  },

  //add a modules result (CSS, markup and JS) to an object
  //this is meant to work for one HTTP request at a time; a full page or a module call 
  addToHopper: async function(moduleResult, moduleName) {

    //if we are in DEV or isBuild is true, don't add anything to the hopper
    //because, presumably, the files needed have all been written to /dist
    //if(process.env.NODE_ENV === "production" || !isBuild) return;

    // console.log("ADD TO HOPPER: ", moduleName, moduleResult);

    //exit if the moduleResult or moduleName aren't right or if the key already exists
    if (typeof moduleResult !== "object" || typeof moduleName !== "string") return;

    //add the page title, if passed (there should only be one)
    if(typeof moduleResult.title === "string") {
      p_p.hopper.title = moduleResult.title;
    }     

    //process and add CSS///////////////////////////////////////////////////////
    if(typeof moduleResult.css === "string" && !p_p.hopper.css[moduleName]) {
      console.log("ADD CSS TO HOPPER: ", moduleName);
      const cssProcessed = processCSS(moduleResult.css);
      p_p.hopper.css[moduleName] = cssProcessed;
    }

    //process and add markup////////////////////////////////////////////////////
    //just keep overwriting, as the sequence starts from the bottom (say a button) 
    //and winds up at the request page or module
    //TODO - clean this up so it only writes the returned markup AND have it write to file as well
    if(typeof moduleResult.markup === "string") {
      console.log("ADD MARKUP TO HOPPER: ", moduleName);
      p_p.hopper.markup = moduleResult.markup;
    }

    //process and add script////////////////////////////////////////////////////

    //set var for the totallity of what will be put in this script for the current module
    //including init calls
    let scriptResAll = "";
    
    //if it has been added, still add any init functions (for event listeners for repeated modules etc)
    if(typeof moduleResult.script === "object") {

      //don't add script if it's module (by key/name) doesn't exist in hopper already
      if(typeof p_p.hopper.script[moduleName] === "undefined") {

        console.log("ADD JS TO HOPPER: ", moduleName);
        
        //loop through scripts and add a stringified function in the script object, for the given key
        let scripts = "";
              
        for(const [key, val] of Object.entries(moduleResult.script)) {
          scripts += `${key}: ${val.toString()},\n`;
        }

        //assign the result to a var (for now) so we can access it
        //for now the variable (when loaded in browser) adds that var to window
        scriptResAll = `window.p_p.${moduleName} = {\n${scripts}\n}`;

      }

      //even if (main) script for the module was already added,
      //add call to init function if a function named init exists (add initArgs if also declared in moduleResult) 
      if(typeof moduleResult.script.init ==="function") {
        const initArgs = typeof moduleResult.initArgs === "object" ? JSON.stringify(moduleResult.initArgs) : "";
        scriptResAll += `\n p_p.${moduleName}.init(${initArgs});` 
      }

      //minify (remove breaks etc) the JS before we write it to file, if in prod  
      if(typeof scriptResAll === "string" && process.env.NODE_ENV === "production") {
        const minifiedscriptResAll = UglifyJS.minify(scriptResAll);
        if(typeof minifiedscriptResAll.code === "string") {
          scriptResAll = minifiedscriptResAll.code;
        } else {
          console.log("JS minified error", minifiedScript.error);
        }
      }

      //add script to hopper
      if(typeof scriptResAll === "string") {
        //if the node/key exists, add to it, else create it  
        if(typeof p_p.hopper.script[moduleName] === "string") {
          p_p.hopper.script[moduleName] += scriptResAll;
        } else {
          p_p.hopper.script[moduleName] = scriptResAll;
        }
      }

    }

    return;

  }

}


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
  
  //if we are in DEV or isBuild is true, set/clear the hopper before we populate it
  //meaning for dev write the modules in "realtime" for prod we already wrote them during build
  //so don't clear and don't write files
  //if(process.env.NODE_ENV === "development" || isBuild) {
    //p_p.manageHopper.setHopper();  
  //}

  //if(isPage) {
    p_p.manageHopper.setHopper();  
  //}

  //TODO for now I hardcode "/pages" but we may want to load a module from "/components"
  //or, likely, have all these module calls just go to a "/modules" dir
  //and have the pages just act as routers loading, usually, just one module
  //OR of course it will probably use wrapper.mjs

  //need to account for the homepage (whatever "/" should load)
  const modulePath = req.url === "/" ? "/a" : req.url;

  console.log("IS BUILD: ", isBuild);
  console.log("IS FETCH: ", isFetch);
  console.log("NODE_ENV: ", process.env.NODE_ENV);

  //if we are on PROD and not in build process
  //just return the (presumably) compiled and compressed JSON files
  if(process.env.NODE_ENV === "production" && isBuild !== true && isFetch) {
    console.log("RETURN JSON FILE");
    return fs.readFileSync(`${__basedir}/dist/pages${modulePath}.json`);
  }

  //if for build, just use what was passed in, else need to construct the full path from URL  
  const adjustedPath = isBuild ? modulePath : `${__basedir}/src/pages${modulePath}.mjs`;
  let bodyMod;

  //if we can't find the module/page that matches the path, use a 404 page/module
  try {
    bodyMod = (await import(adjustedPath)).default;
    // console.log("BODY MODULE TRY: ", bodyMod);
  } catch(err) {
    bodyMod = (await import(`${__basedir}/src/pages/fourOhFour.mjs`)).default; 
    //console.log("------BODY MODULE NOT VALID: ", bodyMod);
    return;
  }

  //get the body module. exit and log if bodyMod is not valid
  // const bodyRes = await bodyMod();
  const bodyRes = typeof bodyMod === "function" ? await bodyMod() : undefined;
  
  //if this function got got as part of a build process
  //write the current compiled page to a JSON file
  //we do this before wrapper is added to the hopper
  if(isBuild) {
    compressAndWritePage(req.url, JSON.stringify(p_p.hopper));
  }

  //console.log("------TYPEOF BODY RES: ", typeof bodyRes);

  //if we got a full page request, we call wrapper, passing body into it
  if(!isFetch) {
    await wrapperMod(bodyRes.markup, bodyRes.title);
  }

  //write CSS for each module in hopper
  if(Object.keys(p_p.hopper.css).length) {
    Object.keys(p_p.hopper.css).forEach( key => {
      compressAndWrite(p_p.hopper.css[key], "css", key);
    });
  }

  //write script for each module in hopper
  if(Object.keys(p_p.hopper.script).length) { 
    Object.keys(p_p.hopper.script).forEach( key => {
      compressAndWrite(p_p.hopper.script[key], "js", key);
    });
  }

  return isFetch ? JSON.stringify(p_p.hopper) : p_p.hopper.markup;

}