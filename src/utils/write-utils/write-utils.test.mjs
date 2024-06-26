import tap from "tap";
import fs from "fs-extra";
import { 
  write,
  writeMarkup, 
  writeCss,
  writeJs
  // writeModuleResult, 
} from "./write-utils.mjs";
import { clearFiles } from "../dir-utils/dir-utils.mjs";


function makeString(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}



// WRITE (GENERIC) TESTS ////////////////////////////////////////////////////////////////

tap.test("write tests", t => {
 
  t.match(write(makeString(333), "dist/markup/test-file.txt", false), true, "write with valid args returned true");
  t.match(fs.existsSync("dist/markup/test-file.txt"), true, "write wrote test-file.txt");

  clearFiles(["dist/markup",]);

  //////////////////////////////////////////////
 
  t.match(write(makeString(333), "dist/test/test-file.txt", false), true, "write with new dir returned true");
  t.match(fs.existsSync("dist/test/test-file.txt"), true, "write wrote test-file.txt in new dir");

  clearFiles(["dist/test",]);

  //////////////////////////////////////////////

  t.throws(() => write(), Error("validateArgsArgs arg argument did not have any elements"));

  t.throws(() => write(makeString(333)), Error("validateArgsArgs - args length does not match types length"));

  t.throws(() => write(null, "dist/markup/test-file.txt", false), Error("[object Null] is not string"));

  t.throws(() => write(makeString(333), null, false), Error("[object Null] is not string"));

  t.end();

});





//WRITE MARKUP TESTS/////////////////////////////////////////////////////////////////////

// TODO: currently these write tests write to the real dist
// not sure how to best handle relative path issues; singleton etc.

tap.test("writeMarkup tests", t => {
 
  clearFiles(["dist/pages-test",]);

  const page = {
    modulePath: "test-markup",
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.match(writeMarkup(page), true, "writeMarkup returned true");
  t.match(fs.existsSync("dist/markup/test-markup.html"), true, "writeMarkup wrote test.mjs");

  clearFiles(["dist/markup",]);

  //////////////////////////////////////////////

  const pageMissingModulePath = {
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.throws(() => writeMarkup(pageMissingModulePath), Error("validateArgsArgs - [object Undefined] is not string"));

  t.match(fs.existsSync("src/dist/markup/test-markup.mjs"), false, "writeMarkup failed to write; name is missing");

  //////////////////////////////////////////////

  const pageMissingMarkup = {
    modulePath: "test-markup",
  };

  t.throws(() => writeMarkup(pageMissingMarkup), Error("validateArgsArgs - [object Undefined] is not string"));

  t.match(fs.existsSync("src/dist/markup/test-markup.mjs"), false, "writeMarkup failed to write; markup is missing");

  //////////////////////////////////////////////

  const pageBadModulePath = {
    modulePath: null,
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.throws(() => writeMarkup(pageBadModulePath), Error("validateArgsArgs - [object Null] is not string"));

  t.end();

});


//WRITE CCS TESTS/////////////////////////////////////////////////////////////////////

tap.test("write CSS tests", t => {
 
  clearFiles(["dist/css"]);

  const page = {
    css: [{
      modulePath: "test-css.mjs",
      val: `
          .thing { 
            color: red; 
          }
      `
    }]
  };

  t.match(writeCss(page), true, "writeCss returned true");
  t.match(fs.existsSync("dist/css/test-css.css"), true, "writeCss wrote test-css");

  // clearFiles(["dist/css"]);

  //////////////////////////////////////////////

  const pageMissingModulePath = {
    css: [{
      val: `
          .thing { 
            color: red; 
          }
      `
    }]
  };

  t.throws(() => writeCss(pageMissingModulePath), Error, `pageMissingModulePath ${ Error }`);
  t.match(fs.existsSync("dist/css/test.css"), false, "writeCssOrJs should fail to write; modulePath is missing");

  //////////////////////////////////////////////

  const pageMissingVal = {
    css: [{
      modulePath: "src/components/test.mjs"
    }]
  };

  t.throws(() => writeCss(pageMissingVal), Error, `pageMissingVal ${ Error }`);
  t.match(fs.existsSync("dist/css/test.mjs"), false, "writeCssOrJs failed to write test.mjs; css is missing");

  // //////////////////////////////////////////////

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

  t.throws(writeCss(pageBadPath), Error, `pageBadPath ${ Error }`);
  t.match(fs.existsSync("dist/css-test/test.css"), false, "writeCssOrJs failed to write; modulePath is invalid");

  t.end();

});


//WRITE JS TESTS/////////////////////////////////////////////////////////////////////

tap.test("write JS tests", t => {
 
  clearFiles(["dist/js"]);

  const page = {
    js: [{
      name: "test",
      modulePath: "test-js.mjs",
      val: "{ init: testFunction }"
    }]
  };

  t.match(writeJs(page), true, "writeJs returned true");
  t.match(fs.existsSync("dist/js/test-js.js"), true, "writeJs wrote test.js");

  clearFiles(["dist/js"]);

  //////////////////////////////////////////////

  const pageMissingVal = [{
    js: [{
      modulePath: "src/components/test.mjs"
    }]
  }];

  t.throws(() => writeJs(pageMissingVal), Error("validateArgsArgs - [object Undefined] is not array"));
  t.match(fs.existsSync("dist/js/test.js"), false, "writeJsOrJs failed to write test.mjs because js val is missing");

  //////////////////////////////////////////////

  const pageBadJs = {
    js: [{
      modulePath: "src/components/test.mjs",
      val: null
    }]
  };

  t.throws(() => writeJs(pageBadJs), Error("writeJs passed invalid page object"), "writeJs passed invalid page object");
  t.match(fs.existsSync("dist/js/test.mjs"), false, "writeJsOrJs failed to write test.mjs because js val is bad");

  //////////////////////////////////////////////

  const pageBadPath = {
    js: [{
      modulePath: "blah/js-test/test.mjs",
      val: "{ init: testFunction }"
    }]
  };

  // console.log(writeJs(pageBadPath));

  t.throws(() => writeJs(pageBadPath), Error("1. writeJS failed because scriptAsString or savePath invalid"), "writeJs passed invalid page object");
  t.match(fs.existsSync("dist/css-test/test.html"), false, "writeCssOrJs failed to write test.mjs as modulePath is invalid");

  //////////////////////////////////////////////

  const pageMissingModulePath = {
    js: [{
      val: "{ init: testFunction }"
    }]
  };

  t.throws(() => writeJs(pageMissingModulePath), Error, "writeJs passed invalid page object");
  t.match(fs.existsSync("dist/js/test.js"), false, "writeJsOrJs should fail to write test.mjs because modulePath is missing");

  //////////////////////////////////////////////

  t.end();

});
