import tap from "tap";
import { JSDOM } from "jsdom";
import { insertScripts } from "./dom-utils.mjs";


tap.test("insertScripts tests", t => {

    // t2.throws(() => insertScripts([{name: null, val: "() => window.p_p.a = {}"}], fn, window), TypeError("insertEach passed invalid args"), "insertScripts throws error when passed invalid name");

  t.test("insertScripts should validate args", async t2 => {
    //our fake window
    const window = (new JSDOM("<!DOCTYPE html><html><body></body></html>")).window;
    //insertScripts wants a callback
    const fn = success => console.log(`I'm just an empty callback function - ${ success }`);
    t2.throws(() => insertScripts(null, fn, window), TypeError("insertScript passed invalid js array"), "insertScripts throws when passed invalid js array");
    t2.throws(() => insertScripts([], null, window), TypeError("insertScript passed invalid callback function"), "insertScripts throws when passed invalid callback");
    t2.throws(() => insertScripts([], fn, null), TypeError("insertScript passed invalid window"), "insertScripts throws when passed invalid window obj");
  });


  t.test("insertScripts should insert all scripts into DOM", async t2 => {

    //our fake window
    const window = (new JSDOM("<!DOCTYPE html><html><body></body></html>")).window;
    
    //insertScripts needs a script object, the value on the right will be the script
    //but we don't care here if the script is valid JS
    //note: the src will be hash-blob pointing at this "script"
    const jsArray = [
      {
        name: "scriptA",
        val: "() => window.p_p.a = {}"
      },
      {
        name: "scriptB",
        val: "() => window.p_p.b = {}"
      },
      {
        name: "scriptC",
        val: "() => window.p_p.c = {}"
      }
    ];

    //insertScripts wants a callback
    const fn = function(success) {
      console.log(`I'm just an empty callback function - ${ success }`);
    };

    // Wait for the window to finish loading
    window.addEventListener("load", () => {

      // Check if each script was loaded
      const script1 = window.document.getElementById("script1Script");
      const script1Loaded = typeof script1.src === "string" && script1.src.indexOf("blob") === 0;
      t2.equal(script1Loaded, true);

      const script2 = window.document.getElementById("script2Script");
      const script2Loaded = typeof script2.src === "string" && script2.src.indexOf("blob") === 0;
      t2.equal(script2Loaded, true);

      const script3 = window.document.getElementById("script3Script");
      const script3Loaded = typeof script3.src === "string" && script3.src.indexOf("blob") === 0;
      t2.equal(script3Loaded, true);

    });

    //call the function we are testing
    insertScripts(jsArray, fn, window);

    //close the fak window we creatd
    window.close();

    //end the test
    t2.end();

  });


  t.test("insertScripts should run callback after all scripts are inserted into DOM", t2 => {

    //our fake window
    const window = (new JSDOM("<!DOCTYPE html><html><body></body></html>")).window;

    //insertScripts needs a script object, the value on the right will be the script
    //but we don't care here if the script is valid JS
    //note: the src will be hash-blob pointing at this "script"
    const jsArray = [
      {
        name: "scriptA",
        val: "() => window.p_p.a = {}"
      },
      {
        name: "scriptB",
        val: "() => window.p_p.b = {}"
      },
      {
        name: "scriptC",
        val: "() => window.p_p.c = {}"
      }
    ];

    //insertScripts wants a callback
    const fn = function(success) {
      console.log("I'm a callback function being tested", JSON.stringify(success));
      t2.ok(success, "callback should be called with success=true");
      //close the fake window we creatd
      window.close();
      //end the test
      t2.end();
    };

    //call the function we are testing
    insertScripts(jsArray, fn, window);

  });


  t.end();
  
});
