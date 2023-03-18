export default async function wrapper(bodyMarkup, title) {
  
  //get menu module
  const menuMod = (await import(`${__basedir}/src/components/menu/menu.mjs`)).default;
  const menu = await menuMod();
  const myTitle = typeof title === "string" ? title : "Bloop";

  //we have to add CSS for wrapper and menu as they are not part of body module stack
  let cssTags = `
    <link id="wrapperStyles" rel="stylesheet" type="text/css" href="/dist/css/wrapper.css" />\n
    <link id="menuStyles" rel="stylesheet" type="text/css" href="/dist/css/menu.css" />\n
  `;

  //we have to add scripts for wrapper as it are not part of body module stack
  let scriptTags = `<script src="/dist/js/wrapper.js" type="text/javascript"></script>\n`;

  //create a css/link tag for each module used in the page, server-side
  if(Object.keys(p_p.hopper.css).length) {
    Object.keys(p_p.hopper.css).forEach( key => {
      cssTags += `<link id="${key}Styles" rel="stylesheet" type="text/css" href="/dist/css/${key}.css" />\n`
    })
  }

  //create a script tag for each module used in the page, server-side
  if(Object.keys(p_p.hopper.script).length) {
    Object.keys(p_p.hopper.script).forEach( key => {
      scriptTags += `<script id="${key}Script" src="/dist/js/${key}.js" type="text/javascript"></script>\n`
    })
  }

  const result = {
    css: `
      body {
        font-family: sans;
      }
    `,
    markup: /*html*/`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${myTitle}</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${cssTags}
        </head>
        <body id="__body">
          <div>
            ${menu.markup}
            <div id="body">
              ${bodyMarkup}
            </div>
          </div>
        </body>
        <script type="text/javascript">
          window.p_p = {};
        </script>
        ${scriptTags}
      </html> 
    `,
    script: {
      init: function() {
        //for forward and back buttons
        window.addEventListener("popstate", event => {
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
      //function to just get the module for the body
      //TODO we can make this more agnostic per what DOM element it updtaes
      getBody: async function(pathname) {
        //exit if not in browser, as this can/should only be run in browser
        if(typeof window !== "object") return;

        const parseAndOutputStream = (await import(`/src/utils/res-utils.mjs`)).parseAndOutputStream;
        const insertStyleSheets = (await import(`/src/utils/dom-utils.mjs`)).insertStyleSheets;
        const insertScripts = (await import(`/src/utils/dom-utils.mjs`)).insertScripts;

        const headers = new Headers();
        headers.append("is-fetch", true);
        const options = { headers };  
        const res = await fetch(pathname, options);
        const resParsed = JSON.parse(await parseAndOutputStream(res));

        //add CSS to head
        if(typeof resParsed.css === "object") {       
          insertStyleSheets(resParsed.css, success => {
            if (success) {
              console.log("insert styles succeeded");
              //replace body HTML
              const targetEl = document.getElementById("body");
              targetEl.innerHTML = resParsed.markup;
              //set page title
              document.title = typeof resParsed.title === "string" ? resParsed.title : "Bloop";
              //add scripts to head
              insertScripts(resParsed.script, success => {
                if(success) {
                  console.log("insert scripts succeeded");
                  //window.p_p[id].init();
                } else {
                  console.log("insert scripts failed");
                }
              }, this);

              
            } else {
              console.log("insert styles failed");
            }
          }, this);
        }

      }
    }

  }

  //Note: we don't add result to hopper here
  //as we need to call and add it as the top level, when we call a full page

  return result;

}