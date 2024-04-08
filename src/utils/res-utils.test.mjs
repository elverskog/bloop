import tap from "tap";
import { parseAndOutputStream } from "./res-utils.mjs";
import { ReadableStream } from "node:stream/web";

function createStream({ id, text, version }) {
  const chunks = text.split(" ").map(
    (textChunk, index, fullArray) =>
      "data:" +
      JSON.stringify({
        text: index === fullArray.length - 1 ? textChunk : textChunk + " ",
        version,
        id,
      })
  );

  return new ReadableStream({
    
    start(controller) {
      controller.enqueue(
        Buffer.from(
          "data:" +
            JSON.stringify({
              text: "",
              version,
              id,
            }) +
            chunks[0]
        )
      );

      for (let i = 1; i < chunks.length; i++) {
        if (i === chunks.length - 1) {
          // Fragment the last chunk, to test correct merging of partial responses
          const partialChunks = [
            chunks[i].substring(0, Math.floor(chunks[i].length * 0.5)),
            chunks[i].substring(Math.floor(chunks[i].length * 0.5)),
          ];
          setTimeout(() => controller.enqueue(Buffer.from(partialChunks[0])), i);
          setTimeout(() => controller.enqueue(Buffer.from(partialChunks[1])), i + 1);
        } else {
          setTimeout(() => controller.enqueue(Buffer.from(chunks[i])), i);
        }
      }

      setTimeout(() => controller.close(), chunks.length + 1);
    },
  });
}




function makeString(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


tap.test("test parseAndOutputStream", async t => {

  const text = makeString(5);
  // const encoder = new TextEncoder();
  // const encString = encoder.encode(string);

  // @ts-expect-error We only mock a partial Response
  const encString = {
    ok: true,
    body: createStream({
      text,
      version: "test:version",
      id: "test:id",
    }),
  };

// function makeString(length) {

  console.log("ENC STRING", encString);

  t.match(await parseAndOutputStream(encString), text);

  // let interval;

  // const stream = new ReadableStream({

  //   start(controller) {
  //     interval = setInterval(() => {

  //       let string = makeString(512);

  //       // Add the string to the stream
  //       controller.enqueue(string);

  //     }, 1000); 
  //   }
  // });




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

