import tap from "tap";
import http from "http";
import { parseAndOutputStream } from "./res-utils.mjs";
import { ReadableStream } from "node:stream/web";
import testModule from "./mocks/mock-module.json" assert { type: "json" };


let server;

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

const plainString = makeString(5000);

function serverStart() {

  const PORT = 3000;
  const headerOptions = {
    "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
    "Expires": "-1",
    "Pragma": "no-cache",
  };

  server = http.createServer(async (req, res) => {
    res.writeHead(200, headerOptions);
    res.write(plainString);
    res.end();
  });

  server.listen(PORT, () => {
    console.log(`PROD listening on port ${PORT}`);
  });

}




tap.test("test parseAndOutputStream", async t => {

  serverStart();

  const headers = new Headers();
  headers.append("is-fetch", true);
  const options = { headers }; 
  const res = await fetch("http://localhost:3000/", options);
  // const parsedResStream = await parseAndOutputStream(res);
  // console.log("PARSED RES: ", parsedResStream);

  t.match(await parseAndOutputStream(res), plainString);

  global.setTimeout(() => {
    server.close();
  }, 2000);  


  // const plainText = makeString(5000);
  // const encString = { body: createStream(plainText) };
  // const encString = createStream(plainText);
  //t.match(await parseAndOutputStream(encString), plainText);

  // const testModuleString = JSON.stringify(testModule);
  // const encTestModuleString = { body: createStream(testModuleString) };
  // t.match(await parseAndOutputStream(encTestModuleString), testModuleString);

  t.end();


});


// function createStreamOrig({ id, text, version }: ChatMessageResponse) {
//   const chunks = text.split(' ').map(
//     (textChunk, index, fullArray) =>
//       'data:' +
//       JSON.stringify({
//         text: index === fullArray.length - 1 ? textChunk : textChunk + ' ',
//         version,
//         id,
//       })
//   )

//   return new ReadableStream({
//     start(controller) {
//       controller.enqueue(
//         Buffer.from(
//           'data:' +
//             JSON.stringify({
//               text: '',
//               version,
//               id,
//             }) +
//             chunks[0]
//         )
//       )

//       for (let i = 1; i < chunks.length; i++) {
//         if (i === chunks.length - 1) {
//           // Fragment the last chunk, to test correct merging of partial responses
//           const partialChunks = [
//             chunks[i].substring(0, Math.floor(chunks[i].length * 0.5)),
//             chunks[i].substring(Math.floor(chunks[i].length * 0.5)),
//           ]
//           setTimeout(() => controller.enqueue(Buffer.from(partialChunks[0])), i)
//           setTimeout(() => controller.enqueue(Buffer.from(partialChunks[1])), i + 1)
//         } else {
//           setTimeout(() => controller.enqueue(Buffer.from(chunks[i])), i)
//         }
//       }

//       setTimeout(() => controller.close(), chunks.length + 1)
//     },
//   })
// }






// function createStream(text) {
  
//   const chunks = text.match(/.{1,70}/g);

//   return new ReadableStream({
    
//     start(controller) {
//       controller.enqueue(
//         Buffer.from(text + chunks[0])
//       );

//       for (let i = 1; i < chunks.length; i++) {
//         if (i === chunks.length - 1) {
//           // fragment the last chunk, to test correct merging of partial responses
//           const partialChunks = [
//             chunks[i].substring(0, Math.floor(chunks[i].length * 0.5)),
//             chunks[i].substring(Math.floor(chunks[i].length * 0.5)),
//           ];
//           setTimeout(() => controller.enqueue(Buffer.from(partialChunks[0])), i);
//           setTimeout(() => controller.enqueue(Buffer.from(partialChunks[1])), i + 1);
//         } else {
//           setTimeout(() => controller.enqueue(Buffer.from(chunks[i])), i);
//         }
//       }

//       setTimeout(() => controller.close(), chunks.length + 1);

//     },
//   });

// }


// function makeString(length) {
//   let result = "";
//   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const charactersLength = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// }


// tap.test("test parseAndOutputStream", async t => {

//   const plainText = makeString(5000);
//   const encString = { body: createStream(plainText) };
//   // const encString = createStream(plainText);
//   t.match(await parseAndOutputStream(encString), plainText);

//   // const testModuleString = JSON.stringify(testModule);
//   // const encTestModuleString = { body: createStream(testModuleString) };
//   // t.match(await parseAndOutputStream(encTestModuleString), testModuleString);









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


