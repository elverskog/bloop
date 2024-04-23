import { parseAndOutputStream } from "../utils/res-utils/res-utils.mjs";
import { insertStyleSheets, insertEachStyleSheet, insertScripts, insertEachScript } from "../utils/dom-utils.mjs";
import { page } from "../utils/build-utils/build-page-utils.mjs";


export default async function wrapper(args) {
 
  const { moduleRes } = args;
  const bodyMarkup = moduleRes.markup;
  const title = typeof moduleRes.title === "string" ? moduleRes.title : "Bloop";

  //keep track of what css tags have been added (e.g. link may appear many times on a page)
  const addedCssNames = [ "wrapper", "menu" ];
  //add CSS for wrapper and menu as they are not part of body module stack
  let cssTags = `
    <link id="wrapperStyles" rel="stylesheet" type="text/css" href="/dist/css/wrapper.css" />\n
    <link id="menuStyles" rel="stylesheet" type="text/css" href="/dist/css/menu.css" />\n
  `;

  //get menu module
  const menuRes = await page.addModule("src/components/menu.mjs");

  //create a css/link tag for each module used in the page, server-side
  if(moduleRes.css.length) {
    moduleRes.css.forEach( obj => {
      if(typeof obj.val === "string" && typeof obj.name === "string" && typeof obj.modulePath === "string" && !addedCssNames.includes(obj.name)) {
        addedCssNames.push(obj.name);
        const cssPath = obj.modulePath.replace("src/", "/dist/")
          .replace("components/", "css/")
          .replace("pages/", "css/")
          .replace(".mjs", ".css");
        cssTags += `<link id="${obj.name}Styles" rel="stylesheet" type="text/css" href="${cssPath}" />\n`;
      }
    });
  }


  //keep track of what scripts have been added (e.g. link may appear many times on a page)
  const addedJsNames = [ "wrapper" ];
  //string to store the js tags we will add by footer
  //add scripts for wrapper as it are not part of body module stack
  let jsTags = "<script id=\"wrapperScript\" src=\"/dist/js/wrapper.js\" type=\"text/javascript\"></script>\n";

  //create a js/script tag for each module used in the page, server-side
  if(moduleRes.js.length) {
    //reverse the order, as we want to make sure we load the main page's js last
    ////as it may have init tags for
    //we need to clone it otherwise it messes up the write.js
    const jsRev = [...moduleRes.js].reverse();
    jsRev.forEach( obj => {
      if(typeof obj.val === "string" && typeof obj.name === "string" && typeof obj.modulePath === "string" && !addedJsNames.includes(obj.name)) {
        addedJsNames.push(obj.name);
        const path = obj.modulePath.replace("src/", "/dist/")
          .replace("components/", "js/")
          .replace("pages/", "js/")
          .replace(".mjs", ".js");
        jsTags += `<script id="${obj.name}Script" type="text/javascript" src="${path}"></script>\n`;
      }
    });
  }

  const result = {
    name: "wrapper",
    css: `
      body {
        font-family: sans;
        margin: 0;
      }
      #wrapper {
        margin: 0 auto;
        position: relative;
        max-width: 640px;
      }
      #content {
        padding: 15px;
        color: #333;
      }
    `,
    markup: /*html*/`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${title}</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${cssTags}
        </head>
        <body id="__body">
          <div id="wrapper">
            ${menuRes.markup}
            <div id="content">
              ${bodyMarkup}
            </div>
          </div>
        </body>
        <script type="text/javascript">
          window.p_p = {};
        </script>
        ${jsTags}
      </html> 
    `,
    js: {
      init: function() {
        //for forward and back buttons
        window.addEventListener("popstate", () => {
          p_p.wrapper.getBody(window.location.pathname);
        });
        //for script based changes to change current page
        window.addEventListener("pathnameChanged", eventObj => {
          //pathnameChanged event needs to pass in a URL, we can at least make sure it's a string
          if(typeof eventObj.detail === "string") {
            p_p.wrapper.getBody(eventObj.detail);
          }
        });
      },
      parseAndOutputStream,
      insertStyleSheets,
      insertEachStyleSheet,
      insertEachScript,
      insertScripts,

      //function to just get the module for the body
      //TODO we can make this more agnostic per what DOM element it updates
      getBody: async function(pathname) {
        //exit if not in browser, as this can/should only be run in browser
        if(typeof window !== "object") return;

        // const parseAndOutputStream = (await import(`/src/utils/res-utils.mjs`)).parseAndOutputStream;
        // const insertStyleSheets = (await import(`/src/utils/dom-utils.mjs`)).insertStyleSheets;
        // const insertScripts = (await import(`/src/utils/dom-utils.mjs`)).insertScripts;

        const headers = new Headers();
        headers.append("is-fetch", true);
        const options = { headers };  
        const res = await fetch(pathname, options);
        const parsedResStream = await p_p.wrapper.parseAndOutputStream(res);
        console.log("PARSED RES: ", parsedResStream);
        const resParsed = JSON.parse(parsedResStream);

        // return;

        //add CSS to head
        if(typeof resParsed.css === "object") {       
          p_p.wrapper.insertStyleSheets(resParsed.css, success => {
            if (success) {
              console.log("insert styles succeeded");
              //replace body HTML
              const targetEl = document.getElementById("content");
              targetEl.innerHTML = resParsed.markup;
              //set page title
              document.title = typeof resParsed.title === "string" ? resParsed.title : "Bloop";
              //add scripts by footer

              if (typeof resParsed.js[Symbol.iterator] === "function") {
                p_p.wrapper.insertScripts(resParsed.js, success => {
                  if(success) {
                    console.log("insert scripts succeeded");
                  } else {
                    console.log("insert scripts failed");
                  }
                }, window);
              }

            } else {
              console.log("insert styles failed");
            }
          }, window);
        }

      }
    }

  };

  return result;

}
