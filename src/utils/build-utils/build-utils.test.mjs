import tap from "tap";
import { build } from "./build-utils.mjs";


tap.test("test build", async t => {

  const pagePathsArray = [
    "./bad-path/bad-page.mjs"
  ];


  t.rejects(() => build(), Error("validateArgsArgs arg argument did not have any elements"));

  // t.rejects(() => (function() {
  //   build();
  // })(), Error);

  // t.throws(() => (function () {
  //   validateArgsArgs(arguments, "not an array");
  // })("a string"), Error("validateArgsArgs - received non-array types argument"));



  // t.match(await build(), undefined);
  // t.match(await build(false, false), undefined);
  // t.match(await build(null, false), undefined);
  // t.match(await build("This is a string", false), undefined);
  // t.match(await build(), undefined);
  // t.match(await build(pagePathsArray, null), undefined);
  // t.match(await build(pagePathsArray, "This is a string"), undefined);
  // t.match(await build(pagePathsArray, undefined), undefined);

  t.end();

});


// tap.test("build, when passed an array with an invalid path, should throw an error", async t => {
//   const pagePathsArray = [
//     "./bad-path/bad-page.mjs"
//   ];
//   t.rejects(() => build(pagePathsArray, false), Error, "build-utils should throw error if file path is invalid");
//   t.end();
// });


// tap.test("build, when passed an array with a valid module path but an invalid result, should throw an error", async t => {
//   const pagePathsArray = [
//     "src/utils/build-utils/mocks/mock-page-bad-function.mjs"
//   ];
//   t.rejects(() => build(pagePathsArray, false), Error, "build-utils should throw error if module does not return anything");
//   t.end();
// });



// tap.test("build, when passed proper array of valid paths, should return an object with nodes for name, css, etc", async t => {
//   const pagePathsArray = [
//     "src/utils/build-utils/mocks/mock-page.mjs"
//   ];
//   const result = await build(pagePathsArray, false);
//   t.match(result, [{
//     title: String,
//     name: String,
//     modulePath: String,
//     css: Object,
//     markup: String,
//     js: Object
//   }], "build result object should have css, markup, style");
//   t.end();
// });
