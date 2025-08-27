/**
 * @author oldj
 * @blog http://oldj.net
 */

"use strict";

const standardize = require("./libs/standardize");
const platform = process.platform;

let getFontsFunc;
let getDetailedFontsFunc;
switch (platform) {
  case "darwin":
    const darwinModule = require("./libs/darwin");
    getFontsFunc = darwinModule.getFonts;
    getDetailedFontsFunc = darwinModule.getDetailedFonts;
    break;
  case "win32":
    const win32Module = require("./libs/win32");
    getFontsFunc = win32Module.getFonts;
    getDetailedFontsFunc = win32Module.getDetailedFonts;
    break;
  case "linux":
    const linuxModule = require("./libs/linux");
    getFontsFunc = linuxModule.getFonts;
    getDetailedFontsFunc = linuxModule.getDetailedFonts;
    break;
  default:
    throw new Error(`Error: font-list can not run on ${platform}.`);
}

const defaultOptions = {
  disableQuoting: false,
};

exports.getFonts = async (options) => {
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
};

exports.getFonts2 = async (options) => {
  options = Object.assign({}, defaultOptions, options);

  let fonts = await getDetailedFontsFunc();

  // 对 familyName 进行标准化处理
  fonts = fonts.map((font) => ({
    familyName: standardize([font.familyName], options)[0],
    postScriptName: font.postScriptName,
  }));

  // 按 familyName 排序
  fonts.sort((a, b) => {
    return a.familyName.replace(/^['"]+/, "").toLocaleLowerCase() <
      b.familyName.replace(/^['"]+/, "").toLocaleLowerCase()
      ? -1
      : 1;
  });

  return fonts;
};
