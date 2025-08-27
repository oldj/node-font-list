/**
 * @author: oldj
 * @homepage: https://oldj.net
 */

const exec = require("child_process").exec;
const util = require("util");

const pexec = util.promisify(exec);

async function binaryExists(binary) {
  const { stdout } = await pexec(`whereis ${binary}`);
  return stdout.length > binary.length + 2;
}

const getFonts = async () => {
  const fcListBinary = (await binaryExists("fc-list")) ? "fc-list" : "fc-list2";

  const cmd = fcListBinary + ' -f "%{family[0]}\\n"';

  const { stdout } = await pexec(cmd, { maxBuffer: 1024 * 1024 * 10 });
  const fonts = stdout.split("\n").filter((f) => !!f);

  return Array.from(new Set(fonts));
};

const getDetailedFonts = async () => {
  const fcListBinary = (await binaryExists("fc-list")) ? "fc-list" : "fc-list2";

  // Use fc-list to get detailed info: family and postscriptname
  const cmd = fcListBinary + ' -f "%{family[0]}|%{postscriptname}\\n"';

  try {
    const { stdout } = await pexec(cmd, { maxBuffer: 1024 * 1024 * 10 });
    const lines = stdout.split("\n").filter((f) => !!f);

    const fontMap = new Map();

    lines.forEach((line) => {
      const parts = line.split("|");
      if (parts.length >= 2) {
        const familyName = parts[0].trim();
        const postScriptName = parts[1].trim() || familyName;

        if (familyName && !fontMap.has(familyName)) {
          fontMap.set(familyName, {
            familyName,
            postScriptName,
          });
        }
      }
    });

    return Array.from(fontMap.values());
  } catch (e) {
    console.error(
      "Failed to get detailed fonts, falling back to basic method:",
      e
    );

    // Fallback to basic method
    const basicFonts = await getFonts();
    return basicFonts.map((familyName) => ({
      familyName,
      postScriptName: familyName,
    }));
  }
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
