export async function getPagesData() {
   
  // const { default: data } = await import("../data/fake-pages.json", { assert: { type: "json" } })
  const { default: pagesData } = await import("../data/fake-pages.json", { assert: { type: "json" } });
  return pagesData;

}
