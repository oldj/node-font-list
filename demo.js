/**
 * @author oldj
 * @blog http://oldj.net
 */

"use strict";

require("./index")
  .getFonts2()
  .then((fonts) => {
    //console.log(fonts)
    console.log(fonts.map((f) => JSON.stringify(f)).join("\n"));
  })
  .catch((err) => {
    console.log(err);
  });
