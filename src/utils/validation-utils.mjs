// validate an array of "tuples" 
// e.g. [ [ foo, "bar" ], etc ] 

export function validateArgs(args) {

  console.log("ARGS: ", args);
  console.log("TYPEOF ARGS: ", typeof args);

  function isStandardType(type) {
    return [
      "boolean",
      "string",
      "object",
      "function",
      "number",
      "bigint"
    ].includes(type);  
  }


  let res;

  if(typeof args === "undefined" || !Array.isArray(args) || !Array.isArray(args[0])) {
    throw new Error("ValidateArgs didn't receive list of tuples");
  }

  const isCorrectType = pair => {
    
    switch (true) {
    case isStandardType(pair[1]):
      console.log("CASE IS STANDARD");
      res = typeof pair[0] === pair[1];  
      break;
    case pair[1] === "array": 
      console.log("CASE IS ARRAY");
      res = Array.isArray(pair[0]);
      break;
    default:
      console.log("CASE IS DEFAULT");
      break;
    }
    
    if(res) { 
      return res;
    } else {
      throw new Error(`validateArgs - "${ pair[0] }" isn't ${ pair[1] }`);
    }

  };

  return args.every(isCorrectType);

}
