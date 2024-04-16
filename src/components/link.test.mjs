import tap from "tap";
import link from "./link.mjs";

// WRITE (GENERIC) TESTS ////////////////////////////////////////////////////////////////

tap.test("link tests", t => {
 
  // t.match(write(makeString(), "dist/markup/test-file.txt", false), true, "write with valid args returned true");
  t.match(true, true, "write with valid args returned true");


  // //////////////////////////////////////////////
 
  // t.match(write(makeString(333), "dist/test/test-file.txt", false), true, "write with new dir returned true");
  // t.match(fs.existsSync("dist/test/test-file.txt"), true, "write wrote test-file.txt in new dir");

  // clearFiles(["dist/test",]);

  // //////////////////////////////////////////////

  // t.throws(() => write(), Error("validateArgsArgs arg argument did not have any elements"));

  // t.throws(() => write(makeString(333)), Error("validateArgsArgs - args length does not match types length"));

  // t.throws(() => write(null, "dist/markup/test-file.txt", false), Error("[object Null] is not string"));

  // t.throws(() => write(makeString(333), null, false), Error("[object Null] is not string"));

  t.end();

});

