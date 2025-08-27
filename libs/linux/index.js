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

// Helper function to normalize weight values
const normalizeWeight = (weight) => {
  if (!weight) return 'regular';
  const w = weight.toLowerCase();
  if (w.includes('ultralight') || w.includes('thin')) return 'ultralight';
  if (w.includes('light')) return 'light';
  if (w.includes('medium')) return 'medium';
  if (w.includes('semibold') || w.includes('demibold')) return 'semibold';
  if (w.includes('bold')) return 'bold';
  if (w.includes('heavy') || w.includes('black')) return 'heavy';
  return 'regular';
};

// Helper function to normalize slant values
const normalizeSlant = (slant) => {
  if (!slant) return 'normal';
  const s = slant.toLowerCase();
  if (s.includes('italic')) return 'italic';
  if (s.includes('oblique')) return 'oblique';
  return 'normal';
};

// Helper function to normalize width values
const normalizeWidth = (width) => {
  if (!width) return 'normal';
  const w = width.toLowerCase();
  if (w.includes('condensed') || w.includes('narrow')) return 'condensed';
  if (w.includes('expanded') || w.includes('extended')) return 'expanded';
  return 'normal';
};

// Helper function to determine if font is monospace
const isMonospace = (spacing, familyName) => {
  if (spacing && spacing.toLowerCase().includes('mono')) return true;
  if (familyName) {
    const name = familyName.toLowerCase();
    const monoKeywords = ['mono', 'courier', 'console', 'terminal', 'fixed', 'typewriter', 'source code', 'fira code', 'jetbrains'];
    return monoKeywords.some(keyword => name.includes(keyword));
  }
  return false;
};

const getDetailedFonts = async () => {
  const fcListBinary = (await binaryExists("fc-list")) ? "fc-list" : "fc-list2";

  // Use fc-list to get detailed info: family, postscriptname, weight, slant, width, spacing
  const cmd = fcListBinary + ' -f "%{family[0]}|%{postscriptname}|%{weight}|%{slant}|%{width}|%{spacing}\\n"';

  try {
    const { stdout } = await pexec(cmd, { maxBuffer: 1024 * 1024 * 10 });
    const lines = stdout.split("\n").filter((f) => !!f);

    const fontMap = new Map();

    lines.forEach((line) => {
      const parts = line.split("|");
      if (parts.length >= 2) {
        const familyName = parts[0].trim();
        const postScriptName = parts[1].trim() || familyName;
        const weight = normalizeWeight(parts[2]);
        const style = normalizeSlant(parts[3]);
        const width = normalizeWidth(parts[4]);
        const monospace = isMonospace(parts[5], familyName);

        if (familyName && !fontMap.has(familyName)) {
          fontMap.set(familyName, {
            familyName,
            postScriptName,
            weight,
            style,
            width,
            monospace,
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

    // Fallback to basic method with default values
    const basicFonts = await getFonts();
    return basicFonts.map((familyName) => ({
      familyName,
      postScriptName: familyName,
      weight: 'regular',
      style: 'normal',
      width: 'normal',
      monospace: isMonospace(null, familyName),
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
