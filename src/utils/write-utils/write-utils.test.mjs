import tap from "tap";
import fs from "fs-extra";
import { 
  writeCss, 
  writeMarkup, 
  writeModuleResult, 
} from "./write-utils.mjs";
import { clearFiles } from "../dir-utils/dir-utils.mjs";


//WRITE MARKUP TESTS/////////////////////////////////////////////////////////////////////

// TODO: currently these write tests write to the real dist
// not sure how to best handle relative path issues; singleton etc.

// tap.test("writeMarkup tests", t => {
 
//   clearFiles(["dist/pages-test",]);

//   const page = {
//     modulePath: "src/pages-test/test.mjs",
//     markup: `<!DOCTYPE html>
//     <html>dsfasdf</html>`
//   };

//   t.match(writeMarkup(page), true, "writeMarkup returned true");
//   t.match(fs.existsSync("dist/pages-test/test.html"), true, "writeMarkup wrote test.mjs");

//   clearFiles(["dist/pages-test",]);

//   const pageMissingModulePath = {
//     markup: `<!DOCTYPE html>
//     <html>dsfasdf</html>`
//   };

//   t.throws(() => writeMarkup(pageMissingModulePath), {
//     message: "Error: validateArgs - undefined isn't string"
//   }, "pageMissingModulePath");

//   t.match(fs.existsSync("src/dist/pages-test/test.mjs"), false, "writeMarkup failed to write test.mjs because modulePath is missing");

//   clearFiles(["dist/pages-test",]);

//   const pageMissingMarkup = {
//     modulePath: "src/pages-test/test.mjs"
//   };

//   t.throws(() => writeMarkup(pageMissingMarkup), {
//     message: "Error: validateArgs - undefined isn't string"
//   },"pageMissingMarkup");

//   t.match(fs.existsSync("src/dist/pages-test/test.mjs"), false, "writeMarkup failed to write test.mjs because markup is missing");

//   clearFiles(["dist/pages-test",]);

//   const pageBadPath = {
//     modulePath: "blah/pages-test/test.mjs",
//     markup: `<!DOCTYPE html>
//     <html>dsfasdf</html>`
//   };

//   t.throws(() => writeMarkup(pageBadPath), {
//     message: "writePage: page.modulePath not a string or is otherwise invalid"
//   });

//   t.match(fs.existsSync("dist/pages-test/test.html"), false, "writeMarkup failed to write test.mjs as modulePath is invalid");

//   t.end();

// });


//WRITE CCS TESTS/////////////////////////////////////////////////////////////////////

tap.test("write CSS tests", t => {
 
  clearFiles(["dist/css-test"]);

  const page = {
    css: [{
      modulePath: "src/components/css-test/test.mjs",
      val: `
          .thing { 
            color: red; 
          }
      `
    }]
  };

  t.match(writeCss(page), true, "writeCssOrJs returned true");
  t.match(fs.existsSync("dist/components/css-test/test.css"), true, "writeCssOrJs wrote test.mjs");


  clearFiles(["dist/css/css-test"]);

  const pageMissingModulePath = {
    css: [{
      val: `
          .thing { 
            color: red; 
          }
      `
    }]
  };

  t.throws(() => writeCss(pageMissingModulePath), {
    message: "Error: validateArgs - undefined isn't string"
  }, "pageMissingModulePath");

  t.match(fs.existsSync("dist/components/css-test/test.css"), false, "writeCssOrJs should fail to write test.mjs because modulePath is missing");


  clearFiles(["dist/css/css-test"]);

  const pageMissingCss = {
    css: [{
      modulePath: "src/css-test/test.mjs"
    }]
  };

  t.throws(() => writeCss(pageMissingCss), {
    message: "Error: validateArgs - undefined isn't object"
  },"pageMissingCss");

  t.match(fs.existsSync("dist/css-test/test.mjs"), false, "writeCssOrJs failed to write test.mjs because css is missing");


  clearFiles(["dist/css/css-test"]);


  const pageBadPath = {
    css: [{
      modulePath: "blah/css-test/test.mjs",
      val: `
        .thing { 
          color: red; 
        }
      `
    }]
  };

  t.throws(() => writeCss(pageBadPath), {
    message: "writePage: page.modulePath not a string or is otherwise invalid"
  });

  t.match(fs.existsSync("dist/css-test/test.html"), false, "writeCssOrJs failed to write test.mjs as modulePath is invalid");

  clearFiles(["dist/css-test"]);


  t.end();

});


//WRITE JS TESTS/////////////////////////////////////////////////////////////////////

// tap.test("write JS tests", t => {
 
//   clearFiles(["dist/js-test"]);

//   const page = {
//     modulePath: "src/js-test/test.mjs",
//     js: { 
//       args: { someVal: "someVal" },
//       thing: function (args) {
//         console.log("something", args.someVal);
//       }
//     }
//   };

//   t.match(writeCssOrJs(page, "js"), true, "writeCssOrJs returned true");
//   t.match(fs.existsSync("dist/js-test/test.js"), true, "writeCssOrJs wrote test.mjs");


//   clearFiles(["dist/js-test"]);

//   const pageMissingModulePath = {
//     js: { thing: ".thing { color: red; }" }
//   };

//   t.throws(() => writeCssOrJs(pageMissingModulePath, "js"), {
//     message: "Error: validateArgs - undefined isn't string"
//   }, "pageMissingModulePath");

//   t.match(fs.existsSync("src/dist/js-test/test.js"), false, "writeCssOrJs failed to write test.mjs because modulePath is missing");


//   clearFiles(["dist/js-test"]);

//   const pageMissingJs = {
//     modulePath: "src/js-test/test.mjs"
//   };

//   t.throws(() => writeCssOrJs(pageMissingJs, "js"), {
//     message: "Error: validateArgs - undefined isn't object"
//   },"pageMissingJs");

//   t.match(fs.existsSync("src/dist/js-test/test.mjs"), false, "writeCssOrJs failed to write test.mjs because js is missing");


//   clearFiles(["dist/js-test"]);


//   const pageBadPath = {
//     modulePath: "blah/js-test/test.mjs",
//     js: { 
//       args: { someVal: "someVal" },
//       thing: function (args) {
//         console.log("something", args.someVal);
//       }
//     }
//   };

//   t.throws(() => writeCssOrJs(pageBadPath, "js"), {
//     message: "writePage: page.modulePath not a string or is otherwise invalid"
//   });

//   t.match(fs.existsSync("dist/js-test/test.html"), false, "writeCssOrJs failed to write test.mjs as modulePath is invalid");

//   clearFiles(["dist/js-test"]);


//   t.end();

// });




