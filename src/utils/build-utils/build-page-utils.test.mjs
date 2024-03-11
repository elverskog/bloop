import tap from "tap";
import { buildPage } from "./build-page-utils.mjs";


async function test() {
  throw new TypeError("test");
}


tap.test("test build-page-utils", async t => {

  const path = "src/utils/build-utils/mocks/mock-page.mjs";
  const result = await buildPage({ path, isFetch: false, isProd: true });

  t.match(result, {
    modulePath: String,
    name: String,
    css: Object,
    markup: String,
    js: Object
  }, "buildPage result object should have css, markup, style");

  /////////////////////////////////////////////////////////////////////////////
 
  // t.match(await buildPage(), Error("validateArgs - undefined is not a string"));
  
  // console.log("GEEE: ", await buildPage());
  // t.rejects(buildPage, new Error("validateArgs - undefined is not a string"));

  t.rejects(() => buildPage(), Error, "build-page-utils should throw error if passed no arg");
  t.rejects(() => buildPage({}), Error, "build-page-utils should throw error if passed empty object");
  t.rejects(() => buildPage({ path, isFetch: false, isProd: "sdfs" }), Error, "build-page-utils should throw error if isProd not a boolean");
  t.rejects(() => buildPage({ path, isFetch: "", isProd: false }), Error, "build-page-utils should throw error if isFetch not a boolean");
  t.rejects(() => buildPage({ path: null, isFetch: false, isProd: false }), Error, "build-page-utils should throw error if path not a boolean");

  // t.match(() => buildPage({ path: "aaaa/xxxx", isFetch: false, isProd: false }), undefined, "build-page-utils should return undefined...");
  t.rejects(() => buildPage({ path: "aaaa/xxxx", isFetch: false, isProd: false }), Error, "build-page-utils should return undefined...");



  // t.rejects(buildPage, Error);
  // t.rejects(buildPage, Error("validateArgs - undefined is not a string",
  //   { "name": "TypeError"} 
  // ));

  // t.throws(() => buildPageTest(), "my error");
  // t.throws(() => buildPageTest(), new TypeError("my error"), "build-page-utils should throw error if passed no arg");
  // t.throws(() => test(), "test");

  // t.throws(await buildPageTest, TypeError("my error"));

  // t.throws(async () => await buildPage(), TypeError("validateArgs - undefined isn't string"), "build-page-utils should throw error if passed no arg");
  // t.throws(buildPage, TypeError("validateArgs - undefined isn't string"), "build-page-utils should throw error if passed no arg");
  // t.throws(buildPage, { message: "Error: test" });

  // t.throws(function() {
  //     throw new TypeError("some type error");
  // }, new TypeError("some type error"), "should throw a TypeError");

  // t.end();

});




// tap.test("buildPage should throw error if a valid path is not passed", async t => {

//   // const path = "src/utils/build-utils/mocks/mock-page.mjs";
//   // console.log("BUILDPAGE TEST", await buildPage({ path, isFetch: false, isProd: true }));

//   t.throws(async () => await buildPage(), Error("validateArgs - undefined isn't string"));
//   // t.throws(buildPage, Error, `pageMissingModulePath ${ Error }`);
//   // t.throws(await buildPage(), Error);
//   // t.match(await buildPage(null), undefined);
//   // t.match(await buildPage("This is a string"), undefined);
//   // t.match(await buildPage({ here: "there"}), undefined);
//   t.end();
// });

// // tap.test("buildPage, when passed an invalid path, should return an error", async t => {
// //   t.match(await buildPage("./bad-path/bad-page.mjs"), undefined);
// //   t.end();
// // });


