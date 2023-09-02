export default async function test1() {

  console.log("LEVEL TEST 1");

  const result = {
    title: "TEST 1",
    css: `
      .test1 {
        font-size: 35em;
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
        LEV1
      </div>    
    `,
    script: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT TEST 1");
        }
      } 
    } 
  }

  //add result to hopper
  if(p_p.isServer) {
    p_p.manageHopper.addToHopper(result, "test1");
  }

  return result;
  
}