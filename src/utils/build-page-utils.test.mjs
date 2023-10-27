import tap from "tap";
import { buildPage } from "./build-page-utils.mjs";


tap.test("buildPage, when passed a path to a page, with valid structure, should return an object with nodes for css, markup and script", async t => {
  console.log("BUILDPAGE", buildPage);
  const path = "src/utils/build-utils/mocks/mock-page.mjs";
  const result = await buildPage({ path, isFetch: false, isBuild: true });
  t.match(result.mockPage, {
    css: String,
    markup: String,
    script: Object
  }, "build result object should have css, markup, style");
  t.end();
});

// tap.test("build should return undefined if a valid pagePathArray is not passed", async t => {
//   t.match(await build(), undefined);
//   t.match(await build(null), undefined);
//   t.match(await build("This is a string"), undefined);
//   t.match(await build({ here: "there"}), undefined);
//   t.end();
// });

// tap.test("build, when passed an array of paths with an invalid path, should return an error", async t => {
//   const pagesPathArray = [
//     "./bad-path/bad-page.mjs"
//   ];
//   t.match(await build(pagesPathArray), [ undefined ]);
//   t.end();
// });


