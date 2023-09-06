//manageHopper creates and manages a temporary object "hopper" that stores the CSS, markup and JS, for the request of a:
//page - for when the site/app is loaded for the first time, going to a specific pathname
//module - for fetching a new part of the UI, often by a pathname/page change (loadinga new page SPA style) or for getting some new UI element or feature
//in both cases all the child modules (say a field or button module) need to be loaded into the hopper
//hence returning all the CSS and JS needed for said page or module (html is just concated in the string literal)
//whenever a page or module's "compile" is completed, the hopper should be cleared 
//it only should run on server
import UglifyJS from "uglify-js";
import { processCSS } from "./utils/css-utils.mjs";


export default {

  setHopper: function() {
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

    //exit if the moduleResult or moduleName aren't right or if the key already exists
    if (typeof moduleResult !== "object" || typeof moduleName !== "string") return;

    //add the page title, if passed (there should only be one)
    if(typeof moduleResult.title === "string") {
      p_p.hopper.title = moduleResult.title;
    }     

    //process and add CSS///////////////////////////////////////////////////////
    if(typeof moduleResult.css === "string" && !p_p.hopper.css[moduleName]) {
      const cssProcessed = processCSS(moduleResult.css);
      p_p.hopper.css[moduleName] = cssProcessed;
    }

    //process and add markup////////////////////////////////////////////////////
    //just keep overwriting, as the sequence starts from the bottom (say a button) 
    //and winds up at the request page or module
    //TODO - clean this up so it only writes the returned markup AND have it write to file as well
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

      //minify (remove breaks etc) the JS before we write it to file, if in prod  
      if(typeof scriptResAll === "string" && process.env.NODE_ENV === "production") {
        const minifiedScriptResAll = UglifyJS.minify(scriptResAll);
        if(typeof minifiedScriptResAll.code === "string") {
          scriptResAll = minifiedScriptResAll.code;
        } else {
          console.log("JS minified error", moduleName, "\n", minifiedScriptResAll.error);
          console.log("JS minified error", moduleName, "\n", scriptResAll);
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

    //console.log("HOPPER", p_p.hopper);

    return;

  }

}