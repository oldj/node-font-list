declare namespace fontList {
  export interface IOptions {
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

  export type FontList = string[];
  export type DetailedFontList = IFontInfo[];
}

declare const fontList: {
  getFonts(options?: fontList.IOptions): Promise<fontList.FontList>;
  getFonts2(options?: fontList.IOptions): Promise<fontList.DetailedFontList>;
};

export = fontList;
