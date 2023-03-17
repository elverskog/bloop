export default async function menu() {

  const menuItemFunc = (await import(`${p_p.baseDir}/src/components/menu-item/menu-item.mjs`)).default;

  const result = {
    css: `
    menu.menu {
      display: flex;
      font-weight: 400;
      color: #ccccff;
      padding: 0;
    }`,
    markup: `
      <menu class="menu">
        ${ (await menuItemFunc("Main", "/")).markup }
        ${ (await menuItemFunc("Log In", "/login")).markup }
      </menu>
    `
  };

  //add result to hopper
  if(p_p.isServer) {
    p_p.manageHopper.addToHopper(result, "menu");
  }

  return result;

}

  //   html: `
    // <menu>
    //   ${ await formatComponent(menuItem, [ "Main", "/" ]) }
    //   ${ await formatComponent(menuItem, [ "New Project", "/new" ]) }
    //   ${ await formatComponent(menuItem, [ "Open Project", "/open" ]) }
    //   ${ await formatComponent(menuItem, [ "Save Project", "/save" ]) }          
    //   ${ await formatComponent(menuItem, [ "Save Project As", "/save-as" ]) }
    //   ${ await formatComponent(menuItem, [ "Log In", "/login" ]) }
    // </menu>
  // `
