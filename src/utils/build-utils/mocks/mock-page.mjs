export default async function mockPage(addModule, args) {

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
        ${ await addModule("../../src/utils/build-utils/mocks/mock-page-inner.mjs", { label: "Label for mock page inner" }) }
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

  return result;
  
}
