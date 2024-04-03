export function valArgsResHandler(res, errMessage = "generic validateArgs error") {
  if(res === false) {
    throw new Error(errMessage);
  }
  return;
}

// throw new Error("ValidateArgs itself did not receive valid args");

export function validateArgsArgs(args, types) {

  valArgsResHandler(arguments.length === 2, "ValidateArgsArgs did not receive 2 arguments");

  valArgsResHandler(Object.prototype.toString.call(args) === "[object Arguments]", "ValidateArgsArgs - received non-arguments arg argument"); 

  valArgsResHandler(Array.isArray(types), "ValidateArgsArgs - received non-array types argument"); 

  valArgsResHandler(args.length === types.length, "validateargsargs - args length does not match types length");

  // valArgsResHandler(types.every(type => {
  //   return typeof type === "string" && 
  //     [
  //       "boolean",
  //       "string",
  //       "object",
  //       "function",
  //       "number",
  //       "bigint"
  //     ].includes(type);
  // }), "validateargsargs - some of the types array are invalid");

  

  types.every(type => {
    valArgsResHandler(typeof type === "string", "validateargsargs - some of the types array are not strings");
    valArgsResHandler(
      [
        "boolean",
        "string",
        "object",
        "function",
        "number",
        "bigint"
      ].includes(type));
  }));


  return true;

}


export function validateArgs(args, types) {

  if(validateArgsArgs(args, types)) {

    console.log("KEEP GOING", );

    args.every((arg, index) => {
    
      if (types[index] === "array") {
        valArgsResHandler(Array.isArray(arg));
      } else {
        valArgsResHandler(typeof arg === types[index]);
      }

    });

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



