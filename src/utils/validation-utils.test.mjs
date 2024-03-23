import tap from "tap";
import { validateArg, validateType, validateArgs } from "./validation-utils.mjs";


tap.test("test validateArg (single)", async t => {

  t.match(await validateArg([ true, "string" ]), true,"validateArg should return true when passed a [ val, \"type\" ] pair");
  t.match(await validateArg(), false,"validateArg should return false when passed nothing");
  t.match(await validateArg("huh"), false,"validateArg should return false when not passed array/object");
  t.match(await validateArg([ true ]), false,"validateArg should return false when second does not exist");
  t.match(await validateArg([ true, null ]), false,"validateArg should return false when second item is not string");
  t.match(await validateArg([ null, "string" ]), false,"validateArg should return false when first item is null");

});


tap.test("test validateType", async t => {
  t.match(await validateType(), false, "validateType should return false, if passed no arg");
  t.match(await validateType("huh?"), false, "validateType should return false, if passed invalid type string");
  t.match(await validateType("number"), true, "validateType should return true, if passed valid type string");
});


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

tap.test("validateArgs passed boolean, should return true if type is correct, error if type is wrong", async t => {
  const testVar = true;
  t.match(await validateArgs( [[ testVar, "boolean" ]]), true, "succeeded on boolean");
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

tap.test("validateArgs passed string, should return true if type is correct, error if type is wrong", async t => {
  const testVar = "string am I";
  t.match(await validateArgs( [[ testVar, "string" ]]), true, "succeeded on string");
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

tap.test("validateArgs passed object, should return true if type is correct, error if type is wrong", async t => {
  const testVar = {};
  t.match(await validateArgs( [[ testVar, "object" ]]), true, "succeeded on object");
  try {
    await validateArgs( [[ testVar, "boolean" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on boolean");
  }
  try {
    await validateArgs( [[ testVar, "string" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on string");
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

tap.test("validateArgs passed function, should return true if type is correct, error if type is wrong", async t => {
  const testVar = () => true;
  t.match(await validateArgs( [[ testVar, "function" ]]), true, "succeeded on function");
  try {
    await validateArgs( [[ testVar, "boolean" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on boolean");
  }
  try {
    await validateArgs( [[ testVar, "string" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on string");
  }
  try {
    await validateArgs( [[ testVar, "boolean" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on boolean");
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

tap.test("validateArgs passed number, should return true if type is correct, error if type is wrong", async t => {
  const testVar = 2;
  t.match(await validateArgs( [[ testVar, "number" ]]), true, "succeeded on number");
  try {
    await validateArgs( [[ testVar, "boolean" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on boolean");
  }
  try {
    await validateArgs( [[ testVar, "string" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on string");
  }
  try {
    await validateArgs( [[ testVar, "boolean" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on boolean");
  }
  try {
    await validateArgs( [[ testVar, "function" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on function");
  }
  try {
    await validateArgs( [[ testVar, "bigint" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on bigint");
  }
  t.end();
});

tap.test("validateArgs passed bigint, should return true if type is correct, error if type is wrong", async t => {
  const testVar = BigInt(9007199254740991);
  t.match(await validateArgs( [[ testVar, "bigint" ]]), true, "succeeded on bigint");
  try {
    await validateArgs( [[ testVar, "boolean" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on boolean");
  }
  try {
    await validateArgs( [[ testVar, "string" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on string");
  }
  try {
    await validateArgs( [[ testVar, "boolean" ]]);
  } catch (error) {
    t.match(error instanceof Error, true, "failed on boolean");
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
  t.end();
});






