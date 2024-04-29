import tap from "tap";
import { build } from "./build-utils.mjs";


tap.test("test build", async t => {

  // const pagePathsArray = [
  //   "./bad-path/bad-page.mjs"
  // ];

  const pagePathsArray = ["src/utils/build-utils/mocks/mock-page-no-content.mjs"];

  t.rejects(() => build(), Error("validateArgsArgs arg argument did not have any elements"));
  t.rejects(() => build(pagePathsArray), Error("validateArgsArgs - args length does not match types length"));
  t.rejects(() => build(pagePathsArray, null), Error("[object Null] is not boolean"));
  t.rejects(() => build(null, false), Error("[object Null] is not array"));

  const result = await build(pagePathsArray, false);
  t.match(result, [{
    title: String,
    name: String,
    modulePath: String,
    css: Object,
    markup: String,
    js: Object
  }], "build result object should have css, markup, style");

  const pagePathsArrayBadPage = ["./bad-path/bad-page.mjs"];
  t.rejects(() => build(pagePathsArrayBadPage, false), Error, "build-utils should throw error if file path is invalid");

  const pagePathsArrayBadFunction = ["src/utils/build-utils/mocks/mock-page-bad-function.mjs"];
  t.rejects(() => build(pagePathsArrayBadFunction, false), Error, "build-utils should throw error if module does not return anything");

  t.end();

});



