export default async function menuItem (label, pathname) {

  const link = await (await import(`${p_p.baseDir}/src/components/link.mjs`)).default(label, pathname);

  const result = {
    css: `
      .menu menuitem a {
        margin: 10px;
        background-color: #333;
        color: #fff;
        display: block;
        font-size: 1em;
        font-weight: 600;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;

        & a.active {
          background-color: #666;
        }

      }
      @media(max-width: 30em) {
        .menu menuitem a {
          font-size: 0.75em;
          width: 35px;
          height: 35px;
          line-height: 35px;
        }
      }
    `,
    markup: `
      <menuitem>
        ${ link.markup }
      </menuitem>
    `
  };

  //add result to hopper
  if(p_p.isServer) {
    p_p.manageHopper.addToHopper(result, "menuItem");
  } 

  return result;

}

// function menuItemOLD (label, pathname) {

//   const css = `
//     .menu menuitem {
//       margin-right: 10px;

//       & a {
//         text-decoration: none;
//         padding: 5px 10px;
//         background-color: #999;
//         color: #fff;
//       }

//       & a.active {
//         background-color: #666;
//       }
//     }`;

//   function html() {
  
//     //is the menu item active
//     const currentPathname = (isBrowser && document?.location?.pathname) ? document.location.pathname : global.pathname;
//     const classActive = currentPathname === pathname ? ` class="active" ` : "";

//     return `
//       <menuitem>
//         <a href="${ pathname }" ${ classActive }>${ label }</a>
//       </menuitem>
//     `
//   }

//   function render() {
//     if(isBrowser) {
//       const frag = document.createRange().createContextualFragment(html().trim());
//       let div = document.createElement("div");
//       div.innerHTML = "TEST"
//       frag.append(div);
//       return frag;
//       //return "cccc";
//     } else {
//       return html();
//     }
//   }

//   //listen for changes to title and rerender as needed
//   if(isBrowser) {
//     const titleEl = document.querySelector("title");
//     const headerTitle = document.getElementById("headerTitle");
//     if(headerTitle) {
//       const observer = new MutationObserver( mutations => {
//         headerTitle.innerHTML = document.title;
//       });
//       observer.observe(titleEl, {attributes: false, childList: true, subtree: false });
//     }
//   }

//   return [render(), css];

// }

// // export default function (label, pathname) {
// //   const [ ...args ] = arguments;
// //   args.sort(function (a, b) { return a - b; });
// //   return formatComponent(menuItem, args);
// // }

// //export default menuItem;
