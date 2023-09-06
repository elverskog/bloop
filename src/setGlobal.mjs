import manageHopper from "./hopper.mjs";


//create global "p_p" (our "app") to store global vars in
export default function setGlobals(options) {

  if(typeof global !== "object") return; 

  global.p_p = {
    isServer: true, //let rest of app know we are on server
    baseDir: options?.__basedir, //make __baseDir available across app
    req: options?.req, //make request available across app
    manageHopper: manageHopper, //add hopper management
    // isFetch: options.req?.headers && options.req?.headers["is-fetch"]
    isFetch: options?.req?.headers ? options?.req?.headers["is-fetch"] : false,
    isBuild: options.isBuild
  };

}