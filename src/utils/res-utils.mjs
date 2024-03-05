//accept a stream, parse it and set it as the content inside 
export async function parseAndOutputStream(res) {

  //this function is only for browser
  if(typeof window !== "object") return;

  const result = "";
  const decoder = new TextDecoder();
  const reader = res.body.getReader();
  const { done, value } = await reader.read();
  
  // done  - true if the stream has already given you all its data.
  // value - some data. Always undefined when done is true.

  async function processText({ done, value }) {

    console.log("VALUE: ", value);

    //exit if stream is fully parsed 
    if (done) return;

    const newContent = decoder.decode(value);
    
    if(typeof newContent === "string") {
      return result + newContent;
    }

    // If not done, read some more, and call this function again
    const newDoneAndVal = await reader.read();
    processText(newDoneAndVal);

  }

  return await processText({ done, value });

}
