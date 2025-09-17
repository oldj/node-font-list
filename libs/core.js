/**
 * @author oldj
 * @blog http://oldj.net
 */

"use strict";

const standardize = require("./standardize");
const platform = process.platform;

let getFontsFunc;
let getDetailedFontsFunc;

// Initialize platform-specific font retrieval functions
switch (platform) {
  case "darwin":
    const darwinModule = require("./darwin");
    getFontsFunc = darwinModule.getFonts;
    getDetailedFontsFunc = darwinModule.getDetailedFonts;
    break;
  case "win32":
    const win32Module = require("./win32");
    getFontsFunc = win32Module.getFonts;
    getDetailedFontsFunc = win32Module.getDetailedFonts;
    break;
  case "linux":
    const linuxModule = require("./linux");
    getFontsFunc = linuxModule.getFonts;
    getDetailedFontsFunc = linuxModule.getDetailedFonts;
    break;
  default:
    throw new Error(`Error: font-list can not run on ${platform}.`);
}

const defaultOptions = {
  disableQuoting: false,
};

/**
 * Get system font list
 * @param {Object} options - Options
 * @returns {Promise<string[]>} Array of font names
 */
async function getFonts(options) {
  options = Object.assign({}, defaultOptions, options);

  let fonts = await getFontsFunc();
  fonts = standardize(fonts, options);

  fonts.sort((a, b) => {
    return a.replace(/^['"]+/, "").toLocaleLowerCase() <
      b.replace(/^['"]+/, "").toLocaleLowerCase()
      ? -1
      : 1;
  });

  return fonts;
}

/**
 * Get detailed system font information
 * @param {Object} options - Options
 * @returns {Promise<Array>} Array of detailed font information
 */
async function getFonts2(options) {
  options = Object.assign({}, defaultOptions, options);

  let fonts = await getDetailedFontsFunc();
  fonts = fonts.filter(
    (font) => font.familyName && typeof font.familyName === "string"
  );

  // Standardize familyName and pass through new attributes
  fonts = fonts.map((font) => ({
    name: font.familyName,
    familyName: standardize([font.familyName], options)[0],
    postScriptName: font.postScriptName,
    weight: font.weight || "regular",
    style: font.style || "normal",
    width: font.width || "normal",
    monospace: font.monospace || false,
  }));

  // Sort by familyName
  fonts.sort((a, b) => {
    return a.familyName.replace(/^['"]+/, "").toLocaleLowerCase() <
      b.familyName.replace(/^['"]+/, "").toLocaleLowerCase()
      ? -1
      : 1;
  });

  return fonts;
}

module.exports = {
  getFonts,
  getFonts2,
};
