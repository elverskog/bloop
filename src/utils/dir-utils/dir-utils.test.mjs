import fs from "fs-extra";
import tap from "tap";
import path from "path";
import {fileURLToPath} from "url";
import { clearFiles, utilBaseDir, getAllFiles } from "./dir-utils.mjs";

const thisFilename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(thisFilename);


//clearFiles tests //////////////////////////////////////////////////////////////////

tap.test("clearFiles if passed an array of valid paths should remove all files inside each", async t => {

  //if the dummy-dir doesn't exist, create it
  if(!fs.existsSync("src/utils/dir-utils/mocks/clear-files/dummy-dir")) {
    fs.mkdirSync("src/utils/dir-utils/mocks/clear-files/dummy-dir", { recursive: false });
  }

  //if the dummy-file doesn't exist, create it
  if(!fs.existsSync("src/utils/dir-utils/mocks/clear-files/dummy-dir/dummy-file.txt")) {
    fs.writeFileSync("src/utils/dir-utils/mocks/clear-files/dummy-dir/dummy-file.txt", "dummy file content");
  }

  //when passed a legit array of paths
  t.match(clearFiles(["src/utils/dir-utils/mocks/clear-files/dummy-dir"]), true, "clearFiles returns true");
  t.match(fs.existsSync("src/utils/dir-utils/mocks/clear-files/dummy-dir/dummy-file.txt"), false, "clearFiles clears \"fake\" failed to clear the file");

  //when passed a bad array of paths
  t.match(clearFiles(["src/utils/dir-utils/mocks/clear-files/wrong-dir"]), true, "clearFiles returns false");

  t.end();


});




//getAllFiles tests //////////////////////////////////////////////////////////////////

tap.test("getAllFiles should return an array of all files with .mjs extension", t => {
  const expectedFiles = [
    "src/utils/dir-utils/mocks/dir-util-mock.mjs",
    "src/utils/dir-utils/mocks/inner-dir/dir-util-mock-inner.mjs"
  ];
  const actualFiles = getAllFiles("src/utils/dir-utils/mocks");
  t.match(actualFiles, expectedFiles);
  t.end();
});

tap.test("getAllFiles should throw an error if path is not valid", t => {
  const invalidPath = "src/utils/dir-utils/this/path/does/not/exist";
  t.throws(() => getAllFiles(invalidPath), {
    message: `ENOENT: no such file or directory, scandir './${invalidPath}'`
  });
  t.end();
});

tap.test("getAllFiles should return an empty array if directory contains no files with the specified extension", t => {
  const actualFiles = getAllFiles("src/utils/dir-utils/mocks/empty");
  t.match(actualFiles, []);
  t.end();
});

tap.test("getAllFiles should throw an error if passed a file instead of a directory", t => {
  const filePath = "src/utils/dir-utils/mocks/file1.mjs";
  t.throws(() => getAllFiles(filePath), {
    // message: `Error while reading directory ${filePath}: ENOTDIR: not a directory, scandir '${filePath}'`
    message: `ENOENT: no such file or directory, scandir './${filePath}'`
  });
  t.end();
});

tap.test("getAllFiles should not take too long to execute with a large directory", t => {
  const start = performance.now();
  getAllFiles(`src/utils/dir-utils/mocks`);
  const end = performance.now();
  const timeTaken = end - start;
  t.ok(timeTaken < 50, "Function should take less than 50ms to execute");
  t.end();
});


//utilBaseDir tests //////////////////////////////////////////////////////////////////

tap.test("utilBaseDir setBaseDir should return false when not passed a string", t => {
  t.match(utilBaseDir.setBaseDir(null), false);
  t.match(utilBaseDir.setBaseDir(1), false);
  t.match(utilBaseDir.setBaseDir(), false);
  t.end();
});

tap.test("utilBaseDir setBaseDir should return false when not passed a valid URL", t => {
  t.match(utilBaseDir.setBaseDir("sfasdf/asdfsdf"), false);
  t.end();
});

tap.test("utilBaseDir setBaseDir should return return a valid absolute path when passed a valid URL", t => {
  const baseDir = utilBaseDir.setBaseDir("file:///home/ee/code/bloop/server.mjs");
  t.match(fs.statSync(baseDir).isDirectory(), true);
  t.end();
});
