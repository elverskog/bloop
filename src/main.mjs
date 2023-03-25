import fs from "fs";
import UglifyJS from "uglify-js";
import brotli from "brotli";
import { processCSS } from "./utils/css-utils.mjs";

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

    if(typeof contentString === "string" && typeof fileType === "string" && typeof moduleName === "string") {

      //brotli compress the css-string
      const buff = Buffer.from(contentString, "utf-8");
      const compressed = brotli.compress(buff, brotliSettings);

      //if on dev, always write the file. else (if on prod) and file doesn't exist, then write the file
      if(process.env.NODE_ENV === "development" || !fileExists) {
        fs.writeFileSync(`${__basedir}/dist/${fileType}/${moduleName}.${fileType}`, compressed);
      }

    } else {
      console.log("compressAndWrite passed invalid values", arguments);
    }

}


function processModule(moduleResult, moduleName) {

  console.log("PROCESS MODULE: ", moduleName);

  //if moduleResult has CSS, process it and write a file to /dist, if file doesn't exist
  if(typeof moduleResult.css === "string" && !fs.existsSync(`${__basedir}/dist/css/${moduleName}.css`)) {
    compressAndWrite(processCSS(moduleResult.css), "css", moduleName);
  }

//process and write markup to /dist


//process and write JS to /dist

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
    p_p.hopper = {
      css: {},
      markup: "",
      script: {}
    }
  },

  addToHopper: async function(moduleResult, moduleName) {

    return;

    console.log("ADD TO HOPPER P_P: ", p_p.hopper);
    // console.log("ADD TO HOPPER: ", moduleName, moduleResult);

    //exit if the moduleResult or moduleName aren't right or if the key already exists
    if (typeof moduleResult !== "object" || typeof moduleName !== "string") return;

    //add the page title, if passed (there should only be one)
    if(typeof moduleResult.title === "string") {
      p_p.hopper.title = moduleResult.title;
    }     

    //process and add CSS///////////////////////////////////////////////////////
    if(typeof moduleResult.css === "string" && !p_p.hopper.css[moduleName]) {
      const processCSS = (await import(`${__basedir}/src/utils/css-utils.mjs`)).processCSS;
      p_p.hopper.css[moduleName] = await processCSS(moduleResult.css);
    }

    //process and add markup////////////////////////////////////////////////////
    //just keep overwriting, as the sequence starts from the bottom (say a button) 
    //and winds up at the request page or module
    //TODO - clean this up so it only writes the returned markup
    if(typeof moduleResult.markup === "string") {
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

      //minify scriptResAll if on production
      if(typeof scriptResAll === "string") {

        //handle writing a minified string on prod
        if(process.env.NODE_ENV === "production") {

          const minifiedscriptResAll = UglifyJS.minify(scriptResAll);
          //minify the JS before we write it to file, if in prod  
          if(typeof minifiedscriptResAll.code === "string") {
            scriptResAll = minifiedscriptResAll.code;
          } else {
            console.log("JS minified error", minifiedScript.error);
          }
            
        }
      
      }

      //add script to hopper
      if(scriptResAll !== "undefined") {
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
export async function moduleOrPageCompiler(options) {

  if(typeof global !== "object") return; 

  const { req, __basedir, isBuild } = options;
  
  //create app to store our global vars in
  global.p_p = {};
  p_p.baseDir = __basedir;
  p_p.isServer = typeof global === "object";
  p_p.req = req;
  
  //add function to write module cotent to files
  p_p.processModule = processModule;

  //add hopper management to p_p and create blank(ish) hopper (see hopper func above)
  p_p.manageHopper = manageHopper;
  //if on production, clear the hopper before we populate it
  //if(process.env.NODE_ENV === "production") {
    p_p.manageHopper.setHopper();  
  //}

  //TODO for now I hardcode "/pages" but we may want to load a module from "/components"
  //or, likely, have all these module calls just go to a "/modules" dir
  //and have the pages just act as routers loading, usually, just one module
  //OR of course it will probably use wrapper.mjs

  const isFetch = req?.headers?.is-fetch;
  //need to account for the homepage (whatever "/" should load)
  const modulePath = req.url === "/" ? "/a" : req.url;
  //need to construct the full path from URL or, if from build, just use what was passed in 
  const adjustedPath = isBuild ? modulePath : `${__basedir}/src/pages${modulePath}.mjs`;
  const moduleName = modulePath.split("/").pop();
  let bodyMod;

  //if we can't find the module/page that matches the path, use a 404 page/module
  try {
    bodyMod = (await import(adjustedPath)).default;
    // console.log("BODY MODULE TRY: ", bodyMod);
  } catch(err) {
    bodyMod = (await import(`${__basedir}/src/pages/fourOhFour.mjs`)).default; 
  }

  // console.log("BODY MODULE: ", bodyMod);
  
  //get the body module
  // const bodyRes = await bodyMod();
  const bodyRes = bodyMod();

  return "xxxxx";

  // // console.log("BODY RESULT: ", bodyRes);

  // //if we got a module-only request, just the requested module to hopper
  // if(isFetch) {
  //   await p_p.manageHopper.addToHopper(await bodyRes, moduleName);
  // } else {
  //   // console.log("IS NOT FETCH");
  //   //else we got a full page request, so we pass body into wrapper
  //   const wrapperMod = (await import(`${__basedir}/src/components/wrapper.mjs`)).default;
  //   //await p_p.manageHopper.addToHopper(await wrapperMod(bodyRes.markup, bodyRes.title), "wrapper");
  //   await wrapperMod(bodyRes.markup, bodyRes.title);
  // }
  
  // //function to compress and write files, in subsection of hopper (css vs js)
  // function compressAndWrite(obj, fileType) {
  //   //loop through object
  //   for(const [key, val] of Object.entries(obj)) {

  //     const fileExists = fs.existsSync(`${__basedir}/dist/${fileType}/${key}.${fileType}`);

  //     if(typeof val === "string") {

  //       //brotli compress the css-string
  //       const buff = Buffer.from(val, "utf-8");
  //       const compressed = brotli.compress(buff, brotliSettings);

  //       //if on dev, write the file. else (if on prod) and file doesn't exist write the file
  //       if(process.env.NODE_ENV === "development" || !fileExists) {
  //         fs.writeFileSync(`${__basedir}/dist/${fileType}/${key}.${fileType}`, compressed);
  //       }
  //     }

  //   }

  // }

  // //write CSS and JS, for each module in hopper
  // //assuming a valid string passed 
  // //and the file does not exist already or in dev mode, overwrite the file
  // if(Object.keys(p_p.hopper.css).length) {
  //   compressAndWrite(p_p.hopper.css, "css");
  // }

  // if(Object.keys(p_p.hopper.script).length) {
  //   compressAndWrite(p_p.hopper.script, "js");
  // }

  // return isFetch ? JSON.stringify(p_p.hopper) : p_p.hopper.markup;

}