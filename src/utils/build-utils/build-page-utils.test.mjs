import tap from "tap";
import { validateModuleRes, buildPage } from "./build-page-utils.mjs";


tap.test("build-page-utils.validateModuleRes tests", async t => {

  t.match(validateModuleRes({
    name: "name",
    css: "{ color: #ff0000 }",
    markup: "<div>markup</div>",
  }), true, "validateModuleRes should return true if passed a valid module result");

  t.rejects(() => validateModuleRes(
    "xxx"
  ), Error, "validateModuleRes should throw error if module does not return an object");

  t.rejects(() => validateModuleRes({
    name: {},
    css: "{ color: #ff0000 }",
    markup: "<div>markup</div>",
  }), Error, "validateModuleRes should throw error if module does not return a name as string");

  t.rejects(() => validateModuleRes({
    name: "name",
    css: {},
    markup: "<div>markup</div>",
  }), Error, "validateModuleRes should throw error if module does not return css as string");

  t.rejects(() => validateModuleRes({
    name: "name",
    css: "{ color: #ff0000 }",
    markup: {},
  }), Error, "validateModuleRes should throw error if module does not return markup as string");

  t.rejects(() => validateModuleRes({
    name: "name",
    css: "{ color: #ff0000 }",
    markup: "<div>markup</div>",
    title: {},
    js: { init: function() { console.log("hello"); } },
    initArgs: { a: "sdfsd" },
  }), Error, "validateModuleRes should throw error if module does not return title as string (if title is returned at all)");

  t.rejects(() => validateModuleRes({
    name: "name",
    css: "{ color: #ff0000 }",
    markup: "<div>markup</div>",
    title: {},
    js: "",
    initArgs: { a: "sdfsd" },
  }), Error, "validateModuleRes should throw error if module does not return js as string (if js is returned at all)");

  t.rejects(() => validateModuleRes({
    name: "name",
    css: "{ color: #ff0000 }",
    markup: "<div>markup</div>",
    title: {},
    js: { init: function() { console.log("hello"); } },
    initArgs: "",
  }), Error, "validateModuleRes should throw error if module does not return initArgs as string (if initArgs is returned at all)");

  t.end();

});

/////////////////////////////////////////////////////////////////////////////

tap.test("build-page-utils should return a valid object under certain conditions", async t => {

  const resultAllGood = await buildPage({ path: "src/utils/build-utils/mocks/mock-page.mjs", isFetch: false, isProd: true });

  t.match(resultAllGood, {
    modulePath: String,
    name: String,
    css: Object,
    markup: String,
    js: Object
  }, "buildPage result object should have css, markup, style");

  const resultNoTitle = await buildPage({ path: "src/utils/build-utils/mocks/mock-page-no-title.mjs", isFetch: false, isProd: true });

  t.match(resultNoTitle, {
    modulePath: String,
    name: String,
    css: Object,
    markup: String,
    js: Object
  }, "buildPage result object should have css, markup, style");

  t.end();

});

/////////////////////////////////////////////////////////////////////////////

tap.test("build, when returned invalid result, should throw an error", async t => {

  t.rejects(() => buildPage({ path: "src/utils/build-utils/mocks/mock-page-bad-function.mjs", isFetch: false, isProd: true }), Error, "build-utils should throw error if module does not return anything");

  t.rejects(() => buildPage({ path: "src/utils/build-utils/mocks/mock-page-no-name.mjs", isFetch: false, isProd: true }), Error, "build-utils should throw error if module does not return a name");

  t.rejects(() => buildPage({ path: "src/utils/build-utils/mocks/mock-page-bad-title.mjs", isFetch: false, isProd: true }), Error, "build-utils should throw error if module does not return a title as a string");

  t.end();

});

/////////////////////////////////////////////////////////////////////////////

tap.test("build, when passed an invalid options obj, should throw an error", async t => {

  const path = "src/utils/build-utils/mocks/mock-page.mjs";

  t.rejects(() => buildPage(), Error, "build-page-utils should throw error if passed no arg");

  t.rejects(() => buildPage({}), Error, "build-page-utils should throw error if passed empty object");

  t.rejects(() => buildPage({ path, isFetch: false, isProd: "sdfs" }), Error, "build-page-utils should throw error if isProd not a boolean");

  t.rejects(() => buildPage({ path, isFetch: "", isProd: false }), Error, "build-page-utils should throw error if isFetch not a boolean");

  t.rejects(() => buildPage({ path: null, isFetch: false, isProd: false }), Error, "build-page-utils should throw error if path not a boolean");

  t.rejects(() => buildPage({ path: "aaaa/xxxx", isFetch: false, isProd: false }), Error, "build-page-utils should return undefined...");

  t.end();

});

