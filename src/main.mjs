import fs from "fs";
import UglifyJS from "uglify-js";

//manageHopper creates and manages a temporary object "hopper" that stores the CSS, markup and JS, for the request of a:
//page - for when the site/app is loaded for the first time, going to a specific pathname
//module - for fetching a new part of the UI, often by a pathname/page change (loadinga new page SPA style) or for getting some new UI element or feature
//in both cases all the child modules (say a field or button module) need to be loaded into the hopper
//hence returning all the CSS and JS needed for said page or module (html is just concated in the string literal)
//whenever a page or module's "compile" is completed, the hopper should be cleared 
//it only should run on server
export const manageHopper = function() {

  if (typeof global !== "object" ) return;

  return {

    setHopper: function() {
      p_p.hopper = {
        css: {},
        markup: "",
        script: {}
      }
    },

    addToHopper: async function(moduleResult, moduleName) {

      //exit if the moduleResult or moduleName aren't right
      if (typeof moduleResult !== "object" || typeof moduleName !== "string") return;

      //add the title
      if(typeof moduleResult.title === "string") {
        p_p.hopper.title = moduleResult.title;
      }     

      //process and add CSS///////////////////////////////////////////////////////
      if(typeof moduleResult.css === "string") {
        const processCSS = (await import(`${__basedir}/src/utils/css-utils.mjs`)).processCSS;
        p_p.hopper.css[moduleName] = processCSS(moduleResult.css);
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

          //set var for the stringified list of the functions in the script object
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

}

//creates the output for either a full page (channeling through wrapper)
//or a single module (which may contain child modules)
//oily runs on server
export const moduleOrPageCompiler = async function(options) {

  if(typeof window === "object") return; 

  const { req, __basedir } = options;
  
  //create app to store our global vars in
  global.p_p = {};
  p_p.baseDir = __basedir;
  p_p.isServer = typeof global === "object";
  p_p.req = req;
  
  //add hopper management to p_p and create blank(ish) hopper (see hopper func above)
  p_p.manageHopper = manageHopper();
  // clear the hopper before we populate it
  p_p.manageHopper.setHopper();  

  //TODO for now I hardcode "/pages" but we may want to load a module from "/components"
  //or, likely, have all these module calls just go to a "/modules" dir
  //and have the pages just act as routers loading, usually, just one module
  //OR of course it will probably use wrapper.mjs

  const isFetch = req?.headers["is-fetch"]
  const modulePath = req.url === "/" ? "/a" : req.url;
  const moduleName = modulePath.split("/").pop();

  let bodyMod;

  //if we can't find the module/page that matches the path, use a 404 page/module
  try {
    console.log("test: ", `${__basedir}/src/pages${modulePath}.mjs`);
    bodyMod = (await import(`${__basedir}/src/pages${modulePath}.mjs`)).default;
  } catch(err) {
    bodyMod = (await import(`${__basedir}/src/pages/fourOhFour.mjs`)).default; 
  }

  //get the body module and add it to hopper
  const bodyRes = await bodyMod();
  await p_p.manageHopper.addToHopper(await bodyRes, moduleName);

  //if we got a full page request, we need to pass body into wrapper and add wrapper to hopper
  if(!isFetch) {
    const wrapperMod = (await import(`${__basedir}/src/components/wrapper.mjs`)).default;
    await p_p.manageHopper.addToHopper(await wrapperMod(bodyRes.markup, bodyRes.title), "wrapper");
  }
  
  //write CSS and JS, for each module in hopper
  //assuming a valid string passed 
  //and the file does not exist already or in dev mode, overwrite the file
  if(Object.keys(p_p.hopper.css).length) {
    for(const [key, val] of Object.entries(p_p.hopper.css)) {
      const fileExists = fs.existsSync(`${__basedir}/dist/css/${key}.css`);
      //console.log("ENV: ", process.env.NODE_ENV);
      if(typeof val === "string" && (!fileExists || process.env.NODE_ENV)) {
        fs.writeFileSync(`${__basedir}/dist/css/${key}.css`, val);
      }
    }
  }

  if(Object.keys(p_p.hopper.script).length) {
    for(const [key, val] of Object.entries(p_p.hopper.script)) {
      const fileExists = fs.existsSync(`${__basedir}/dist/js/${key}.js`);
      if(typeof val === "string" && (!fileExists || process.env.NODE_ENV)) {
        //minify the JS before we write it to file
        var minifiedVal = UglifyJS.minify(val);
        if(typeof minifiedVal.code === "string") {
          fs.writeFileSync(`${__basedir}/dist/js/${key}.js`, minifiedVal.code);
        } else {
          console.log("JS minified error", minifiedVal.error);
        }
      }
    }
  }

  return isFetch ? JSON.stringify(p_p.hopper) : p_p.hopper.markup;

}