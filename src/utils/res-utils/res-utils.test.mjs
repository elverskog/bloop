import tap from "tap";
import http from "http";
import { parseAndOutputStream } from "./res-utils.mjs";
import { ReadableStream } from "node:stream/web";
import testModule from "./mocks/mock-module.json" assert { type: "json" };


let server;

function serverStart() {

  const PORT = 3000;
  const headerOptions = {
    "Cache-Control": "private, no-cache, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0",
    "Expires": "-1",
    "Pragma": "no-cache",
  };

  server = http.createServer(async (req, res) => {
    res.writeHead(200, headerOptions);
    res.write(req.headers.body);
    res.end();
  });

  server.listen(PORT, () => {
    console.log(`PROD listening on port ${PORT}`);
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

  serverStart();

  const headers = new Headers();
  const options = { headers }; 
  const url = "http://localhost:3000/";

  // test long plain string
  const plainString5000 = makeString(5000);
  headers.append("body", plainString5000);
  t.match(await parseAndOutputStream(await fetch(url, options)), plainString5000);

  // test short plain string
  const plainString500 = makeString(500);
  headers.append("body", plainString500);
  t.match(await parseAndOutputStream(await fetch(url, options)), plainString500);

  // test module
  const testModuleString = JSON.stringify(testModule);
  headers.append("body", testModuleString);
  t.match(await parseAndOutputStream(await fetch(url, options)), testModuleString);

  global.setTimeout(() => {
    server.close();
  }, 2000);  

  t.match("aaaa", "aaaa");

  t.end();

});
