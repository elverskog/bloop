import postcss from "postcss";
import autoprefixer from "autoprefixer";
//import prefixcomponent from "./prefixcomponent.mjs";
//import PrefixWrap from "postcss-prefixwrap";
import postcssNesting from 'postcss-nesting';


export function processCSS(css) {
  if (!css || typeof css !== "string") return;
  return postcss([postcssNesting]).process(css).css;
}



// export function parseCSSOLD(moduleName, css) {

//   //console.log("parseCSS componentName: ", componentName);

//   if(!css || typeof css !== "string") return;

//   postcss([autoprefixer, postcssNesting])
//     .process(css)
//     .then(result => {
//       if (!cssObj[moduleName]) {
//         cssObj[moduleName] = result.css;
//       }
//     })

// }