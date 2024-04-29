export function valArgsResHandler(res, errMessage = "generic validateArgs error") {
  if(res === false) {
    throw new Error(errMessage);
  }
  return;
}


export function validateArgsArgs(args, types) {

  valArgsResHandler(arguments.length === 2, "validateArgsArgs did not receive 2 arguments");

  valArgsResHandler(args.length > 0, "validateArgsArgs arg argument did not have any elements");

  valArgsResHandler(Array.isArray(args) || Object.prototype.toString.call(args) === "[object Arguments]", "validateArgsArgs - did not receive array or arguments as arg argument"); 

  valArgsResHandler(Array.isArray(types), "validateArgsArgs - received non-array types argument"); 

  //handle "~", which is used to denote an optional type/arg
  const tildaIndexes = types.map( type => type.indexOf("~") === 0);
  const typesTildaStripped = types.map( type => type.replace("~", ""));

  valArgsResHandler((() => {
    let result;
    if (args.length === types.length) {
      result = true; 
    } else if (tildaIndexes.length) {
      const argsAdj = [ ...args ];
      tildaIndexes.map(tildaIndex => {
        delete argsAdj[tildaIndex]; 
      });  
      result = argsAdj.length === types.length;
    } else {
      result = false;
    }
    return result; 
  })(), "validateArgsArgs - args length does not match types length");

  typesTildaStripped.every(type => {
    
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

    let typeEdit;

    //loop through types not args as args may be missing
    types.every((type, index) => {

      const arg = args[index]; 

      //get name (type) of arg for better errors
      const name = typeof arg === "string" ? arg : Object.prototype.toString.call(arg); 

      //if string denoting type starts with a tilda and arg is missing return true
      if(type.indexOf("~") === 0) {
        if(!args[index]) {
          return true; 
        }
      }

      typeEdit = type.replace("~", "");

      if (typeEdit === "array") {
        valArgsResHandler(Array.isArray(arg), `validateArgsArgs - ${ name } is not ${ typeEdit }`);
      } else {
        valArgsResHandler(typeof arg === typeEdit, `validateArgsArgs - ${ name } is not ${ typeEdit }`);
      }

      return true;

    });

  } else {

    valArgsResHandler(false, "validateArgsArgs - fallback for fail");

  }

}

