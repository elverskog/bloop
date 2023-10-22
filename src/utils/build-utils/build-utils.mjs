//if the command "npm prod" is run, here we run code to build every page found in /pages
//for each page the HTML, CSS and JS for each will be stored in an analogous location in /dist

// import fsExtra from "fs-extra";
import moduleCompiler from "../../moduleCompiler.mjs";


function validateArgsBuild(args) {
  
  const errors = [];
  try { 
    args[0].flat(); } 
  catch(err) { 
    errors.push(err); 
  }
  console.log("BUILD ARGS FAIL: ", errors.length);    
  return (errors.length > 0);

}


export async function build(pagePathsArray) {

  console.log("PAGEPATHSARRAY: ", pagePathsArray);

  if(validateArgsBuild(arguments)) return;

  // return {
  //   css: {},
  //   markup: {},
  //   style: {}
  // };

  // return await moduleCompiler({ url: pagePathsArray[0], isFetch: false, res: null, isBuild: true });

  return Promise.all(pagePathsArray.map( async path => {
    return await moduleCompiler({ url: path, isFetch: false, res: null, isBuild: true });
  }));

  // //if in build mode, clear the JS and CSS directories in /src
  // //so if in prod mode we don't need to keep writing the files on each page serve
  // if (process.env.NODE_ENV === "production") { 
  //   fsExtra.emptyDirSync(`${baseDir}/dist/css`);
  //   fsExtra.emptyDirSync(`${baseDir}/dist/js`);
  //   fsExtra.emptyDirSync(`${baseDir}/dist/pages`);
  //   fsExtra.emptyDirSync(`${baseDir}/dist/modules-res`);
  // }

}


//Note - rework moduleCompiler so that it returns an object with markup, css, js
//have server.js (or whatever) then write files, then return result
//I guess for build...?
//need to decide where/when to write 
