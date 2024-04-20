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

  valArgsResHandler(Array.isArray(args) || Object.prototype.toString.call(args) === "[object Arguments]", "validateArgsArgs - didn't receive array or arguments as arg argument"); 

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

    //loop through types not args as args may be missing
    types.every((type, index) => {

      //if type starts with a tilda only validate if it exists
      //do this by setting a default valid value if the arg is missing
      //TODO this assumes optional args are at the end which is fragile
      const genFakeArg = type => {
        let result;
        switch (type) {
          case "string":
            result = "string";
            break;
          case "boolean":
            result = true;
            break;
          case "object":
            result = {};
            break;
          case "array":
            result = [];
            break;
          case "function":
            result = () => true;
            break;
          case "number":
            result = 222;
            break;
          case "bigint":
            result = BigInt(452345234534532);
            break;
          default:
            result = null;
            break;
        }
        return result;
      };

      //I AM HERE
      //CHANGE THIS
      //THE ABOVE IS NONESENSE
      //JUST MAKE A FUNCTION VALIDATEARG
      //AND A CONDITONAL FOE TILDA ETC

      const arg = (type.indexOf("~") === 0 && !args[index]) ? genFakeArg(type) : args[index]; 

      //get name (type) of arg for better errors
      const name = typeof arg === "string" ? arg : Object.prototype.toString.call(arg); 

      if (types[index] === "array") {
        valArgsResHandler(Array.isArray(arg), `validateArgsArgs - ${ name } is not ${ types[index] }`);
      } else {
        valArgsResHandler(typeof arg === types[index], `validateArgsArgs - ${ name } is not ${ types[index] }`);
      }

      return true;

    });

  } else {

    valArgsResHandler(false, "validateArgsArgs - fallback for fail");

  }

}

