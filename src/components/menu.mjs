import menuItem from "./menu-item.mjs";


export default async function menu() {

  //const menuItemFunc = (await import(`${p_p.baseDir}/src/components/menu-item.mjs`)).default;

  const result = {
    name: "menu",
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
        ${ (await menuItem("A", "/a")).markup }
        ${ (await menuItem("B", "/b")).markup }
        ${ (await menuItem("C", "/c")).markup }
        ${ (await menuItem("Lev1", "/level1/test1")).markup }
        ${ (await menuItem("Lev2", "/level1/level2/test2")).markup }
        ${ (await menuItem("?", "/asdasd")).markup }
      </menu>
    `
  };

  //add result to hopper
  // if(p_p.isServer) {
  //   p_p.manageHopper.addToHopper(result, "menu");
  // }

  return result;

}