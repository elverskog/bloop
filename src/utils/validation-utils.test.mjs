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
  t.match(await validateArgs( [[ testVar, "boolean" ]]), true, "failed on boolean");
  try {
    await validateArgs( [[ testVar, "string" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on string");
  }
  try {
    await validateArgs( [[ testVar, "object" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on object");
  }
  try {
    await validateArgs( [[ testVar, "function" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on function");
  }
  try {
    await validateArgs( [[ testVar, "number" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on number");
  }
  try {
    await validateArgs( [[ testVar, "bigint" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on bigint");
  }
  t.end();
});

tap.test("validateArgs passed string, should return true if type is correct, false if type is wrong (in array of tuples)", async t => {
  const testVar = "string am I";
  t.match(await validateArgs( [[ testVar, "string" ]]), true, "failed on string");
  try {
    await validateArgs( [[ testVar, "boolean" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on boolean");
  }
  try {
    await validateArgs( [[ testVar, "object" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on object");
  }
  try {
    await validateArgs( [[ testVar, "function" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on function");
  }
  try {
    await validateArgs( [[ testVar, "number" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on number");
  }
  try {
    await validateArgs( [[ testVar, "bigint" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on bigint");
  }
  t.end();
});
