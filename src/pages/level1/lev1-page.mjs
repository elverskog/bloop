export default async function test1() {

  const result = {
    name: "lev1Page",
    title: "Level 1 Page",
    css: `
      .test1 {
        font-size: 25em;
        text-align: center;
      }
      @media (max-width: 30em) {
        .test1 {
          font-size: 20em;
        }
      }
    `,
    markup: `
      <div id="test1" class="test1">
        LV1
      </div>    
    `,
    js: {
      init: function() {
      
        if(typeof window === "object") {
          console.log("INIT LINK");
        }

      }
    }
  };

  return result;
  
}
