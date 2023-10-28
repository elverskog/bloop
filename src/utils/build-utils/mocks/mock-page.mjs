import { stringify } from "postcss";

export default async function mockPage(addModule, args) {

        // ${ (await addModule("../../src/utils/build-utils/mocks/mock-page-inner.mjs", { label: "Label for mock page inner" })).markup }



  const submod = await addModule("../../src/utils/build-utils/mocks/mock-page-inner.mjs", { label: "Label for mock page inner" });

  // console.log("/////////////SUBMOD: ", submod);

  // ${ stringify(submod) }

  const result = {
    name: "mockPage",
    title: "Mock Page",
    css: `
      .mockpage {
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
      <div id="mock" class="mockpage">
        Mock page - ${ args.label }
      </div> 
      <div id="subPage" class="subPage">
      </div> 
    `,
    script: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT MOCK PAGE");
        }
      } 
    } 
  };

  
  // console.log("/////////////SUBMOD RESULT: ", result);

  return result;
  
}
