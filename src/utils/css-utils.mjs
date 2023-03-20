import postcss from "postcss";
import autoprefixer from "autoprefixer";
//import prefixcomponent from "./prefixcomponent.mjs";
//import PrefixWrap from "postcss-prefixwrap";
import cssnano from "cssnano";
import postcssNesting from 'postcss-nesting';


export async function processCSS(css) {
  if (!css || typeof css !== "string") return;
  //if on prod minify the CSS
  let result;
  if(process.env.NODE_ENV === "production") {
    result = await postcss([cssnano, autoprefixer, postcssNesting]).process(css);
  } else {
    result = await postcss([autoprefixer, postcssNesting]).process(css);
  }
  return result.css;
}


//TODO - add auto prefixer back in
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