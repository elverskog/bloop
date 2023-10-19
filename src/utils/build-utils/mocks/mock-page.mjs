export default async function mockPage() {

  const result = {
    name: "mockPage",
    title: "Mock Page",
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
