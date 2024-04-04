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



  // args.every(pair => {
  
  //   switch (true) {
  //     case !validateArg(pair):
  //       resArray.push(new Error("pair is not valid"));  
  //       break;
  //     case validateType(pair[1]):
  //       if(typeof pair[0] !== pair[1]) {
  //         resArray.push(new Error(`validateArgs - ${ pair[0] } is not ${ pair[1] }`));  
  //       }
  //       break;
  //     case pair[1] === "array": 
  //       if (!Array.isArray(pair[0])) {
  //         resArray.push(new Error(`validateArgs - ${ pair[0] } is not array`));
  //       }
  //       break;
  //     default:
  //       resArray.push(new Error("validateArgs - case is default. this should not happen"));
  //       break;
  //   }

  // });



