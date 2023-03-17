async function page404(err) {

  function html(err) {
    const content = (typeof err === "string") ? `<p>${err}</p` : "";
    return (`
      <div>
        <h1>404</h1>
        <h2>There is nothing here</h2>
        <p>
          <a href="/">Go to home page</a>
        </p>
        <p>
          ${content}
        </p>     
      </div>
    `);
  }

  function render(doc) {
    console.log("render 404", doc)
    if(isBrowser) {
      const frag = document.createRange().createContextualFragment(html().trim());
      return frag;
    } else {
      return html(doc);
    }
  }

  return render();
  
}

export default page404;