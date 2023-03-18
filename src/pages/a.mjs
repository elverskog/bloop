export default async function a() {
  const result = {
    title: "A",
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
          console.log("INIT A");
        }
      } 
    } 
  }

  //add result to hopper
  if(p_p?.isServer) {
    await p_p.manageHopper.addToHopper(result, "a");
  }

  return result;
  
}