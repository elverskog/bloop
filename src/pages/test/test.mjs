export default async function test() {

  console.log("TEST");

  const result = {
    title: "TEST",
    css: `
      .test {
        font-size: 35em;
        text-align: center;
      }
      @media (max-width: 30em) {
        .test {
          font-size: 20em;
        }
      }
    `,
    markup: `
      <div id="test" class="test">
        TEST
      </div>    
    `,
    script: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT TEST");
        }
      } 
    } 
  }

  //add result to hopper
  if(p_p.isServer) {
    p_p.manageHopper.addToHopper(result, "test");
  }

  return result;
  
}