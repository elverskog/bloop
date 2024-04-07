import tap from "tap";
import { validateArgs, validateArgsArgs, valArgsResHandler } from "./validation-utils.mjs";


// valArgsResHandler is simply a utility function 
// that when passed a false "res" arg will throw an error
// the error itself can be passed in or a default used
// it should return undefined if res !== false

tap.test("test valArgsResHandler", async t => {
  t.throws(() => valArgsResHandler(false), Error("generic validateArgs error"));
  t.throws(() => valArgsResHandler(false, "custom message"), Error("custom message"));
  t.match(await valArgsResHandler(true), undefined);
  t.end();
});


// validateArgs should be called with args like...
// validateArgs(args, ["string", "boolean"])
// assuming args has two elements

tap.test("test validateArgsArgs", async t => {
 
  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["string", "boolean"]);
  })("a string", true), true, "returns true if passed 2 valid args");

  const testFunc = () => true;
  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["string", "boolean", "object", "function"]);
  })("a string", true, {}, testFunc), true, "returns true if 4 passed valid args");

  t.throws(() => (function () {
    validateArgsArgs();
  })("a string"), Error("validateArgsArgs did not receive 2 arguments"));

  t.throws(() => (function () {
    validateArgsArgs(arguments);
  })("a string"), Error("validateArgsArgs did not receive 2 arguments"));

  t.throws(() => (function () {
    validateArgsArgs(arguments, [ "string" ]);
  })(), Error("validateArgsArgs arg argument did not have any elements"));

  t.throws(() => {
    validateArgsArgs("a string", []);
  }, Error("validateArgsArgs - received non-arguments arg argument"));

  t.throws(() => (function () {
    validateArgsArgs(arguments, "not an array");
  })("a string"), Error("validateArgsArgs - received non-array types argument"));

  t.throws(() => (function () {
    validateArgsArgs(arguments, ["string", "array"]);
  })("a string"), Error("validateArgsArgs - args length does not match types length"));

  t.throws(() => (function () {
    validateArgsArgs(arguments, ["string", "array", {}]);
  })("a string", [ "test" ], {}), Error("validateArgsArgs - some of the types array are not strings"));

  t.throws(() => (function () {
    validateArgsArgs(arguments, ["string", "array", "frog"]);
  })("a string", [ "test" ], {}), Error("validateArgsArgs - some of the types array are not names of valid types"));

  t.end();

});


tap.test("test validateArgs", async t => {

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["string", "boolean"]);
  })("a string", true), true, "returns true if passed 2 valid args with valid type matches");

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["boolean"]);
  })(true), true, "returns true if passed valid boolean match");

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["string"]);
  })("a string"), true, "returns true if passed valid string match");

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["object"]);
  })({}), true, "returns true if passed valid object match");

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["array"]);
  })(["a string"]), true, "returns true if passed valid array match");

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["function"]);
  })(() => true), true, "returns true if passed valid string match");

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["number"]);
  })(222), true, "returns true if passed valid number match");

  t.match(await (async function() {
    return await validateArgsArgs(arguments, ["bigint"]);
  })(BigInt(43523454345424)), true, "returns true if passed valid bigint match");

  function testFunc() {
    validateArgs(arguments, [ "string", "string" ]);
    return "success";
  }
  t.throws(() => testFunc("a string", { foo: "bar" }), undefined, "validateArgs passed invalid args, should throw error and parent function should cease execution" );

  t.throws(() => (function() {
    validateArgs(arguments, ["string", "array"]);
  })("a string", "test"), Error("validateArgsArgs - test is not array"));

  t.throws(() => (function() {
    validateArgs(arguments, ["string", "boolean"]);
  })("a string", [ "test" ]), Error("validateArgsArgs - [object Array] is not boolean"));

  t.throws(() => (function() {
    validateArgs(arguments, ["string", "string"]);
  })("a string", [ "test" ]), Error("validateArgsArgs - [object Array] is not string"));

  t.throws(() => (function() {
    validateArgs(arguments, ["string", "object"]);
  })("a string", "test"), Error("validateArgsArgs - test is not object"));

  t.throws(() => (function() {
    validateArgs(arguments, ["string", "function"]);
  })("a string", "test"), Error("validateArgsArgs - test is not function"));

  t.throws(() => (function() {
    validateArgs(arguments, ["string", "number"]);
  })("a string", "test"), Error("validateArgsArgs - test is not number"));

  t.throws(() => (function() {
    validateArgs(arguments, ["string", "bigint"]);
  })("a string", [ "test" ]), Error("validateArgsArgs - [object Array] is not bigint"));

  t.end();

});

