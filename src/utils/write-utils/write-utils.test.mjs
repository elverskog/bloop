import tap from "tap";
import fs from "fs-extra";
import { 
  writeCss, 
  writeJs, 
  writeMarkup, 
  writeModuleResult, 
} from "./write-utils.mjs";
import { clearFiles } from "../dir-utils/dir-utils.mjs";


//WRITE MARKUP TESTS/////////////////////////////////////////////////////////////////////

// TODO: currently these write tests write to the real dist
// not sure how to best handle relative path issues; singleton etc.

tap.test("writeMarkup tests", t => {
 
  clearFiles(["dist/pages-test",]);

  const page = {
    name: "test-markup",
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.match(writeMarkup(page), true, "writeMarkup returned true");
  t.match(fs.existsSync("dist/markup/test-markup.html"), true, "writeMarkup wrote test.mjs");

  clearFiles(["dist/markup/test-markup",]);

  const pageMissingName = {
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.throws(() => writeMarkup(pageMissingName), {
    message: "Error: validateArgs - undefined isn't string"
  }, "pageMissingModulePath");

  t.match(fs.existsSync("src/dist/markup/test-markup.mjs"), false, "writeMarkup failed to write test.mjs because name is missing");

  clearFiles(["dist/markup/test-markup",]);

  const pageMissingMarkup = {
    name: "test-markup"
  };

  t.throws(() => writeMarkup(pageMissingMarkup), {
    message: "Error: validateArgs - undefined isn't string"
  },"pageMissingMarkup");

  t.match(fs.existsSync("src/dist/markup/test-markup.mjs"), false, "writeMarkup failed to write test.mjs because markup is missing");

  clearFiles(["dist/markup/test-markup",]);


  // const pageBadPath = {
  //   modulePath: "blah/pages-test/test.mjs",
  //   markup: `<!DOCTYPE html>
  //   <html>dsfasdf</html>`
  // };

  // t.throws(() => writeMarkup(pageBadPath), {
  //   message: "writePage: page.modulePath not a string or is otherwise invalid"
  // });

  // t.match(fs.existsSync("dist/pages-test/test.html"), false, "writeMarkup failed to write test.mjs as modulePath is invalid");

  t.end();

});


//WRITE CCS TESTS/////////////////////////////////////////////////////////////////////

// tap.test("write CSS tests", t => {
 
//   clearFiles(["dist/css-test"]);

//   const page = {
//     css: [{
//       modulePath: "src/components/test.mjs",
//       val: `
//           .thing { 
//             color: red; 
//           }
//       `
//     }]
//   };

//   t.match(writeCss(page), true, "writeCssOrJs returned true");
//   t.match(fs.existsSync("dist/css/test.css"), true, "writeCssOrJs wrote test.mjs");


//   clearFiles(["dist/css"]);

//   const pageMissingModulePath = {
//     css: [{
//       val: `
//           .thing { 
//             color: red; 
//           }
//       `
//     }]
//   };

//   // t.throws(() => writeCss(pageMissingModulePath), {
//   //   message: "Error: writePage outer - modulePath or val is not a string"
//   // }, "pageMissingModulePath");

//   t.throws(() => writeCss(pageMissingModulePath), Error, `pageMissingModulePath ${ Error }`);


//   t.match(fs.existsSync("dist/css/test.css"), false, "writeCssOrJs should fail to write test.mjs because modulePath is missing");


//   clearFiles(["dist/css"]); //clear files here just in case?

//   const pageMissingVal = {
//     css: [{
//       modulePath: "src/components/test.mjs"
//     }]
//   };

//   t.throws(() => writeCss(pageMissingVal), Error, `pageMissingVal ${ Error }`);

//   t.match(fs.existsSync("dist/css/test.mjs"), false, "writeCssOrJs failed to write test.mjs because css is missing");


//   clearFiles(["dist/css"]);

//   const pageBadPath = {
//     css: [{
//       modulePath: "blah/css-test/test.mjs",
//       val: `
//         .thing { 
//           color: red; 
//         }
//       `
//     }]
//   };

//   t.throws(() => writeCss(pageBadPath), Error, `pageBadPath ${ Error }`);

//   t.match(fs.existsSync("dist/css-test/test.html"), false, "writeCssOrJs failed to write test.mjs as modulePath is invalid");

//   clearFiles(["dist/components/css-test"]);


//   t.end();

// });


// //WRITE JS TESTS/////////////////////////////////////////////////////////////////////

// tap.test("write JS tests", t => {
 
//   const testFunction = function() {};

//   clearFiles(["dist/js-test"]);

//   const page = {
//     js: [{
//       modulePath: "src/components/test.mjs",
//       val: { init: testFunction }
//     }]
//   };

//   t.match(writeJs(page), true, "writeJsOrJs returned true");
//   t.match(fs.existsSync("dist/js/test.js"), true, "writeJsOrJs wrote test.mjs");


//   clearFiles(["dist/js"]);

//   const pageMissingVal = {
//     js: [{
//       modulePath: "src/components/test.mjs"
//     }]
//   };

//   t.match(writeJs(pageMissingVal), true, "writeJsOrJs returned true");

//   t.match(fs.existsSync("dist/js/test.mjs"), false, "writeJsOrJs failed to write test.mjs because js val is missing");

//   clearFiles(["dist/js"]);


//   const pageBadJs = {
//     js: [{
//       modulePath: "src/components/test.mjs",
//       val: { init: "asdfsadf" }
//     }]
//   };

//   t.match(writeJs(pageBadJs), true, "writeJsOrJs returned true");
//   t.match(fs.existsSync("dist/js/test.mjs"), false, "writeJsOrJs failed to write test.mjs because js val is bad");


//   clearFiles(["dist/js"]);


//   const pageBadPath = {
//     js: [{
//       modulePath: "blah/js-test/test.mjs",
//       val: { init: testFunction }
//     }]
//   };

//   t.throws(() => writeCss(pageBadPath), Error, `pageBadPath ${ Error }`);

//   t.match(fs.existsSync("dist/css-test/test.html"), false, "writeCssOrJs failed to write test.mjs as modulePath is invalid");

//   clearFiles(["dist/components/css-test"]);


//   const pageMissingModulePath = {
//     js: [{
//       val: { init: testFunction }
//     }]
//   };

//   t.match(writeJs(pageMissingModulePath), true, "writeJsOrJs returned true");
//   t.match(fs.existsSync("dist/js/test.js"), false, "writeJsOrJs should fail to write test.mjs because modulePath is missing");


//   clearFiles(["dist/js"]); //clear files here just in case?


//   t.end();

// });
