import { validateArgs } from "../utils/validation-utils.mjs";


export default async function pageDefault(pageData) {

  // console.log("PAGE DEFAULT: ", Object.values(pageData));

   // validateArgs(Object.values(pageData), [ "string", "array", "string", "string", "string" ]);

  const result = {
    name: pageData.name,
    title: pageData.title,
    css: `
      h1 {
        font-size: 8em;
        text-align: center;
        margin: 0 auto .35em;
      }
      body {
        font-size: 1em;
      }
      @media (max-width: 30em) {
        h1 {
          font-size: 6em;
        }
        body {
          font-size: .85em;
        }
      }
    `,
    markup: `
      <div id="c" class="c">
        <h1>${ pageData.title }</h1>
        <article>
          ${ pageData.content }
        </article>
      </div>    
    `,
    js: {
      init: function(args) {
        if(typeof window === "object") {
          console.log(`INIT ${ args.name }`);
        }
      },
    },
    initArgs: {
      name: pageData.name 
    } 
  };

  return result;

}
