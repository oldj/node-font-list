/**
 * @author oldj
 * @blog http://oldj.net
 */

import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { getFonts: _getFonts, getFonts2: _getFonts2 } = require("./libs/core");

// ES module exports
export const getFonts = _getFonts;
export const getFonts2 = _getFonts2;

// Default export
export default {
  getFonts,
  getFonts2,
};
