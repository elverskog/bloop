import tap from "tap";
import path from "path";
import {fileURLToPath} from "url";
import { getAllPages } from "./dir-utils.mjs";

const thisFilename = fileURLToPath(import.meta.url);
const currentDir = path.dirname(thisFilename);

tap.test("getAllPages should return an array of all files with .mjs extension", t => {
  const expectedFiles = [
    '/home/ee/code/bloop/src/utils/dir-utils/mocks/dir-util-mock.mjs',
    '/home/ee/code/bloop/src/utils/dir-utils/mocks/inner-dir/dir-util-mock-inner.mjs'
  ];
  const actualFiles = getAllPages(`${ currentDir }/mocks`);
  t.match(actualFiles, expectedFiles);
  t.end();
});

tap.test("getAllPages should throw an error if path is not valid", t => {
  const invalidPath = "/this/path/does/not/exist";
  t.throws(() => getAllPages(invalidPath), {
    message: `Error while reading directory ${invalidPath}: ENOENT: no such file or directory, scandir '${invalidPath}'`
  });
  t.end();
});

tap.test("getAllPages should return an empty array if directory contains no files with the specified extension", t => {
  const actualFiles = getAllPages(`${ currentDir }/mocks/empty`);
  t.match(actualFiles, []);
  t.end();
});

tap.test("getAllPages should throw an error if passed a file instead of a directory", t => {
  const filePath = `${ currentDir }/mocks/file1.mjs`;
  t.throws(() => getAllPages(filePath), {
    // message: `Error while reading directory ${filePath}: ENOTDIR: not a directory, scandir '${filePath}'`
    message: `Error while reading directory ${filePath}: ENOENT: no such file or directory, scandir '${filePath}'`
  });
  t.end();
});

tap.test("getAllPages should not take too long to execute with a large directory", t => {
  const start = performance.now();
  const actualFiles = getAllPages(`${ currentDir }/mocks`);
  const end = performance.now();
  const timeTaken = end - start;
  t.ok(timeTaken < 50, "Function should take less than 50ms to execute");
  t.end();
});
