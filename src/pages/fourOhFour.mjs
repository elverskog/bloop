export default async function home() {

  return {
    css: `
      .fourOhFour {
        font-size: 4em;
        text-align: center;
        padding: 3em 0.5em;
      }
      @media (max-width: 30em) {
        .fourOhFour {
          font-size: 2.5em;
        }
      }
    `,
    markup: `
      <div class="fourOhFour">
        This page cannot be found
        <br> 
        <strong>404</strong>
      </div>    
    `
  }

}