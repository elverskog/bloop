export default async function home() {

  const result = {
    css: `
    .home {
      width: 450px;
      border: 1px solid #ff6666;
      padding: 15px;
  
      & div {
        padding-bottom: 15px;
      }
  
    }`,
    markup: `
      <div id="home" class="home">
        This is home, in pages
      </div>    
    `
  }

  //add result to hopper
  if(p_p?.isServer) {
    await p_p.manageHopper.addToHopper(result, "home");
  }

  return result;

  
}