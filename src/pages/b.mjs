export default async function b() {

  const result = {
    title: "B",
    css: `
    .b {
      width: 450px;
      border: 1px solid #ff6666;
      padding: 15px;
  
      & div {
        padding-bottom: 15px;
      }
  
    }`,
    markup: `
      <div id="b" class="b">
        This is B
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
    await p_p.manageHopper.addToHopper(result, "b");
  }

  return result;

}