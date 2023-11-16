import tap from "tap";
import fs from "fs-extra";
import { 
  writeDistFile, 
  writeMarkup, 
  writeModuleResult, 
} from "./write-utils.mjs";
import { clearFiles } from "../dir-utils/dir-utils.mjs";

// TODO: currently these write tests write to the real dist
// not sure how to best handle relative path issues; singleton etc.

tap.test("writeMarkup tests", t => {
 
  clearFiles(["dist/pages-test",]);

  const page = {
    modulePath: "src/pages-test/test.mjs",
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.match(writeMarkup(page), true, "writeMarkup returned true");
  t.match(fs.existsSync("dist/pages-test/test.html"), true, "writeMarkup wrote test.mjs");

  clearFiles(["dist/pages-test",]);

  const pageMissingModulePath = {
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.throws(() => writeMarkup(pageMissingModulePath), {
    message: "Error: validateArgs - undefined isn't string"
  }, "pageMissingModulePath");

  t.match(fs.existsSync("src/dist/pages-test/test.mjs"), false, "writeMarkup failed to write test.mjs because modulePath is missing");

  clearFiles(["dist/pages-test",]);

  const pageMissingMarkup = {
    modulePath: "src/pages-test/test.mjs"
  };

  t.throws(() => writeMarkup(pageMissingMarkup), {
    message: "Error: validateArgs - undefined isn't string"
  },"pageMissingMarkup");

  t.match(fs.existsSync("src/dist/pages-test/test.mjs"), false, "writeMarkup failed to write test.mjs because markup is missing");

  clearFiles(["dist/pages-test",]);

  const pageBadPath = {
    modulePath: "blah/pages-test/test.mjs",
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.throws(() => writeMarkup(pageBadPath), {
    message: "writePage: page.modulePath not a string or is otherwise invalid"
  });

  t.match(fs.existsSync("dist/pages-test/test.html"), false, "writeMarkup failed to write test.mjs as modulePath is invalid");

  t.end();

});


tap.test("write CSS tests", t => {
 
  clearFiles(["dist/css-test"]);

  const page = {
    modulePath: "src/css-test/test.mjs",
    css: { 
      thing: `
        .thing { 
          color: red; 
        }
    ` }
  };

  t.match(writeDistFile(page, "css"), true, "writeDistFile returned true");
  t.match(fs.existsSync("dist/css-test/test.css"), true, "writeDistFile wrote test.mjs");


  clearFiles(["dist/css-test"]);

  const pageMissingModulePath = {
    css: { thing: ".thing { color: red; }" }
  };

  t.throws(() => writeDistFile(pageMissingModulePath, "css"), {
    message: "Error: validateArgs - undefined isn't string"
  }, "pageMissingModulePath");

  t.match(fs.existsSync("src/dist/css-test/test.css"), false, "writeDistFile failed to write test.mjs because modulePath is missing");


  clearFiles(["dist/css-test"]);

  const pageMissingCss = {
    modulePath: "src/css-test/test.mjs"
  };

  t.throws(() => writeDistFile(pageMissingCss, "css"), {
    message: "Error: validateArgs - undefined isn't object"
  },"pageMissingCss");

  t.match(fs.existsSync("src/dist/css-test/test.mjs"), false, "writeDistFile failed to write test.mjs because css is missing");


  clearFiles(["dist/css-test"]);

  const pageBadPath = {
    modulePath: "blah/css-test/test.mjs",
    css: { 
      thing: `
        .thing { 
          color: red; 
        }
    ` }
  };

  t.throws(() => writeDistFile(pageBadPath, "css"), {
    message: "writePage: page.modulePath not a string or is otherwise invalid"
  });

  t.match(fs.existsSync("dist/css-test/test.html"), false, "writeDistFile failed to write test.mjs as modulePath is invalid");

  clearFiles(["dist/css-test"]);

  t.end();

});





