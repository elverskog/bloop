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

export function insertStyleSheets(cssObj, fn, scope) {

  //console.log("cssObj: ", cssObj);

  //create an array that just lists the key of each succesfully inserted 
  //I use an object to just automatically avoid duplicates, that would come with an array
  //TODO maybe this can just be a count or a boolean?
  const completed = {};

  //create a interval loop that checks if a stylesheet has been properly added for each module cssObj
  const intervalAll = setInterval( () =>  {
    try {
      //I don't check one by one here as completedArray can't have dupes
      //console.log(Object.keys(completed).length, " vs ", Object.keys(cssObj).length);
      if (Object.keys(completed).length === Object.keys(cssObj).length) {
        //based on if each element in cssObj has "loaded" set (as true)
        clearInterval(intervalAll);
        clearTimeout(timeoutAll);
        fn.call(scope || window, true);
      }
    } catch (e) { } finally { }
  }, 10),                                                   
    //set another slower timer for when to abandon effort
    timeoutAll = setTimeout(() => {       
      //our style sheets process has failed, so clear the the above interval, fire the callback with success as false
      clearInterval(intervalAll);            
      clearTimeout(timeoutAll);              
      fn.call(scope || window, false);
    //}, 15000);
    }, 7000);

  //function to load, validate and insert each into DOM, and update the list of completed modules
  function insertEach(moduleName, css) {

    // console.log("insertEach: ", moduleName, css);

    //if there is already a link with the ID passed, 
    //mark that module as done in "completed" and exit
    const existingMatch = document.getElementById(`${moduleName}Styles`);
    if(existingMatch) {
      // console.log("EXISTING MATCH: ", moduleName);
      completed[moduleName] = true;
      return;
    }

    //create blob for value (CSS string) and turn it into a DOM link element
    const styleBlob = new Blob([css], { type: 'text/css' });
    const objectURL = URL.createObjectURL(styleBlob);
    const linkEl = document.createElement("link");
    linkEl.setAttribute("type", "text/css");
    linkEl.setAttribute("rel", "stylesheet");
    linkEl.setAttribute("href", objectURL);
    linkEl.setAttribute("id", `${moduleName}Styles`);
    
    // get the correct properties to check for depending on the browser
    const sheet = ("sheet" in linkEl) ? "sheet" : "styleSheet";
    const cssRules = ("sheet" in linkEl) ? "cssRules" : "rules";
  
    //start loop to check if stylesheet was loaded (every 10 milliseconds)
    const intervalEach = setInterval( () =>  {
      try {
        if (linkEl[sheet] && linkEl[sheet][cssRules].length) {
          // our style sheet has loaded, clear the counters, mark that module as done in "completed" and exit
          clearInterval(intervalEach);
          clearTimeout(timeoutEach);
          completed[moduleName] = true;
        }
      } catch (e) { } finally { }
    }, 10),                                                   
      //set another slower timer for when to abandon effort
      timeoutEach = setTimeout(() => {
        // console.log(`${ moduleName } failed`);   
        //our style sheet has failed, clear the counters, fire the callback with success as false
        clearInterval(intervalEach);            
        clearTimeout(timeoutEach);
        //the style sheet didn't load, remove the link node from the DOM and return
        //we just compare length so marking it as false in "completed" is not need (TODO maybe)
        //document.head.removeChild(linkEl);                
        return;
      }, 15000);

    //insert the link tag into the DOM and start loading the style sheet
    document.head.appendChild(linkEl);
  
  }
    
  //iterate through cssObject and call function to load, validate and insert each into DOM
  for(const [moduleName, css] of Object.entries(cssObj)) {
    insertEach(moduleName, css);
  }

}



////////////////////////////////////////////////////////////////////////////////////////////
//module/util to add scripts/js to head client side
//accept an object with a string for each module needed
//turn each string of JS into a blob (in memory) and create a link in head
//only running fn once the JS is actually "initialized"
////////////////////////////////////////////////////////////////////////////////////////////

export function insertScripts(scriptsObj, fn, scope) {

  //create an array that just lists the key of each succesfully inserted 
  //I use an object to just automatically avoid duplicates, that would come with an array
  //TODO maybe this can just be a count or a boolean?
  const completed = {};

  //create a interval loop that checks if a stylesheet has been properly added for each module cssObj
  const intervalAll = setInterval( () =>  {
    try {
      //I don't check the value here, one by one here as completedArray can't have dupes
      console.log(Object.keys(completed).length, " vs ", Object.keys(scriptsObj).length);
      if (Object.keys(completed).length === Object.keys(scriptsObj).length) {
        //based on if each element in cssObj has "loaded" set (as true)
        clearInterval(intervalAll);
        clearTimeout(timeoutAll);
        fn.call(scope || window, true);
      }
    } catch (e) { } finally { }
  }, 10),                                                   
    //set another slower timer for when to abandon effort
    timeoutAll = setTimeout(() => {       
      //our style sheets process has failed, so clear the the above interval, fire the callback with success as false
      clearInterval(intervalAll);            
      clearTimeout(timeoutAll);              
      fn.call(scope || window, false);
    }, 7000);

  //function to load, validate and insert each into DOM, and update the list of completed modules
  function insertEach(moduleName, script) {

    //if there is already a link with the ID passed, return success as true and exit
    const existingMatch = document.getElementById(`${moduleName}Script`);
    if(existingMatch) {
      completed[moduleName] = true;
      return;
    }
    
    //create blob for value (JS string) and turn it into a DOM link element
    const scriptBlob = new Blob([script], { type: 'text/javascript' });
    const objectUrl = URL.createObjectURL(scriptBlob);
    const scriptEl = document.createElement("script");
    scriptEl.setAttribute("type", "module");
    scriptEl.setAttribute("src", objectUrl);
    scriptEl.setAttribute("id", `${moduleName}Script`);

    //start loop to check if script was loaded (every 10 milliseconds)
    const intervalEach = setInterval( () =>  {
      try {
        if (typeof window.p_p[moduleName] === "object") {
          // our style sheet has loaded, clear the counters, mark that module as done in "completed" and exit
          clearInterval(intervalEach);
          clearTimeout(timeoutEach);
          completed[moduleName] = true;
        }
      } catch (e) { } finally { }
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
    
  //iterate through scriptsObject and call function to load, validate and insert each into DOM
  for(const [moduleName, script] of Object.entries(scriptsObj)) {
    insertEach(moduleName, script);
  }

}


