/**
 * @author: oldj
 * @homepage: https://oldj.net
 */

interface IOptions {
  disableQuoting: boolean;
}

interface IFontInfo {
  familyName: string;
  postScriptName: string;
}

type FontList = string[];
type DetailedFontList = IFontInfo[];

// ES module exports
export function getFonts(options?: IOptions): Promise<FontList>;
export function getFonts2(options?: IOptions): Promise<DetailedFontList>;

// Default export
interface FontListModule {
  getFonts(options?: IOptions): Promise<FontList>;
  getFonts2(options?: IOptions): Promise<DetailedFontList>;
}

export default FontListModule;

// CommonJS exports (backward compatibility)
declare const fontList: {
  getFonts(options?: IOptions): Promise<FontList>;
  getFonts2(options?: IOptions): Promise<DetailedFontList>;
};

export = fontList;
