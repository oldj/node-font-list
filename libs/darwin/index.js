/**
 * @author oldj
 * @blog https://oldj.net
 */

"use strict";

const path = require("path");
const execFile = require("child_process").execFile;
const exec = require("child_process").exec;
const util = require("util");

const pexec = util.promisify(exec);

const bin = path.join(__dirname, "fontlist");
const bin2 = path.join(__dirname, "fontlist2");
const font_exceptions = ["iconfont"];

async function getBySystemProfiler() {
  const cmd = `system_profiler SPFontsDataType | grep "Family:" | awk -F: '{print $2}' | sort | uniq`;
  const { stdout } = await pexec(cmd, { maxBuffer: 1024 * 1024 * 10 });
  return stdout
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => !!f);
}

async function getByExecFile() {
  return new Promise(async (resolve, reject) => {
    execFile(bin, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      let fonts = [];
      if (stdout) {
        //fonts = fonts.concat(tryToGetFonts(stdout))
        fonts = fonts.concat(stdout.split("\n"));
      }
      if (stderr) {
        //fonts = fonts.concat(tryToGetFonts(stderr))
        console.error(stderr);
      }

      fonts = Array.from(new Set(fonts)).filter(
        (i) => i && !font_exceptions.includes(i)
      );

      resolve(fonts);
    });
  });
}

async function getDetailedFontsByExecFile() {
  return new Promise(async (resolve, reject) => {
    execFile(bin2, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      try {
        if (stdout) {
          const fontData = JSON.parse(stdout);
          const filteredFonts = fontData.filter(
            (font) =>
              font.familyName && !font_exceptions.includes(font.familyName)
          );
          resolve(filteredFonts);
        } else {
          resolve([]);
        }
      } catch (parseError) {
        console.error("Failed to parse font data:", parseError);
        resolve([]);
      }
    });
  });
}

const getFonts = async () => {
  let fonts = [];
  try {
    fonts = await getByExecFile();
  } catch (e) {
    console.error(e);
  }

  if (fonts.length === 0) {
    try {
      fonts = await getBySystemProfiler();
    } catch (e) {
      console.error(e);
    }
  }

  return fonts;
};

const getDetailedFonts = async () => {
  let fonts = [];
  try {
    fonts = await getDetailedFontsByExecFile();
  } catch (e) {
    console.error(e);
  }

  // If detailed retrieval fails, fallback to basic method and construct objects
  if (fonts.length === 0) {
    try {
      const basicFonts = await getByExecFile();
      fonts = basicFonts.map((familyName) => ({
        familyName,
        postScriptName: familyName,
      }));
    } catch (e) {
      console.error(e);
    }
  }

  if (fonts.length === 0) {
    try {
      const basicFonts = await getBySystemProfiler();
      fonts = basicFonts.map((familyName) => ({
        familyName,
        postScriptName: familyName,
      }));
    } catch (e) {
      console.error(e);
    }
  }

  return fonts;
};

// CommonJS exports
module.exports = {
  getFonts,
  getDetailedFonts,
};

// ES module exports (if supported)
if (typeof exports !== "undefined") {
  exports.getFonts = getFonts;
  exports.getDetailedFonts = getDetailedFonts;
}
