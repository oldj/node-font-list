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

export function getFonts(options?: IOptions): Promise<FontList>;
export function getFonts2(options?: IOptions): Promise<DetailedFontList>;
