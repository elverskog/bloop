// export function domReady(fn) {
//   // If we're early to the party
//   document.addEventListener("DOMContentLoaded", fn);
//   // If late; I mean on time.
//   if (document.readyState === "interactive" || document.readyState === "complete") {
//     fn();
//   }
// }


////////////////////////////////////////////////////////////////////////////////////////////
//module/util to add stylesheets to head client side
//accept an array of objects { name, val } with val as a string for each module needed
//turn each string of CSS into a blob (in memory) and create a link in head
//only running fn once the CSS is actually "initialized" (so we can then update the HTML and add scripts) 
////////////////////////////////////////////////////////////////////////////////////////////

//function to load, validate and insert each into DOM, and update the list of completed modules
// function insertEachStyleSheet(name, val) {
export function insertEachStyleSheet(cssObj, completedList, document) {

  if(typeof cssObj?.name !== "string" || typeof cssObj?.val !== "string") {
    return "insertEach passed invalid args";
  }

  //if stylesheet for module is already in document 
  //mark that module as done in "completed" and exit
  //we check actual doc as oppose to some list, to be more assured
  const existingMatch = document.getElementById(`${cssObj.name}Styles`);
  if(existingMatch) {
    completedList[cssObj.name] = true;
    return;
  }

  //create blob for value (CSS string) and turn it into a DOM link element
  const styleBlob = new Blob([ cssObj.val ], { type: "text/css" });
  const objectURL = URL.createObjectURL(styleBlob);
  const linkEl = document.createElement("link");
  linkEl.setAttribute("type", "text/css");
  linkEl.setAttribute("rel", "stylesheet");
  linkEl.setAttribute("href", objectURL);
  linkEl.setAttribute("id", `${cssObj.name}Styles`);
  
  // get the correct properties to check for depending on the browser
  const sheet = ("sheet" in linkEl) ? "sheet" : "styleSheet";
  const cssRules = ("sheet" in linkEl) ? "cssRules" : "rules";

  //start loop to check if stylesheet was loaded (every 10 milliseconds)
  const intervalEach = setInterval( () =>
    {
      try {
        if (linkEl[sheet] && linkEl[sheet][cssRules].length) {
          // our style sheet has loaded, clear the counters, mark that module as done in "completed" and exit
          clearInterval(intervalEach);
          clearTimeout(timeoutEach);
          completedList[cssObj.name] = true;
        }
      } catch (err) { 
        console.error(err);
      }
    }, 10),                                                   
    //set another slower timer for when to abandon effort
    timeoutEach = setTimeout(() => {
      //our style sheet has failed, clear the counters, fire the callback with success as false
      clearInterval(intervalEach);            
      clearTimeout(timeoutEach);
      //the style sheet didn't load, remove the link node from the DOM and return
      //we just compare length so marking it as false in "completed" is not need (TODO maybe)
      document.head.removeChild(linkEl);                
      return;
    }, 15000);

  //insert the link tag into the DOM and start loading the style sheet
  document.head.appendChild(linkEl);

}


export function insertStyleSheets(cssArray, fn, window) {

  //create an array that just lists the key of each succesfully inserted 
  //I use an object to just automatically avoid duplicates, that would come with an array
  //TODO maybe this can just be a count or a boolean?
  const completedList = {};


  // if window.p_p doesn't exist create it
  // and add wrapper.insertEachScript to it
  // this is for testing
  //for unit testing (test uses JSDOM to pass in a "fake" window)
  
  const thisDocument = typeof document !== "object" ? window.document : document;

  if(typeof window.p_p !== "object") {
    window.p_p = {};
    window.p_p.wrapper = {};
    window.p_p.wrapper.insertEachStyleSheet = insertEachStyleSheet;
  }


  //create a interval loop that checks if a stylesheet has been properly added for each module cssArray
  const intervalAll = setInterval(() =>
    {
      try {
        //I don't check one by one here as completedArray can't have dupes
        if (Object.keys(completedList).length === Object.keys(cssArray).length) {
          //based on if each element in cssArray has "loaded" set (as true)
          clearInterval(intervalAll);
          clearTimeout(timeoutAll);
          fn.call(window, true);
        }
      } catch (err) {
        console.error(err);
      }
    }, 10),                                                   
    //set another slower timer for when to abandon effort
    timeoutAll = setTimeout(() => {       
      //our style sheets process has failed, so clear the the above interval, fire the callback with success as false
      clearInterval(intervalAll);            
      clearTimeout(timeoutAll);              
      fn.call(window, "false");
    //}, 15000);
    }, 7000);

   
  //iterate through cssArray and call function to load, validate and insert each into DOM
  for(const cssObj of cssArray) {
    try {
      window.p_p.wrapper.insertEachStyleSheet(cssObj, completedList, thisDocument);
    } catch (error) {
      throw new TypeError(error); 
    }
  }

}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//module/util to add scripts/js to head client side
//accept an object with a string for each module needed
//turn each string of JS into a blob (in memory) and create a link in head
//only running fn once the JS is actually "initialized"
//arguments:
//js - an array of objects { name, val, etc } where val is the actual js
//fn - a callback function - see utilization of function for clarity
//scope - the scope the callabck function is called (TODO - may get rid of this)
//document - this is really just needed for unit testing. Where puppeteer is used to create a DOM on the server
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


//function to load, validate and insert each into DOM, and update the list of completed modules
export function insertEachScript(jsObj, completedList, document) {

  if(typeof jsObj?.name !== "string" || typeof jsObj?.val !== "string") {
    return "insertEach passed invalid args";
  }

  //if stylesheet for module is already in document 
  //mark that module as done in "completed" and exit
  //we check actual doc as oppose to some list, to be more assured
  const existingMatch = document.getElementById(`${jsObj}Script`);
  if(existingMatch) {
    completedList[jsObj.name] = true;
    return;
  }
  
  //create blob for value (JS string) and turn it into a DOM link element
  const jsValWithP_P = `window.p_p.${ jsObj.name } = ${ jsObj.val }`;
  const scriptBlob = new Blob([jsValWithP_P], { type: "text/javascript" });
  const objectUrl = URL.createObjectURL(scriptBlob);
  const scriptEl = document.createElement("script");
  scriptEl.setAttribute("type", "module");
  scriptEl.setAttribute("src", objectUrl);
  scriptEl.setAttribute("id", `${jsObj.name}Script`);

  //start loop to check if script was loaded (every 10 milliseconds)
  const intervalEach = setInterval( () =>  
    {
      try {
        //TODO: I'm not sure if this is OK (or maybe better)
        //here we just test if the script element was created but we don't know if the script got atached to window
        //the problem is that for unit testing, it seems JSDOM doesn't actually run the script inserted???
        //also not testing the script being attached to window is actually more agnostic because the script may conceivably not do that 
        //if (typeof window.p_p[moduleName] === "object") {
        if (typeof document.getElementById("#{moduleName}Script") === "object") {
          // our style sheet has loaded, clear the counters, mark that module as done in "completed" and exit
          clearInterval(intervalEach);
          clearTimeout(timeoutEach);
          completedList[jsObj.name] = true;
        }
      } catch (err) {
        console.error(err);
      }
    }, 10),                                                   
    //set another slower timer for when to abandon effort
    timeoutEach = setTimeout(() => {
      //our script insert has failed, clear the counters and return
      clearInterval(intervalEach);            
      clearTimeout(timeoutEach);
      return;
    }, 7000);

  //insert the script tag into the DOM
  document.body.appendChild(scriptEl);

}


export function insertScripts(js, fn, window) {

  if (js === null || typeof js !== "object" && typeof js[Symbol.iterator] !== "function") {
    throw new TypeError("insertScript passed invalid js array");
  }
  if (typeof fn !== "function") {
    throw new TypeError("insertScript passed invalid callback function");
  }
  if (typeof window?.document !== "object") {
    throw new TypeError("insertScript passed invalid window");
  }

  //create an array that just lists the key of each succesfully inserted script; to avoid dupes 
  const completedList = {};


  //run callback with false if window doesn't exist
  if(typeof window !== "object") {
    fn.call(window, false);
  }

  // if window.p_p doesn't exist create it
  // and add wrapper.insertEachScript to it
  // this is for testing
  //for unit testing (test uses JSDOM to pass in a "fake" window)
  
  const thisDocument = typeof document !== "object" ? window.document : document;

  if(typeof window.p_p !== "object") {
    window.p_p = {};
    window.p_p.wrapper = {};
    window.p_p.wrapper.insertEachScript = insertEachScript;
  }


  //interval to check the completed object, to see if it matches the length of the passed in jsObj 
  const intervalAll = setInterval(() =>
    {
      try {
        //I don't check the value here, one by one here, as completedArray can't have dupes
        if (Object.keys(completedList).length === Object.keys(js).length) {
          //based on if each element in script has "loaded" set (as true)
          clearInterval(intervalAll);
          clearTimeout(timeoutAll);
          fn.call(window, true);
        }
      } catch (err) {
        console.error(err);
      }
    }, 10),                                                   
    //set another slower timer for when to abandon effort
    timeoutAll = setTimeout(() => {       
      //script insertion process failed, so clear the the above interval, fire the callback with success as false
      clearInterval(intervalAll);            
      clearTimeout(timeoutAll);              
      fn.call(window, false);
    }, 7000);

   
  // console.log("JS ---- ", js);
  // console.log("JS ITERATOR ---- ", js[Symbol.iterator]);

  //iterate through jsObject and call function to load, validate and insert each into DOM
  for(const jsObj of js) {
    try {
      window.p_p.wrapper.insertEachScript(jsObj, completedList, thisDocument);
    } catch (error) {
      throw new TypeError(error); 
    }
  }

}
