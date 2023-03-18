export default async function c() {

  const result = {
    title: "C",
    css: `
    .c {
      width: 450px;
      border: 1px solid #ff6666;
      padding: 15px;
  
      & div {
        padding-bottom: 15px;
      }
  
    }`,
    markup: `
      <div id="c" class="c">
        This is C
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