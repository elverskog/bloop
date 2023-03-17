async function menu (title) {

  const css = `
    menu.menu {
      display: flex;
      font-weight: 400;
      color: #ccccff;
      padding: 0;
    }`;

  async function html() {
    //const menuItem = (await import(`${__basedir}/src/components/menu-item/menu-item.mjs`)).default;
    const menuItem = (await import(`${__basedir}/src/components/menu-item/menu-item.mjs`)).default;

    const logAction = (!isBrowser && global.pathname === "/login") ? ""
      : (!isBrowser) ? `<a href="/login">Log In</a>`
      : (document.location.pathname === "/login") ? "" 
      : (!user || user.roles.indexOf("registered") === -1) ? `<a href="/login">Log In</a>` 
      : `<a href="/logout">Log Out</a>`;
    
    const userString = user ? JSON.stringify(user) : "no user";

    return `
      <menu>
        ${ await formatComponent(menuItem, [ "Main", "/" ]) }
        ${ await formatComponent(menuItem, [ "New Project", "/new" ]) }
        ${ await formatComponent(menuItem, [ "Open Project", "/open" ]) }
        ${ await formatComponent(menuItem, [ "Save Project", "/save" ]) }          
        ${ await formatComponent(menuItem, [ "Save Project As", "/save-as" ]) }
        ${ await formatComponent(menuItem, [ "Log In", "/login" ]) }
      </menu>
    `
  }

  // ${ await menuItem("Main", "/") }
  // ${ await menuItem("New Project", "/new") }
  // ${ await menuItem("Open Project", "/open") }
  // ${ await menuItem("Save Project", "/save") }
  // ${ await menuItem("Save Project As", "/save-as") }
  // ${ await menuItem("Log In", "/login") }






  async function render() {
    if(isBrowser) {
      const frag = document.createRange().createContextualFragment(await html());
      let div = document.createElement("div");
      div.innerHTML = "TEST"
      frag.append(div);
      return frag;
    } else {
      return await html();
    }
  }

  //listen for changes to title and rerender as needed
  if(isBrowser) {
    const titleEl = document.querySelector("title");
    const headerTitle = document.getElementById("headerTitle");
    if(headerTitle) {
      const observer = new MutationObserver( mutations => {
        headerTitle.innerHTML = document.title;
      });
      observer.observe(titleEl, {attributes: false, childList: true, subtree: false });
    }
  }

  return [await render(), css];

}

export default menu;