//validate an array of "tuples" (variable and expected type)
export function validateArgs(args) {

  if(typeof args !== "object" && typeof args[0] !== "object") {
    console.log("ValidateArgs didn't receive list of tuples"); 
    return;
  }

  const isCorrectType = pair => {
    const res = typeof pair[0] === pair[1];  
    if(!res) console.log(`validateArgs - ${ pair[0] } isn't ${ pair[1] }`);
    return res;
  };

  return args.every(isCorrectType);

}
