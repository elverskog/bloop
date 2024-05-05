export default async function mockPage(data, args) {

  const result = {
    name: data.name,
    title: data.title,
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
        Mock page - ${ data.label }
      </div> 
      <div id="subPage" class="subPage">
      </div> 
    `,
    js: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT MOCK PAGE");
        }
      } 
    } 
  };
  
  return result;
  
}
