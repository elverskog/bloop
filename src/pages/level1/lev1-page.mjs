export default async function test1() {

  const result = {
    name: "test1",
    title: "TEST 1",
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
    script: {
      init: function(args) {
      
        if(typeof window === "object") {
          console.log("INIT LINK");
        }

      }
    }
  }

  return result;
  
}
