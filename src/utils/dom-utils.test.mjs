import tap from "tap";
import { JSDOM } from "jsdom";
import { insertScripts } from "./dom-utils.mjs";


tap.test('insertScripts function', t => {

  t.test('insertScripts should insert all scripts into DOM', async (t2) => {

    //insertScripts needs a script object, the value on the right will be the script
    //but we don't care here if the script is valid JS
    //note: the src will be hash-blob pointing at this "script"
    const scriptsObj = {
      script1: 'script1',
      script2: 'script2")',
      script3: 'script3")'
    };

    //our fake window
    const window = (new JSDOM(`<!DOCTYPE html><html><body></body></html>`)).window;

    //insertScripts wants a callback
    const fn = function(success) {
      console.log("I'm a callback function");
    };

    // Wait for the window to finish loading
    window.addEventListener('load', () => {

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
    insertScripts(scriptsObj, fn, window);

    //thought we might need a time out but doesn't seem like it
    //await new Promise(resolve => setTimeout(resolve, 7000));

    //close the fak window we creatd
    window.close();

    //end the test
    t2.end();

  });



//   t.test('insertScripts inserts script tags into the DOM', t => {
//     const scriptsObj = {
//       module1: 'console.log("module1 loaded")',
//       module2: 'console.log("module2 loaded")'
//     };
  
//     // Mock document.createElement
//     const document = {};
//     const originalCreateElement = document.createElement;
//     document.createElement = function(tagName) {
//       return { tagName };
//     }
  
//     insertScripts(scriptsObj, (success) => {
//       t.test.ok(success, 'insertScripts returns success=true when all scripts have been loaded');
//       t.test.equal(document.querySelectorAll('script').length, 2, 'insertScripts inserts 2 script tags into the DOM');
//       t.test.equal(document.querySelectorAll('script[type="module"]').length, 2, 'insertScripts inserts 2 script tags with type="module" into the DOM');
//       t.test.equal(document.querySelectorAll('script[src^="blob:"]').length, 2, 'insertScripts inserts 2 script tags with src starting with "blob:" into the DOM');
//       t.test.equal(document.querySelectorAll('script[id$="Script"]').length, 2, 'insertScripts inserts 2 script tags with an id ending in "Script" into the DOM');
  
//       // Restore document.createElement
//       document.createElement = originalCreateElement;
//       t.test.end();
//     }, this);
//   });
  

  // t.test('insertScripts should insert scripts into the DOM and call the callback with success=true when all scripts have loaded', t2 => {
  //   // set up a fake DOM with a mocked version of the 'window.p_p' object
  //   global.document = {
  //     getElementById: () => null,
  //     body: {
  //       appendChild: () => {}
  //     }
  //   };
  //   global.window = {
  //     p_p: {}
  //   };

  //   // create an object with two scripts to insert
  //   const scriptsObj = {
  //     script1: 'console.log("script 1 loaded");',
  //     script2: 'console.log("script 2 loaded");'
  //   };

  //   // set up a mock callback function
  //   const mockCallback = (success) => {
  //     t2.test.ok(success, 'callback should be called with success=true');
  //     t2.test.end();
  //   };

  //   // call the function to insert the scripts
  //   insertScripts(scriptsObj, mockCallback);

  // });

  // test('insertScripts should call the callback with success=false if a script fails to load', t => {
  //   // set up a fake DOM with a mocked version of the 'window.p_p' object
  //   global.document = {
  //     getElementById: () => null,
  //     body: {
  //       appendChild: () => {}
  //     }
  //   };
  //   global.window = {
  //     p_p: {}
  //   };

  //   // create an object with one script that will fail to load
  //   const scriptsObj = {
  //     script1: 'console.log("script 1 loaded");'
  //   };

  //   // set up a mock callback function
  //   const mockCallback = (success) => {
  //     t.notOk(success, 'callback should be called with success=false');
  //     t.end();
  //   };

  //   // call the function to insert the scripts
  //   insertScripts(scriptsObj, mockCallback);
  // });

  // test('insertScripts should skip scripts that are already in the DOM', t => {
  //   // set up a fake DOM with a mocked version of the 'window.p_p' object
  //   global.document = {
  //     getElementById: (id) => id === 'script1Script' ? {} : null,
  //     body: {
  //       appendChild: () => {}
  //     }
  //   };
  //   global.window = {
  //     p_p: {}
  //   };

  //   // create an object with two scripts to insert, one of which is already in the DOM
  //   const scriptsObj = {
  //     script1: 'console.log("script 1 loaded");',
  //     script2: 'console.log("script 2 loaded");'
  //   };

  //   // set up a mock callback function
  //   const mockCallback = (success) => {
  //     t.ok(success, 'callback should be called with success=true');
  //     t.end();
  //   };

  //   // call the function to insert the scripts
  //   insertScripts(scriptsObj, mockCallback);
  // });

  t.end();
  
});
