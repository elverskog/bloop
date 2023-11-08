import tap from "tap";
import fs from "fs-extra";
import { 
  writeCssOrJs, 
  writeMarkup, 
  writeModuleResult, 
} from "./write-utils.mjs";



tap.test("writeMarkup should write a file in src/dist/markup", t => {
  
  const page = {
    modulePath: "src/markup/test",
    markup: `<!DOCTYPE html>
    <html>dsfasdf</html>`
  };

  t.match(writeMarkup(page), true, "writeMarkup returned true");
  t.match(fs.existsSync("src/dist/markup"), false, "clearFiles clears \"fake\" failed to clear the file");




  t.end();

});






// tap.test("buildPage, when passed a path to a page, with valid structure, should return an object with nodes for name, css, markup and script", async t => {
//   const path = "src/utils/build-utils/mocks/mock-page.mjs";
//   const result = await buildPage({ path, isFetch: false, isBuild: true });

//   // console.log("RESULT IN TEST: ", result);

//   t.match(result, {
//     modulePath: String,
//     name: String,
//     css: Object,
//     markup: String,
//     script: Object
//   }, "build result object should have css, markup, style");
//   t.end();
// });

// tap.test("buildPage should return undefined if a valid path is not passed", async t => {
//   t.match(await buildPage(), undefined);
//   t.match(await buildPage(null), undefined);
//   t.match(await buildPage("This is a string"), undefined);
//   t.match(await buildPage({ here: "there"}), undefined);
//   t.end();
// });

// tap.test("buildPage, when passed an invalid path, should return an error", async t => {
//   t.match(await buildPage("./bad-path/bad-page.mjs"), undefined);
//   t.end();
// });


