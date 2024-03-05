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
//accept an object with a string for each module needed
//turn each string of CSS into a blob (in memory) and create a link in head
//only running fn once the CSS is actually "initialized" (so we can then update the HTML and add scripts) 
////////////////////////////////////////////////////////////////////////////////////////////

export function insertStyleSheets(cssArray, fn, scope) {

  console.log("CSS ARRAY: ", cssArray);

  //create an array that just lists the key of each succesfully inserted 
  //I use an object to just automatically avoid duplicates, that would come with an array
  //TODO maybe this can just be a count or a boolean?
  const completed = {};

  //create a interval loop that checks if a stylesheet has been properly added for each module cssArray
  const intervalAll = setInterval(() =>
    {
      try {
        //I don't check one by one here as completedArray can't have dupes
        if (Object.keys(completed).length === Object.keys(cssArray).length) {
          //based on if each element in cssArray has "loaded" set (as true)
          clearInterval(intervalAll);
          clearTimeout(timeoutAll);
          fn.call(scope || window, true);
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
      fn.call(scope || window, "false");
    //}, 15000);
    }, 7000);

  //function to load, validate and insert each into DOM, and update the list of completed modules
  function insertEach(name, val) {

    console.log("NAME: ", name);
    console.log("VAL: ", val);

    //if there is already a link with the ID passed, 
    //mark that module as done in "completed" and exit
    const existingMatch = document.getElementById(`${name}Styles`);
    if(existingMatch) {
      completed[name] = true;
      return;
    }

    //create blob for value (CSS string) and turn it into a DOM link element
    const styleBlob = new Blob([val], { type: "text/css" });
    const objectURL = URL.createObjectURL(styleBlob);
    const linkEl = document.createElement("link");
    linkEl.setAttribute("type", "text/css");
    linkEl.setAttribute("rel", "stylesheet");
    linkEl.setAttribute("href", objectURL);
    linkEl.setAttribute("id", `${name}Styles`);
    
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
            completed[name] = true;
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
    
  //iterate through cssArray and call function to load, validate and insert each into DOM
  // console.log("CSS ARRAY ===== ", cssArray);
  for(const cssObject of cssArray) {
    insertEach(cssObject.name, cssObject.val);
  }

}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//module/util to add scripts/js to head client side
//accept an object with a string for each module needed
//turn each string of JS into a blob (in memory) and create a link in head
//only running fn once the JS is actually "initialized"
//arguments:
//jsObj - key equals the module name, value is the script as a string
//fn - a callback function - see utilization of function for clarity
//scope - the scope the callabck function is called (TODO - may get rid of this)
//document - this is really just needed for unit testing. Where puppeteer is used to create a DOM on the server
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function insertScripts(js, fn, window) {

  console.log("JS ..... ", js);

  //run callback with false if window doesn't exist
  if(typeof window !== "object") {
    fn.call(window, false);
  }

  //if window.p_p doesn't exist create it
  if(typeof window.p_p !== "object") {
    window.p_p = {};
  }

  //for unit testing (test uses JSDOM to pass in a "fake" window)
  const document = window.document;

  //create an array that just lists the key of each succesfully inserted 
  //I use an object to just automatically avoid duplicates, that would come with an array
  //TODO maybe this can just be a count or a boolean?
  const completed = {};

  //interval to check the completed object, to see if it matches the length of the passed in jsObj 
  const intervalAll = setInterval(() =>
    {
      try {
        //I don't check the value here, one by one here, as completedArray can't have dupes
        if (Object.keys(completed).length === Object.keys(js).length) {
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
      //our script insertion process has failed, so clear the the above interval, fire the callback with success as false
      clearInterval(intervalAll);            
      clearTimeout(timeoutAll);              
      fn.call(window, false);
    }, 7000);

  //function to load, validate and insert each into DOM, and update the list of completed modules
  function insertEach(jsObj) {

    console.log("INSERTEACH JSOBJ: ", jsObj);
    console.log("INSERTEACH JSOBJ VAL: ", jsObj.val);

    if(typeof jsObj?.name !== "string" || typeof jsObj?.val !== "object" || !Object.keys(jsObj.val).length) {
      console.log("insertEach passed bad value");
      return;
    }

    //if there is already a link with the ID passed, return success as true and exit
    const existingMatch = document.getElementById(`${jsObj}Script`);
    if(existingMatch) {
      completed[jsObj.name] = true;
      return;
    }
    
    //create blob for value (JS string) and turn it into a DOM link element
    const scriptBlob = new Blob([jsObj.val], { type: "text/javascript" });
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
            completed[jsObj.name] = true;
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
    
  //iterate through jsObject and call function to load, validate and insert each into DOM
  for(const jsObj of js) {
    console.log("JS OBJ ---- ", jsObj);
    insertEach(jsObj);
  }

}
