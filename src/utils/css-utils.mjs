import postcss from "postcss";
import autoprefixer from "autoprefixer";
//import prefixcomponent from "./prefixcomponent.mjs";
//import PrefixWrap from "postcss-prefixwrap";
import cssnano from "cssnano";
import postcssNesting from 'postcss-nesting';


export function processCSS(css) {
  if (!css || typeof css !== "string") return;
  //if on prod minify the CSS
  const pluginArray = process.env.NODE_ENV === "production" ? [cssnano, autoprefixer, postcssNesting] : [autoprefixer, postcssNesting] 
  const result = postcss(pluginArray).process(css);
  //console.log("POSTCSS RESULT", result);
  return result.css;
}


//TODO - see if we want to add auto prefix of module name
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