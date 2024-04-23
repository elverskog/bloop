import { page } from "../utils/build-utils/build-page-utils.mjs";

export default async function menuItem (args) {

  const { label, pathname} = args; 

  const result = {
    name: "menuitem",
    css: `
      .menu menuitem a {
        margin: 10px;
        background-color: #333;
        color: #fff;
        display: block;
        font-size: 1em;
        font-weight: 600;
        border-radius: 30px;
        padding: 0 20px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        & a.active {
          background-color: #666;
        }

      }
      @media(max-width: 30em) {
        .menu menuitem a {
          font-size: 0.75em;
          width: 35px;
          height: 35px;
          line-height: 35px;
        }
      }
    `,
    markup: `
      <menuitem>
        ${ (await page.addModule("src/components/link.mjs", { label, pathname })).markup }
      </menuitem>
    `
  };

  return result;

}
