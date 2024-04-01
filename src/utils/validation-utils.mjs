// validate an array of "tuples" 
// e.g. [ [ foo, "bar" ], etc ] 

export function validateArgsArgs(args, types) {

  let res = true;

  res = (!!args && !!types && args[Symbol.iterator] && Array.isArray(types));
  
  if(res) {
    res = types.every(type => typeof type === "string" && 
      [
        "boolean",
        "string",
        "object",
        "function",
        "number",
        "bigint"
      ].includes(type));
  }

  if(res === false) {
    throw new Error("ValidateArgs itself did not receive valid args");
  } else {
    return res;
  }

}


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


export function validateArgs(args, types) {

  let resArray = [];

  args.every(pair => {
  
    switch (true) {
      case !validateArg(pair):
        resArray.push(new Error("pair is not valid"));  
        break;
      case validateType(pair[1]):
        if(typeof pair[0] !== pair[1]) {
          resArray.push(new Error(`validateArgs - ${ pair[0] } is not ${ pair[1] }`));  
        }
        break;
      case pair[1] === "array": 
        if (!Array.isArray(pair[0])) {
          resArray.push(new Error(`validateArgs - ${ pair[0] } is not array`));
        }
        break;
      default:
        resArray.push(new Error("validateArgs - case is default. this should not happen"));
        break;
    }

  });


  if(resArray.length) {
    resArray.forEach(resError => {
      throw resError;
    });
  } else {
    return true;
  }

}
