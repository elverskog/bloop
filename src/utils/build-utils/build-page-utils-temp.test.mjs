import tap from "tap";
import { buildPage } from "./build-page-utils.mjs";

/////////////////////////////////////////////////////////////////////////////

tap.test("build, when passed an invalid options obj, should throw an error", async t => {

  const path = "src/utils/build-utils/mocks/mock-page.mjs";


  // const test = await buildPage({ path, isFetch: "sss", isProd: true });

  // console.log("TEST: ", test);

  const resultAllGood = await buildPage({ path: "src/utils/build-utils/mocks/mock-page.mjs", isFetch: false, isProd: true });

  t.match(resultAllGood, {
    modulePath: String,
    name: String,
    css: Object,
    markup: String,
    js: Object
  }, "buildPage result object should have css, markup, style");

  t.rejects(() => buildPage({ path, isFetch: "sss", isProd: true }), Error, "build-page-utils should throw error if isFetch not a boolean");
  t.rejects(() => buildPage({ path, isFetch: false, isProd: "sdfs" }), Error, "build-page-utils should throw error if isProd not a boolean");

  t.end();

});

