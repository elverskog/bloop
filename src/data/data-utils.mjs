export async function getPages() {
   
  // const { default: data } = await import("../data/fake-pages.json", { assert: { type: "json" } })
  const { default: pages } = await import("../data/fake-pages.json", { assert: { type: "json" } });
  return pages;

}
