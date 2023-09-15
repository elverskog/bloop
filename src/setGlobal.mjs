import manageHopper from "./hopper.mjs";


//create global "p_p" (our "app") to store global vars in
export default function setGlobals(options) {

  if(typeof global !== "object") return; 

  global.p_p = {
    // baseDir: options?.__basedir, //make __baseDir available across app
    // req: options?.req, //make request available across app
    // isFetch: options.req?.headers && options.req?.headers["is-fetch"]
    // isBuild: options.isBuild
  };

}
