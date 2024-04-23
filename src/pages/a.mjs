// import { page } from "../utils/build-utils/build-page-utils.mjs";



export default async function a() {

  const result = {
    name: "a",
    title: "A",
    css: `
      .a {
        font-size: 35em;
        text-align: center;
      }
      @media (max-width: 30em) {
        .a {
          font-size: 20em;
        }
      }
    `,
    markup: `
      <div id="a" class="a">
        A
      </div>    
    `,
    js: {
      init: function(args) {
        if(typeof window === "object") {
          console.log(`INIT A arg: ${ args.x }`);
        }
      } 
    },
    initArgs: {
      x: "xxxxxxx" 
    }
  };

  return result;
  
}
