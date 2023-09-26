export default async function dummyModule(arg) {

  let result;

  if(typeof arg === "string") {

    result = "hello";

  } else {

    console.log("dummyModule called with invalid arg: ");
    console.log("arg: ", arg);
  }
  
  return result;
    
}
