// import menuItem from "./menu-item.mjs";
import loadModule from "../utils/module-utils.mjs";

export default async function menu() {

  //const menuItemFunc = (await import(`${baseDir}/src/components/menu-item.mjs`)).default;
  //get link module
  //const menuItem = await loadModule(`${baseDir}/src/components/menu-item.mjs`, args);

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
        ${ (await loadModule(`${baseDir}/src/components/menu-item.mjs`, { label: "A", pathname: "/a" })).markup };
        ${ (await loadModule(`${baseDir}/src/components/menu-item.mjs`, { label: "B", pathname: "/b" })).markup };
        ${ (await loadModule(`${baseDir}/src/components/menu-item.mjs`, { label: "C", pathname: "/c" })).markup };
        ${ (await loadModule(`${baseDir}/src/components/menu-item.mjs`, { label: "Lev1", pathname: "/level1/lev1-page" })).markup };
        ${ (await loadModule(`${baseDir}/src/components/menu-item.mjs`, { label: "Lev2", pathname: "/level1/level2/lev2-page" })).markup };
        ${ (await loadModule(`${baseDir}/src/components/menu-item.mjs`, { label: "?", pathname: "/asadasd" })).markup };
      </menu>
    `
  };

  return result;

}

// ${ (await menuItem("A", "/a")).markup }
// ${ (await menuItem("B", "/b")).markup }
// ${ (await menuItem("C", "/c")).markup }
// ${ (await menuItem("Lev1", "/level1/test1")).markup }
// ${ (await menuItem("Lev2", "/level1/level2/test2")).markup }
// ${ (await menuItem("?", "/asdasd")).markup }
