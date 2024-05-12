import fakeMenu from "../../content/menus/fake-menu.json" assert { type: "json" };


export async function getMenuItems(fakeMenu) {

  let res = "";

  for (let index = 0; index < fakeMenu.length; index++) {
    const item = fakeMenu[index];
    if (typeof item.label === "string" && typeof item.path === "string") {
      res += (await this.addModule("src/components/menu-item.mjs", { label: item.label, pathname: item.path })).markup;
    }
  }

  return res;

}


export default async function menu() {

  const menuItems = await getMenuItems.call(this, fakeMenu);

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
        ${ menuItems }    
      </menu>
    `
  };

  return result;

}
