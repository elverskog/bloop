import fs from "fs-extra";


export async function getPages(path) {

  let fileNames;
  let res = [];

  try {

    fileNames = fs.readdirSync("./content/pages");

    for (let index = 0; index < fileNames.length; index++) {
      const { default: page } = await import(`../../content/pages/${fileNames[ index ]}`, { with: { type: "json" } });
      res.push(page);
    }

  } catch (error) {
    throw new Error(error.message);
  }

  return res;

}
