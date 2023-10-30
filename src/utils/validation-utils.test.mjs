import tap from "tap";
import { validateArgs } from "./validation-utils.mjs";


tap.test("validateArgs should receive an error if not passed an array of tuples", async t => {

  try {
    await validateArgs();
  } catch (error) {
    t.match(error instanceof Error, true, "validateArgs should return error if passed nothing");
  }
  try {
    await validateArgs(null);
  } catch (error) {
    t.match(error instanceof Error, true, "validateArgs should return error if passed null");
  }
  try {
    await validateArgs("This is a string");
  } catch (error) {
    t.match(error instanceof Error, true, "validateArgs should return error if passed string");
  }
  try {
    await validateArgs({ here: "there" });
  } catch (error) {
    t.match(error instanceof Error, true, "validateArgs should return error if passed object (dictionary)");
  }
  try {
    await validateArgs([ 1,2,3,4 ]);
  } catch (error) {
    t.match(error instanceof Error, true, "validateArgs should return error if passed flat array");
  }

});

tap.test("validateArgs passed boolean, should return true if type is correct, false if type is wrong (in array of tuples)", async t => {
  const testVar = true;
  t.match(await validateArgs( [[ testVar, "boolean" ]]), true);
  t.match(await validateArgs( [[ testVar, "string" ]]), false);
  t.match(await validateArgs( [[ testVar, "object" ]]), false);
  t.match(await validateArgs( [[ testVar, "function" ]]), false);
  t.match(await validateArgs( [[ testVar, "number" ]]), false);
  t.match(await validateArgs( [[ testVar, "bigint" ]]), false);
  t.end();
});

tap.test("validateArgs passed string, should return true if type is correct, false if type is wrong (in array of tuples)", async t => {
  const testVar = "string am I";
  t.match(await validateArgs( [[ testVar, "string" ]]), true);
  t.match(await validateArgs( [[ testVar, "boolean" ]]), false);
  t.match(await validateArgs( [[ testVar, "object" ]]), false);
  t.match(await validateArgs( [[ testVar, "function" ]]), false);
  t.match(await validateArgs( [[ testVar, "number" ]]), false);
  t.match(await validateArgs( [[ testVar, "bigint" ]]), false);
  t.end();
});
