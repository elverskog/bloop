// import menuItem from "./menu-item.mjs";
import loadModule from "../utils/module-utils.mjs";

export default async function menu() {

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
        ${ (await loadModule("src/components/menu-item.mjs", { label: "A", pathname: "/a" })).markup };
        ${ (await loadModule("src/components/menu-item.mjs", { label: "B", pathname: "/b" })).markup };
        ${ (await loadModule("src/components/menu-item.mjs", { label: "C", pathname: "/c" })).markup };
        ${ (await loadModule("src/components/menu-item.mjs", { label: "Lev1", pathname: "/level1/lev1-page" })).markup };
        ${ (await loadModule("src/components/menu-item.mjs", { label: "Lev2", pathname: "/level1/level2/lev2-page" })).markup };
        ${ (await loadModule("src/components/menu-item.mjs", { label: "?", pathname: "/asadasd" })).markup };
      </menu>
    `
  };

  return result;

}
