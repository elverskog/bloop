export function checkIfLoggedIn(remoteDB) {
  remoteDB.getSession(function (err, response) {
    if (err) {
      // network error
      console.log("checkIfLoggedIn error", err);
      return false;
    } else if (!response.userCtx.name) {
      // nobody's logged in
      console.log("checkIfLoggedIn no one logged in");
      return false;
    } else {
      // user is logged in
      console.log("checkIfLoggedIn no one logged in");        
      //window.user = response.userCtx;
      return response.userCtx;
    }
  });
}