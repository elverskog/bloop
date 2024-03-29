import postcss from "postcss";
import autoprefixer from "autoprefixer";
import postcssMinify from "postcss-minify"; 
import postcssNesting from 'postcss-nesting';


export function processCSS(css) {
  if (!css || typeof css !== "string") return;
  //if on prod minify the CSS, on dev keep format to make it easier to read
  const pluginArray = process.env.NODE_ENV === "production" ? [autoprefixer, postcssNesting, postcssMinify] : [autoprefixer, postcssNesting];
  const result = postcss(pluginArray).process(css);
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