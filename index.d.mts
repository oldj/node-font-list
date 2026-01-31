interface IOptions {
  disableQuoting: boolean;
}

export interface IFontInfo {
  name: string;
  familyName: string;
  postScriptName: string;
  weight: string;
  style: string;
  width: string;
  monospace: boolean;
}

type FontList = string[];
type DetailedFontList = IFontInfo[];

export function getFonts(options?: IOptions): Promise<FontList>;
export function getFonts2(options?: IOptions): Promise<DetailedFontList>;

declare const fontList: {
  getFonts(options?: IOptions): Promise<FontList>;
  getFonts2(options?: IOptions): Promise<DetailedFontList>;
};

export default fontList;
