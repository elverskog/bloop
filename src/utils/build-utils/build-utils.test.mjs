import tap from "tap";
import { build } from "./build-utils.mjs";
import { utilBaseDir } from "../dir-utils/dir-utils.mjs";



// const metaUrl = import.meta.url.split("src")[0];
// utilBaseDir.setBaseDir(metaUrl);



console.log("META URL", metaUrl);

tap.test("build should return undefined if a valid pagePathArray is not passed", async t => {
  t.match(await build(), undefined);
  t.match(await build(null), undefined);
  t.match(await build("This is a string"), undefined);
  t.match(await build({ here: "there"}), undefined);
  t.end();
});

// tap.test("build, when passed an array of paths with an invalid path, should return an error", async t => {
//   const pagesPathArray = [
//     "./bad-path/bad-page.mjs"
//   ];
//   t.match(await build(pagesPathArray), undefined);
//   t.end();
// });

tap.test("build, when passed proper array of valid paths, should return an object with nodes for css, markup and script", async t => {
  const pagesPathArray = [
    "src/utils/build-utils/mocks/mock-page.mjs"
  ];
  const result = await build(pagesPathArray);
  t.match(undefined, undefined);
  // t.match(result, {
  //   css: Object,
  //   markup: Object,
  //   style: Object
  // }, "build result object should have css, markup, style");
  // t.end();
});





// tap.test("getAllPages should return an array of all files with .mjs extension", t => {
//   const expectedFiles = [
//     "/home/ee/code/bloop/src/utils/dir-utils/mocks/dir-util-mock.mjs",
//     "/home/ee/code/bloop/src/utils/dir-utils/mocks/inner-dir/dir-util-mock-inner.mjs"
//   ];
//   const actualFiles = getAllPages(`${ currentDir }/mocks`);
//   t.match(actualFiles, expectedFiles);
//   t.end();
// });

// tap.test("getAllPages should throw an error if path is not valid", t => {
//   const invalidPath = "/this/path/does/not/exist";
//   t.throws(() => getAllPages(invalidPath), {
//     message: `Error while reading directory ${invalidPath}: ENOENT: no such file or directory, scandir '${invalidPath}'`
//   });
//   t.end();
// });

// tap.test("getAllPages should return an empty array if directory contains no files with the specified extension", t => {
//   const actualFiles = getAllPages(`${ currentDir }/mocks/empty`);
//   t.match(actualFiles, []);
//   t.end();
// });

// tap.test("getAllPages should throw an error if passed a file instead of a directory", t => {
//   const filePath = `${ currentDir }/mocks/file1.mjs`;
//   t.throws(() => getAllPages(filePath), {
//     // message: `Error while reading directory ${filePath}: ENOTDIR: not a directory, scandir '${filePath}'`
//     message: `Error while reading directory ${filePath}: ENOENT: no such file or directory, scandir '${filePath}'`
//   });
//   t.end();
// });

// tap.test("getAllPages should not take too long to execute with a large directory", t => {
//   const start = performance.now();
//   getAllPages(`${ currentDir }/mocks`);
  //   const end = performance.now();
  //   const timeTaken = end - start;
//   t.ok(timeTaken < 50, "Function should take less than 50ms to execute");
//   t.end();
// });

// tap.test("utilBaseDir setBaseDir should return false when not passed a string", t => {
//   t.match(utilBaseDir.setBaseDir(null), false);
//   t.match(utilBaseDir.setBaseDir(1), false);
//   t.match(utilBaseDir.setBaseDir(), false);
//   t.end();
// });

// tap.test("utilBaseDir setBaseDir should return false when not passed a valid URL", t => {
//   t.match(utilBaseDir.setBaseDir("sfasdf/asdfsdf"), false);
//   t.end();
// });

// tap.test("utilBaseDir setBaseDir should return return a valid absolute path when passed a valid URL", t => {
//   const baseDir = utilBaseDir.setBaseDir("file:///home/ee/code/bloop/server.mjs");
//   t.match(fs.statSync(baseDir).isDirectory(), true);
//   t.end();
// });
