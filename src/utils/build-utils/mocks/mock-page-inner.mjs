export default async function mockPageInner(addModule, args) {

  const { label } = args;

  const result = {
    name: "mockPageInner",
    title: "Mock Page Inner",
    css: `
      .innerThing {
        font-size: 25em;
        text-align: center;
      }
      @media (max-width: 20em) {
        .innerThing {
          font-size: 18em;
        }
      }
    `,
    markup: `
      <div id="inner" class="innerThing">
        Mock page inner - ${ label }
      </div>    
    `,
    script: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT MOCK PAGE INNER");
        }
      } 
    } 
  };

  return result;
  
}
