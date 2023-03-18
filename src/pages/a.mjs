export default async function home() {

  const result = {
    css: `
    .a {
      width: 450px;
      border: 1px solid #ff6666;
      padding: 15px;
  
      & div {
        padding-bottom: 15px;
      }
  
    }`,
    markup: `
      <div id="a" class="a">
        This is A
      </div>    
    `
  }

  //add result to hopper
  if(p_p?.isServer) {
    await p_p.manageHopper.addToHopper(result, "home");
  }

  return result;

  
}