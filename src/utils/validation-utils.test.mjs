import tap from "tap";
import { validateArg, validateType, validateArgs, validateArgsArgs } from "./validation-utils.mjs";


// validateArgs should be called with args like...
// validateArgs(args, ["string", "boolean"])
// assuming args has two elements
tap.test("test validateArgs to see if called with valid args", async t => {
 
  // (async function(arg1, arg2) {
  //   t.match(validateArgsArgs(arguments, ["string", "boolean"]), true, "returns true if passed valid args");
  // })("a string", someBool = true);

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["string", "boolean"]);
  })("a string", true), true, "returns true if passed 2 valid args");

  const testFunc = () => true;
  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["string", "boolean", "object", "function"]);
  })("a string", true, {}, testFunc), true, "returns true if 4 passed valid args");

  t.throws( () => validateArgsArgs([ null ]), Error("ValidateArgs itself did not receive valid args"), "throws errors if passed no arguments arg");
  
  t.throws( (args = "a string") => validateArgsArgs(args), Error("ValidateArgs itself did not receive valid args"), "throws errors if passed no type array");
  
  t.throws( (args = "a string") => validateArgsArgs(args, [ null ]), Error("ValidateArgs itself did not receive valid args"), "throws errors if passed null as single element in types list");
  
  t.throws( (args = "a string") => validateArgsArgs(args, [ "a string", null ]), Error("ValidateArgs itself did not receive valid args"), "throws errors if passed null in types list");

  t.throws( (args = "a string") => validateArgsArgs(args, [ "string", "notvalidtype" ]), Error("ValidateArgs itself did not receive valid args"), "throws errors if passed a non-valid type in types list");



});


// tap.test("test validateArg (single)", async t => {

//   t.match(await validateArg([ true, "string" ]), true,"validateArg should return true when passed a [ val, \"type\" ] pair");
//   t.match(await validateArg(), false,"validateArg should return false when passed nothing");
//   t.match(await validateArg("huh"), false,"validateArg should return false when not passed array/object");
//   t.match(await validateArg([ true ]), false,"validateArg should return false when second does not exist");
//   t.match(await validateArg([ true, null ]), false,"validateArg should return false when second item is not string");
//   t.match(await validateArg([ null, "string" ]), false,"validateArg should return false when first item is null");

// });


// tap.test("test validateType", async t => {
//   t.match(await validateType(), false, "validateType should return false, if passed no arg");
//   t.match(await validateType("huh?"), false, "validateType should return false, if passed invalid type string");
//   t.match(await validateType("number"), true, "validateType should return true, if passed valid type string");
// });


// tap.test("validateArgs should receive an error if not passed an array of tuples", async t => {

//   try {
//     await validateArgs();
//   } catch (error) {
//     t.match(error instanceof Error, true, "validateArgs should return error if passed nothing");
//   }
//   try {
//     await validateArgs(null);
//   } catch (error) {
//     t.match(error instanceof Error, true, "validateArgs should return error if passed null");
//   }
//   try {
//     await validateArgs("This is a string");
//   } catch (error) {
//     t.match(error instanceof Error, true, "validateArgs should return error if passed string");
//   }
//   try {
//     await validateArgs({ here: "there" });
//   } catch (error) {
//     t.match(error instanceof Error, true, "validateArgs should return error if passed object (dictionary)");
//   }
//   try {
//     await validateArgs([ 1,2,3,4 ]);
//   } catch (error) {
//     t.match(error instanceof Error, true, "validateArgs should return error if passed flat array");
//   }

// });


// tap.test("validateArgs if passed invalid pair, should throw error and parent function should cease execution", async t => {

//   const args = [[ true, "string" ]];
//   function testFunc(args) {
//     validateArgs(args);
//     console.log("EVENT AFTER ERROR");
//     return "success";
//   }
//   t.throws(() => testFunc(args), undefined);

// });


// tap.test("test validateArgs by looping through various options", async t => {

//   const argOptions = [
//     [true, "boolean"],
//     ["a string", "string"],
//     [{}, "object"],
//     [() => true, "function"],
//     [222, "number"],
//     [BigInt(9007199254740991), "bigint"]
//   ];

//   argOptions.forEach(async typePair => {
//     //test the intenced type 
//     t.match(await validateArgs( [[ typePair[0], typePair[1] ]]), true, `succeeded on ${ typePair[1]}`);

//     if (typePair[1] !== "boolean") {
//       t.throws(() => validateArgs( [[ typePair[0], "boolean" ]]), Error(`validateArgs - ${ typePair[0]} is not boolean`), `failed on ${ typePair[0] } as boolean`);
//     }

//     if (typePair[1] !== "string") {
//       t.throws(() => validateArgs( [[ typePair[0], "string" ]]), Error(`validateArgs - ${ typePair[0]} is not string`), `failed on ${ typePair[0] } as string`);
//     }

//     if (typePair[1] !== "object") {
//       t.throws(() => validateArgs( [[ typePair[0], "object" ]]), Error(`validateArgs - ${ typePair[0]} is not object`), `failed on ${ typePair[0] } as object`);
//     }

//     if (typePair[1] !== "function") {
//       t.throws(() => validateArgs( [[ typePair[0], "function" ]]), Error(`validateArgs - ${ typePair[0]} is not function`), `failed on ${ typePair[0] } as function`);
//     }

//     if (typePair[1] !== "number") {
//       t.throws(() => validateArgs( [[ typePair[0], "number" ]]), Error(`validateArgs - ${ typePair[0]} is not number`), `failed on ${ typePair[0] } as number`);
//     }

//     if (typePair[1] !== "bigint") {
//       t.throws(() => validateArgs( [[ typePair[0], "bigint" ]]), Error(`validateArgs - ${ typePair[0]} is not bigint`), `failed on ${ typePair[0] } as bigint`);
//     }

//   });

// });

