export default function button (options) {

  const { type, label, action } = options;


  const result = {
    css: `
      button {
        border: 0;
        padding: 10px 13px;
        border: 1px solid #999;
        border-radius: 4px;
        user-select: none;
      }
    `,
    markup: `
      <button type="${ type }" onclick="${ action }">${ label }</button>
    `
  };

  //add result to hopper
  if(p_p.isServer) {
    p_p.manageHopper.addToHopper(result, "button");
  }

  return result;

}