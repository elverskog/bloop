async function addResumeForm() {



  function addFormEvent(formElement) {

    if(!isBrowser) return;
    
    formElement.addEventListener("submit", event => {
      event.preventDefault();
      if(window.user && window.user.roles.length && window.user.roles.indexOf("registered") > -1) {
        db.put({
          _id: `resume-${(new Date()).toJSON()}`,
          name: event.target[0].value
        }).then( res => {
          formElement.reset();
        }).catch( err => console.error(err) )
      } else {
        console.log("user is not registered");
      }
    });
    
  }


  function html() {
    return /*html*/`
      <form id="addResumeForm">
        <span>
          <input type="text" placeholder="Resume name"></input>
        </span>
        <span>
          <button type="submit">Save</button>
        </span>
      </form>
    `;
  }

  function render() {
    if(isBrowser) {
      const frag = document.createRange().createContextualFragment(html().trim());
      const formElement = frag.getElementById("addResumeForm");
      if(formElement){
        addFormEvent(formElement);
      } else {
        console.error("formElement not found");
      } 
      return frag;
    } else {
      return html();
    }
  }

  const css = 
    `.addResumeForm {
      width: 450px;
      border: 1px solid #999;
      padding: 3px;

      & input {
        padding: 10px;
        border: solid 1px #999;
        border-radius: 4px;
        font-kerning: normal;
        font-smooth: auto;
      }

      & button {
        border: 0;
        padding: 10px 13px;
        border: 1px solid #999;
        border-radius: 4px;
        user-select: none;
      }
    }
  `;

  return [render(), css];

}

export default addResumeForm;