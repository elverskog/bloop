// validate an array of "tuples" 
// e.g. [ [ foo, "bar" ], etc ] 


export function validateArg(pair) {
  const result = (
    pair !== undefined
    && Array.isArray(pair)
    && pair.length === 2
    && pair[0] !== null
    && pair[1] !== null
    && typeof pair[1] === "string"
  );
  return result;
}


export function validateType(type) {
  return [
    "boolean",
    "string",
    "object",
    "function",
    "number",
    "bigint"
  ].includes(type);  
}


export function validateArgs(args) {

  let res;

  if(typeof args === "undefined" || !Array.isArray(args) || !Array.isArray(args[0])) {
    throw new Error("ValidateArgs didn't receive list of tuples");
  }

  return args.every(pair => {
  
    switch (true) {
      case !validateArg(pair):
        res = new Error("pair is not valid");  
        break;
      case validateType(pair[1]):
        res = typeof pair[0] === pair[1] 
          ? true : new Error(`validateArgs - ${ pair[0] } isn't ${ pair[1] }`);  
        break;
      case pair[1] === "array": 
        res = Array.isArray(pair[0])
          ? true : new Error(`validateArgs - ${ pair[0] } isn't array`);
        break;
      default:
        res = new Error("validateArgs - case is default. this should not happen");
        break;
    }

    return res;

  });


}
