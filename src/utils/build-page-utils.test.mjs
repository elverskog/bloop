import tap from "tap";
import { buildPage } from "./build-page-utils.mjs";


tap.test("buildPage, when passed a path to a page, with valid structure, should return an object with nodes for name, css, markup and script", async t => {
  const path = "src/utils/build-utils/mocks/mock-page.mjs";
  const result = await buildPage({ path, isFetch: false, isBuild: true });

  // console.log("RESULT IN TEST: ", result);

  t.match(result, {
    modulePath: String,
    name: String,
    css: Object,
    markup: String,
    js: Object
  }, "build result object should have css, markup, style");
  t.end();
});

tap.test("buildPage should return undefined if a valid path is not passed", async t => {
  t.match(await buildPage(), undefined);
  t.match(await buildPage(null), undefined);
  t.match(await buildPage("This is a string"), undefined);
  t.match(await buildPage({ here: "there"}), undefined);
  t.end();
});

tap.test("buildPage, when passed an invalid path, should return an error", async t => {
  t.match(await buildPage("./bad-path/bad-page.mjs"), undefined);
  t.end();
});


