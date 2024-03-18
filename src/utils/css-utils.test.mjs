import tap from "tap";
import { processCSS } from "./css-utils.mjs";


tap.test("test css-utils", t => {

  t.test("returns undefined if css is not a string", st => {
    st.equal(processCSS(undefined), undefined);
    st.equal(processCSS(null), undefined);
    st.equal(processCSS(123), undefined);
    st.equal(processCSS({}), undefined);
    st.end();
  });



  // t.test('nesting is converted to valid CSS', st => {
  //   process.env.NODE_ENV = 'production';
  //   const css = `
  //     body {
  //       margin: 0;
  //       padding: 0;
  //       & div {
  //         color: #ff0000;
  //       }
  //     }
  //   `;
  //   const expected = 'body{margin:0;padding:0}body div{color:#ff0000}';
  //   st.match(processCSS(css), expected);
  //   st.end();
  // });

  // t.test('prefixes are added for CSS attributes that need it', st => {
  //   process.env.NODE_ENV = 'production';
  //   const css = `
  //     @media (min-resolution: 2dppx) {
  //       .image {
  //         background-image: url(image@2x.png);
  //       }
  //     }
  //   `;
  //   const expected = '@media (-webkit-min-device-pixel-ratio:2), (min-resolution:2dppx){.image{background-image:url(image@2x.png)}}';
  //   st.match(processCSS(css), expected);
  //   st.end();
  // });

  // t.test('returns undefined if css is not a string', st => {
  //   st.equal(processCSS(undefined), undefined);
  //   st.equal(processCSS(null), undefined);
  //   st.equal(processCSS(123), undefined);
  //   st.equal(processCSS({}), undefined);
  //   st.end();
  // });

  // t.test('minifies the CSS if NODE_ENV is production', st => {
  //   process.env.NODE_ENV = 'production';
  //   const css = `
  //     body {
  //       margin: 0;
  //       padding: 0;
  //     }
  //   `;
  //   const expected = 'body{margin:0;padding:0}';
  //   st.match(processCSS(css), expected);
  //   st.end();
  // });

  // t.test('keeps format to make it easier to read if NODE_ENV is not production', st => {
  //   process.env.NODE_ENV = 'development';
  //   const css = `
  //     body {
  //       margin: 0;
  //       padding: 0;
  //     }
  //   `;
  //   st.equal(processCSS(css), css);
  //   st.end();
  // });

  t.end();

});
