export default async function test2() {

  console.log("TEST 2");

  const result = {
    name: "test2",
    title: "TEST 2",
    css: `
      .test2 {
        font-size: 35em;
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
        T2
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

  //add result to hopper
  if(p_p.isServer) {
    p_p.manageHopper.addToHopper(result, "test2");
  }

  return result;
  
}