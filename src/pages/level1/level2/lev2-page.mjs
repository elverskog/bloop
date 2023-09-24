export default async function test2() {

  console.log("TEST 2");

  const result = {
    name: "lev2Page",
    title: "Level 2 Page",
    css: `
      .test2 {
        font-size: 25em;
        text-align: center;
      }
      @media (max-width: 30em) {
        .test2 {
          font-size: 20em;
        }
      }
    `,
    markup: `
      <div id="test2" class="test2">
        LV2
      </div>    
    `,
    script: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT TEST 2");
        }
      } 
    } 
  }

  return result;
  
}
