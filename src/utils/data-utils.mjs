import fs from "fs-extra";


export async function getPages() {

  let fileNames;
  let res = [];

  try {

    fileNames = fs.readdirSync("./src/content/pages");

    for (let index = 0; index < fileNames.length; index++) {
      const { default: page } = await import(`../../src/content/pages/${fileNames[ index ]}`, { assert: { type: "json" } });
      res.push(page);
    }

  } catch (error) {
    throw new Error(error.message);
  }

  console.log("RES: ", res);

  return res;

}
