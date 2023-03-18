export default async function c() {

  const result = {
    title: "C",
    css: `
      .c {
        font-size: 35em;
        text-align: center;
      }
      @media (max-width: 30em) {
        .c {
          font-size: 20em;
        }
      }
    `,
    markup: `
      <div id="c" class="c">
        C
      </div>    
    `,
    script: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT C");
        }
      } 
    } 
  }

  //add result to hopper
  if(p_p?.isServer) {
    await p_p.manageHopper.addToHopper(result, "c");
  }

  return result;

}