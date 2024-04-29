export default async function c() {

  const result = {
    name: "c",
    title: "C",
    css: `
      h1 {
        font-size: 8em;
        text-align: center;
        margin: 0 auto .35em;
      }
      body {
        font-size: 1em;
      }
      @media (max-width: 30em) {
        h1 {
          font-size: 6em;
        }
        body {
          font-size: .85em;
        }
      }
    `,
    markup: `
      <div id="c" class="c">
        <h1>C</h1>
        <body>
          <p>
          Eleifend blandit dis curae;. Proin inceptos parturient arcu volutpat tempor ut dolor! Viverra ante nulla sollicitudin platea. Eleifend aliquam sagittis volutpat. Vitae, sociis platea ac id commodo primis pulvinar dapibus magna convallis curabitur cras. Vel tempor dictum bibendum netus sociosqu magna montes per sodales habitant praesent. Non erat nisi quam viverra. Maecenas ornare duis viverra rutrum, orci integer litora conubia elit. Per pulvinar mauris nisl consectetur.
          </p>
          <p>
          Nisi sem luctus fringilla a. Conubia pharetra leo in accumsan tristique, mauris risus gravida ornare id. Fames dui, sagittis et montes sapien aptent. Pellentesque elementum a pretium aliquet vivamus orci mus dictumst consectetur. Id lacinia amet tincidunt id gravida, amet praesent phasellus viverra placerat vitae. Dictum vehicula ut turpis aliquam magna. Tellus morbi nam mi. Enim, nascetur taciti lacus dignissim sollicitudin pretium magnis! Taciti scelerisque varius primis quam, nibh velit placerat vulputate hac. Sociosqu, duis dictum proin pulvinar pretium proin vehicula. Tristique.
          </p>
          <p>
          Pharetra sit maecenas feugiat sociosqu mollis per. Lorem sodales scelerisque malesuada dignissim commodo maecenas aenean vitae quam lacus posuere purus. Nisl ipsum dis parturient egestas scelerisque nunc sollicitudin cursus vitae, commodo lacinia arcu. Mi magnis vel mi varius a ridiculus neque vitae egestas tortor magna. Erat nisl habitasse non justo molestie suspendisse scelerisque tortor porta. Risus torquent nisi aenean.
          </p>
          <p>
          Dictum maecenas eros tempus ridiculus quis mi sit ante natoque commodo vivamus! Luctus nostra himenaeos mollis turpis est ante etiam aliquam tincidunt? Hac sociosqu feugiat litora curae; ante facilisi semper sociis vulputate. Dictumst elementum nostra penatibus aenean. Bibendum semper ipsum adipiscing dictumst viverra, lacinia elit sit. Turpis curae; sit cubilia fusce maecenas magnis? Porta facilisis augue habitant non eleifend elementum sociosqu viverra faucibus platea; cras massa. Urna sociosqu conubia taciti proin taciti posuere ultricies?
          </p>
          <p>
          Non diam libero elit nec, fusce accumsan cubilia sociis diam torquent nisl. Ac laoreet, in duis curae; diam urna. Quam natoque feugiat hac id placerat enim a aliquet malesuada dictumst vivamus adipiscing. Rutrum class neque suscipit elit nisl ultrices. Ut quisque feugiat vel interdum quam. Erat donec venenatis quam faucibus consectetur ullamcorper senectus mauris lobortis dignissim cursus. Sem posuere adipiscing leo massa eros. Litora fermentum habitant ornare vehicula mollis curae; viverra dictumst consectetur. Sagittis turpis platea habitasse. Torquent curae; porta nascetur. Turpis commodo imperdiet, pretium.
          </p>
        </body>
      </div>    
    `,
    js: {
      init: function() {
        if(typeof window === "object") {
          console.log("INIT C");
        }
      } 
    } 
  };

  return result;

}
