export function valArgsResHandler(res, errMessage = "generic validateArgs error") {
  if(res === false) {
    throw new Error(errMessage);
  }
  return;
}


export function validateArgsArgs(args, types) {

  // console.log("ARGUMENTS: ", arguments);

  valArgsResHandler(arguments.length === 2, "validateArgsArgs did not receive 2 arguments");

  valArgsResHandler(args.length > 0, "validateArgsArgs arg argument did not have any elements");

  valArgsResHandler(Array.isArray(types), "validateArgsArgs - received non-array types argument"); 

  valArgsResHandler(Object.prototype.toString.call(args) === "[object Arguments]", "validateArgsArgs - received non-arguments arg argument"); 
  
  valArgsResHandler(args.length === types.length, "validateArgsArgs - args length does not match types length");

  types.every(type => {
    
    valArgsResHandler(typeof type === "string", "validateArgsArgs - some of the types array are not strings");

    valArgsResHandler(
      [
        "boolean",
        "string",
        "object",
        "array",
        "function",
        "number",
        "bigint"
      ].includes(type), "validateArgsArgs - some of the types array are not names of valid types");

    return true;

  });

  return true;

}


export function validateArgs(args, types) {


  if(validateArgsArgs(args, types)) {

    [ ...args ].every((arg, index) => {
    
      console.log("ARG/TYPE: ", arg, types[index]);
      
      if (types[index] === "array") {
        valArgsResHandler(Array.isArray(arg), `validateArgsArgs - ${ arg } is not ${ types[index] }`);
      } else {
        valArgsResHandler(typeof arg === types[index], `validateArgsArgs - ${ arg } is not ${ types[index] }`);
      }

      return true;

    });

  } else {

    valArgsResHandler(false, "validateArgsArgs - fallback for fail");

  }

}

