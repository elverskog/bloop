async function resumesListItem (resume) {

  const css = 
    `li.resumesListItem {
      display: flex;
      list-style: none;
      border: 1px solid #999;
      margin-bottom: 5px;
      padding: 2px;
      
      & a {
        padding: 5px;
        width: 100%;
        line-height: 26px;
        text-decoration: none;
        color: #999;
      }
      
      & span {
        width: 100px;
        text-align: right;
      }

      & button {
        border: 0;
        padding: 10px 13px;
        border: 1px solid #999;
        border-radius: 4px;
        user-select: none;
      }
    }`;


  function html(resume) {
    return `<li id="${`__resumeListItem_${resume._id}`}">
      <a href=${`/resume/${resume._id}`} id="${`resume-link-${resume._id}`}">
        ${resume.name}
      </a>
      <span>
        <button id="${`resume-delete-${resume._id}`}">Delete</button>
      </span>
    </li>`;
  }

  async function render() {
    if(isBrowser) {
      //const route = (await import(`${__basedir}/src/utils/req-utils.mjs`)).route;
      const frag = document.createRange().createContextualFragment(html(resume));
      const resumeDelete = frag.getElementById(`resume-delete-${resume._id}`);
      resumeDelete.addEventListener("click", event => {
        db.get(resume._id).then( doc => {
          return db.remove(doc)
        }).then( res => {
          console.log("removed resume", res);
        }).catch( err => {
          console.error(err);
        }) 
      });

      return frag;
    } else {
      return html(resume);
    }
  }

  return resume ? [ await render(resume), css ] : undefined;

}

export default resumesListItem;