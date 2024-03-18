// import tap from "tap";
// import path from "path";
// import {fileURLToPath} from "url";
// import loadModule from "./module-utils.mjs";


// tap.test('loadModule function', t => {

//   t.test('returns undefined if path is not a string', async st => {
//     st.equal(await loadModule(undefined), undefined);
//     st.equal(await loadModule(null), undefined);
//     st.equal(await loadModule(123), undefined);
//     st.equal(await loadModule({}), undefined);
//     st.end();
//   });


//   t.end();



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
  //   st.match(loadModule(css), expected);
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
  //   st.match(loadModule(css), expected);
  //   st.end();
  // });

  // t.test('returns undefined if css is not a string', st => {
  //   st.equal(loadModule(undefined), undefined);
  //   st.equal(loadModule(null), undefined);
  //   st.equal(loadModule(123), undefined);
  //   st.equal(loadModule({}), undefined);
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
  //   st.match(loadModule(css), expected);
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
  //   st.equal(loadModule(css), css);
  //   st.end();
  // });


});
