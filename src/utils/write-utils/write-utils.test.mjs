import tap from "tap";
import fs from "fs-extra";
import { 
  writeMarkup, 
  writeCss,
  writeJs
  // writeModuleResult, 
} from "./write-utils.mjs";
import { clearFiles } from "../dir-utils/dir-utils.mjs";


//WRITE MARKUP TESTS/////////////////////////////////////////////////////////////////////

// TODO: currently these write tests write to the real dist
// not sure how to best handle relative path issues; singleton etc.

tap.test("writeMarkup tests", t => {
 
  clearFiles(["dist/pages-test",]);

  const page = {
    modulePath: "src/markup/test-markup.mjs",
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
    modulePath: "src/markup/test-markup.mjs",
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
 
  clearFiles(["dist/css-test"]);

  const page = {
    css: [{
      modulePath: "src/components/test.mjs",
      val: `
          .thing { 
            color: red; 
          }
      `
    }]
  };

  t.match(writeCss(page), true, "writeCssOrJs returned true");
  t.match(fs.existsSync("dist/css/test.css"), true, "writeCssOrJs wrote test.mjs");

  clearFiles(["dist/css"]);

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
 
  clearFiles(["dist/js-test"]);

  const page = {
    js: [{
      name: "test",
      modulePath: "src/components/test.mjs",
      val: "{ init: testFunction }"
    }]
  };

  t.match(writeJs(page), true, "writeJs returned true");
  t.match(fs.existsSync("dist/js/test.js"), true, "writeJs wrote test.js");

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
