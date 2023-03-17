//handle a component that retuns html (or a DOM fragment) and CSS
export async function formatComponent(component, args) {

  if(!component) return;

  //run the component passed in, with or without args
  const componentResult = Array.isArray(args) ? await component(...args) : await component();

  //console.log("component result: ", component.name, "\n", componentResult);

  if(!isBrowser) {
    //handle css by passing it to parseCSS function
    //componentResult should typically return an array of objects, the second, if there is one, being CSS
    const css = (typeof componentResult === "object" && componentResult.length === 2) ? componentResult[1] : undefined;
    if(css && typeof css === "string") {
      const parseCSS = (await import(`${__basedir}/src/utils/css-utils.mjs`)).parseCSS;
      parseCSS(component.name, css);
    }
  }

  //define hhtml
  //is componentResult a single HTML string (or fragment) or an array with a CSS string included
  const html = (typeof componentResult === "object" && componentResult.length === 2) ? componentResult[0] : componentResult;
 



  //a rehype plugin to insert a CSS class
  //at the top level of the html/component, based on the component's (module's) name




  function rehypeInsertClassPlugin(options) {

    const visit = options.visit;

    return (tree) => {
      visit(tree, 'element', (node) => {
        //tree from rehypeDom is diferent then in node
        //TODO - this is legacy as in the DOM (with fragments) we don't need rehype
        if(isBrowser) {
          node.properties["class"] = component.name;
        } else {
          if(node.position && node.position.start.offset === 0) {
            node.properties["class"] = component.name;
          }  
        } 
      })
    }
  }
    
  //process strings of HTML on the server
  if(typeof html === "string" && !isBrowser) {

    const visit = (await import("unist-util-visit")).visit;
    const rehype = (await import("rehype")).rehype;

    //for the main wrapper we don't want to turn it into a fragment
    //as that conflicts with having a head
    //and we don't need to add a class at the top level
    if(component.name === "PagesWrapper") {
      return html;
    } else {
      const frag = await rehype()
      .data('settings', {fragment: true})
      .use(rehypeInsertClassPlugin, { visit })
      .process(html.trim());
      return frag.value;
    }

  //if the HTML is a fragment, not a promise and we are in the browser...
  } else if(typeof html === "object" && typeof html.then !== "function" && isBrowser) {

    //add class name to containing element    
    html.class = component.name;
    html.firstChild.className = component.name;

    //process any links found
    const route = (await import(`${__basedir}/src/utils/req-utils.mjs`)).route;
    function handleLinks(fragment) {
      fragment.childNodes.forEach( child => {
        if(child.tagName === "A") {
          child.addEventListener("click", event => route(event));
        }
      })
    }

    handleLinks(html.firstChild);

    return html;
  } else {
    console.log(`component ${component.name} passed to formatComponent is invalid`, component)
    return "There was an error";
  }

}


export async function createDistAutoRunFile(codeArray, fileName) {

  //write this function to file so the browser can retrieve it
  //add !() around it so that it will auto execute on load
  //TODO: later I'll maybe move this file to be generated via bundling or similar
  //note: I can get away with this (for now) because the main.mjs file (should) be universal to all users/sessions

  const codeString = modulesArray.join["\n\n"]

  if (!isBrowser) {
    const fs = await import("fs");
    //fs.writeFile(`${__basedir}/dist/js/main.js`, `!${main.toString()}(${JSON.stringify(reqObject)});\n\n`, err => {
    fs.writeFile(`${__basedir}/dist/js/main.js`, `!${module.toString()}('${reqUrl}', '${JSON.stringify(validPageDirs)}');\n\n`, err => {
      if(err) {
        console.error(err);
      }
    });
  }
}
