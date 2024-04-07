
import tap from "tap";
import { parseAndOutputStream } from "./res-utils.mjs";


tap.test("test parseAndOutputStream", async t => {


  let interval;
  
  const stream = new ReadableStream({

    start(controller) {
      interval = setInterval(() => {
        let string = randomChars();

        // Add the string to the stream
        controller.enqueue(string);

        // show it on the screen
        let listItem = document.createElement("li");
        listItem.textContent = string;
        list1.appendChild(listItem);
      }, 1000); 
    }
  });

  // const pagePathsArray = ["src/utils/build-utils/mocks/mock-page.mjs"];

  // t.rejects(() => build(), Error("validateArgsArgs arg argument did not have any elements"));
  // t.rejects(() => build(pagePathsArray), Error("validateArgsArgs - args length does not match types length"));
  // t.rejects(() => build(pagePathsArray, null), Error("[object Null] is not boolean"));
  // t.rejects(() => build(null, false), Error("[object Null] is not array"));

  // const result = await build(pagePathsArray, false);
  // t.match(result, [{
  //   title: String,
  //   name: String,
  //   modulePath: String,
  //   css: Object,
  //   markup: String,
  //   js: Object
  // }], "build result object should have css, markup, style");

  // const pagePathsArrayBadPage = ["./bad-path/bad-page.mjs"];
  // t.rejects(() => build(pagePathsArrayBadPage, false), Error, "build-utils should throw error if file path is invalid");

  // const pagePathsArrayBadFunction = ["src/utils/build-utils/mocks/mock-page-bad-function.mjs"];
  // t.rejects(() => build(pagePathsArrayBadFunction, false), Error, "build-utils should throw error if module does not return anything");

  t.end();

});

