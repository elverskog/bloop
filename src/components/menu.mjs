export default async function menu() {

  const menuItemFunc = (await import(`${p_p.baseDir}/src/components/menu-item.mjs`)).default;

  const result = {
    css: `
    menu.menu {
      display: flex;
      justify-content: center;
      font-weight: 400;
      color: #ccccff;
      padding: 0 0 5px;
      margin: 0 auto;
    }`,
    markup: `
      <menu class="menu">
        ${ (await menuItemFunc("A", "/a")).markup }
        ${ (await menuItemFunc("B", "/b")).markup }
        ${ (await menuItemFunc("C", "/c")).markup }
        ${ (await menuItemFunc("?", "/d")).markup }
      </menu>
    `
  };

  //add result to hopper
  if(p_p.isServer) {
    p_p.manageHopper.addToHopper(result, "menu");
  }

  return result;

}