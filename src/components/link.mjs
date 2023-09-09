export default async function link (args) {

  const domReady = (await import(`${p_p.baseDir}/src/utils/dom-utils.mjs`)).domReady;
  
  let { label, pathname } = args;
  // let html = `<a class="link" id="${ pathname }" href="${ pathname }">${ label }</a>`;

  if(typeof window === "object") {

    domReady(() => {
      
      const el = document.getElementById(pathname);
      if(typeof el === "object") {
        el.addEventListener("click", event => {
          event.preventDefault();
          //only get the data and update the URL if we are not on the page for the link
          if(window.location.pathname !== pathname) {
            
            //update the URL and history
            window.history.pushState({ path: pathname }, "", pathname);

            //dispatch an event that frame will hear and then call for new body markup
            //we do this because the popstate event only fires on forward or back clicks
            const event = new CustomEvent("pathnameChanged", { detail: pathname });
            window.dispatchEvent(event);

          }  
        });
      }
    });
    
  }

  const result = {
    name: "link",
    css: `
      a.link {
        text-decoration: none;
      }`,
    markup: `<a class="link" id="${ pathname }" href="${ pathname }">${ label }</a>`,
    script: {
      init: function(args) {
      
        if(typeof window === "object") {

          console.log("INIT LINK");
          
          const { pathname } = args;
          const el = document.getElementById(pathname);
          
          if(typeof el === "object") {
            el.addEventListener("click", event => {
              event.preventDefault();
              //only get the data and update the URL if we are not on the page for the link
              if(window.location.pathname !== pathname) {
                
                //update the URL and history
                window.history.pushState({ path: pathname }, "", pathname);
    
                //dispatch an event that frame will hear and then call for new body markup
                //we do this because the popstate event only fires on forward or back clicks
                const event = new CustomEvent("pathnameChanged", { detail: pathname });
                window.dispatchEvent(event);
    
              }  
            });
          }

        }

      }
    },
    // args: { pathname }
    initArgs: { pathname }
  };

  //add result to hopper
  // if(p_p?.isServer) {
  //   p_p.manageHopper.addToHopper(result, "link");
  // }
  
  return result;
  
}



// script: (args) => {
//   if(typeof window === "object") {

//     const { pathname } = args;
//     const el = document.getElementById(pathname);
    
//     if(typeof el === "object") {
//       el.addEventListener("click", event => {
//         event.preventDefault();
//         //only get the data and update the URL if we are not on the page for the link
//         if(window.location.pathname !== pathname) {
          
//           //update the URL and history
//           window.history.pushState({ path: pathname }, "", pathname);

//           //dispatch an event that frame will hear and then call for new body markup
//           //we do this because the popstate event only fires on forward or back clicks
//           const event = new CustomEvent("pathnameChanged", { detail: pathname });
//           window.dispatchEvent(event);

//         }  
//       });
//     }

//   }

// },