export default async function login(frame) {

  if(typeof global !== "object") return;

  const buttonFunc = (await import(`${p_p.baseDir}/src/components/button/button.mjs`)).default;
  const button = buttonFunc({ frame, type: "button", label: "Enter" }, "button");

  const result = {
    css: `
      .login {
        width: 450px;
        border: 1px solid #999;
        padding: 15px;
    
        & div {
          padding-bottom: 15px;
        }
    
        & input {
          padding: 10px;
          border: solid 1px #999;
          border-radius: 4px;
          font-kerning: normal;
          font-smooth: auto;
        }
      }
    `,
    markup: `
      <div id="login" class="login">
        <form id="loginForm">
          <div>
            <input type="text" placeholder="Username"></input>
          </div>
          <div>
            <input type="text" placeholder="Password"></input>
          </div>
          <div id="testButton">
            ${ button.markup }
          </div>
        </form>
      </div>    
    `,
    script: {
      init: function() {
        if(typeof window === "object") {
          
          console.log("INIT LOGIN");

          const button = document.getElementById("testButton");
          button.addEventListener("click", event => {
            event.preventDefault();
            console.log("test login button");
          });
          return true;
        }
      } 
    }     
  }

  await p_p.manageHopper.addToHopper(result, "login");
 
  return result;

}

//   const setTitle = (await import(`${__basedir}/src/utils/head-utils.mjs`)).setTitle;
//   setTitle("Login");
  
//   //logut public user out before logging registered user in
//   //HERE: Need to update login component on user change
//   function addLoginFormEvent(loginForm) {
//     if(loginForm) {
//       loginForm.addEventListener("submit", event => {
//         event.preventDefault();
//         remoteDB.logOut( (err, response) => {
//           if(err) {
//             console.log("logout error", err);
//           } else {
//             remoteDB.logIn(event.target[0].value, event.target[1].value).then( async userRes => {
//               user = userRes;
//               //re-render component on login status change
//               const container = document.getElementById("login");
//               const component = await formatComponent(login);
//               container.replaceWith(component);
//             }).catch( err => {
//               console.log("login error", err);
//             });
//           }
//         });
//       });
//     } else {
//       console.error("formElement not found");
//     }  
//   }

//   //need to login public user after we log out private user
//   function addLogoutClickEvent(logoutLink) {
//     logoutLink.addEventListener("click", () => {
//       remoteDB.logOut( (err, response) => {
//         if(err) {
//           console.error(err);
//         } else {
//           console.log("logout response", response);
//           remoteDB.logIn("public", "public").then(async userRes => {
//             user = userRes;
//             //re-render component on login status change
//             const container = document.getElementById("login");
//             const component = await formatComponent(login);
//             container.replaceWith(component);
//           }).catch( err => {
//             console.log("login error", err);
//           });
//         }
//       });
//     });
//   }

//   function html() {
//     if(isBrowser && window.user && window.user.roles.length && window.user.roles.indexOf("registered") > -1) {
//       return /*html*/`
//         <div id="login">
//           <a href="#" id="logoutLink">Log Out</button>
//         </div>
//     `;
//     } else {
//       return /*html*/`
//         <div id="login">
//           <form id="loginForm">
//             <div>
//               <input type="text" placeholder="Username"></input>
//             </div>
//             <div>
//               <input type="text" placeholder="Password"></input>
//             </div>
//             <div>
//               <button type="submit">Enter</button>
//             </div>
//           </form>
//         </div>
//       `;
//     }
//   }

//   async function reRender() {
//     //const childFrag = frag.children;
//     //console.log("childFrag", childFrag)
//     //return childFrag;
//     return await formatComponent(loginForm);
//   }

//   function render() {
//     if(isBrowser) {
//       const frag = document.createRange().createContextualFragment(html().trim());

//       if(window.user && window.user.roles.length && window.user.roles.indexOf("registered") > -1) {
//         const logoutLink = frag.getElementById("logoutLink");
//         addLogoutClickEvent(logoutLink);
//       } else {
//         const loginForm = frag.getElementById("loginForm");
//         addLoginFormEvent(loginForm);
//       }

//       return frag;

//     } else {
//       return html();
//     }
//   }


//   return [render(), css];

// }