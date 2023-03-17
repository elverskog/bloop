//src/components/resumes-list.mjs

async function resumesList () {

  const css = 
    `ul.resumesList {
      padding-left: 0;
      width: 450px;
    }`;

  const resumesListItem = (await import(`${__basedir}/src/components/resumes-list-item/resumes-list-item.mjs`)).default;

  async function getRecords() {
    return await db.allDocs({
      include_docs: true,
      startkey: 'resume'
    }).then( dbres => {
      return dbres.rows.length ? dbres.rows : [];
    }).catch( dberr => {
      console.error(dberr)
    })
  }
  const dataRows = await getRecords();

  async function renderItems(rows) {
    const elements = rows.map(async row => {
      return await formatComponent(resumesListItem, [row.doc]);
    });
    return await Promise.all(elements);
  }
  const htmlArray = await renderItems(dataRows);

  function html() {
    const content = isBrowser ? "" : htmlArray.join("\n"); 
    return `<ul id="__resumesList">${content}</ul>`;
  }
  
  function createFragmentList(htmlArray) {
    const frag = document.createDocumentFragment();
    htmlArray.forEach( resumeListItemFrag => {
      frag.appendChild(resumeListItemFrag);
    })
    return frag;
  }

  function createFragmentContainerAndList(htmlArray) {
    const frag = document.createRange().createContextualFragment(html());
    const container = frag.getElementById("__resumesList");
    container.replaceChildren(createFragmentList(htmlArray));
    return frag;
  }

  if (isBrowser) {   

    db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', async function (change) {
      const rows = await getRecords();
      const htmlArray = (await renderItems(rows));
      const frag = createFragmentList(htmlArray);
      const container = document.getElementById("__resumesList");
      if(container) container.replaceChildren(frag);    
    }).on('error', function (err) {
      console.error(err)
    });
 
  }

  function render() {
    if(isBrowser) {
      return createFragmentContainerAndList(htmlArray);
    } else {
      return html();
    }
  }

  return [render(), css];

}

export default resumesList;