async function resume () {

  //const setTitle = (await import(`${__basedir}/src/utils/head-utils.mjs`)).setTitle;
  
  const css = `
    .resume{
      & p {
        font-weight: 600;
        color: #ccccff;
      }
    }`;

  function html(doc) {
    const content = (!isBrowser && doc) ? JSON.stringify(doc) : "";
    return `
      <div id="__resumeContent">
        <p>
          ${content}
        </p>
      </div>
    `
  }

  function render(doc) {
    console.log("render resume", doc);
    if(isBrowser) {
      const frag = document.createRange().createContextualFragment(html().trim());
      const container = frag.querySelector("#__resumeContent p");
      const fragContent = document.createRange().createContextualFragment(JSON.stringify(doc));
      container.appendChild(fragContent);
      return frag;
    } else {
      return html(doc);
    }
  }

  return db.get(reqObject.routeParam).then( res => {
    setTitle(`Resume: ${res.name}`);
    return [render(res), css];
  }).catch( err => {
    return import(`${__basedir}/src/pages/404/index.mjs`).then( page404 => {
      return page404.default(err);
    });
  });

}

export default resume;