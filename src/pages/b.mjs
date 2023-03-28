export default async function b() {

  const result = {
    title: "B",
    css: `
      .b {
        font-size: 35em;
        text-align: center;
      }
      @media (max-width: 30em) {
        .b {
          font-size: 20em;
        }
      }
    `,
    markup: `
      <div id="b" class="b">
        B
      </div>    
    `,
    script: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT B");
        }
      } 
    } 
  }

  //add result to hopper
  if(p_p?.isServer) {
    p_p.manageHopper.addToHopper(result, "b");
  }

  return result;

}