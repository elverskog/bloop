export function valArgsResHandler(res, errMessage = "generic validateArgs error") {
  if(res === false) {
    throw new Error(errMessage);
  }
  return;
}


export function validateArgsArgs(args, types) {

  valArgsResHandler(arguments.length === 2, "validateArgsArgs did not receive 2 arguments");

  valArgsResHandler(Object.prototype.toString.call(args) === "[object Arguments]", "validateArgsArgs - received non-arguments arg argument"); 

  valArgsResHandler(Array.isArray(types), "validateArgsArgs - received non-array types argument"); 

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

