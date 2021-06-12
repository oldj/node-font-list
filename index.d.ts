/**
 * index.d.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

interface IOptions {
  disableQuoting: boolean;
  fallbackEncoding: string; // Fallback encoding, only for windows, the default value is "cp936"
}

type FontList = string[]

export function getFonts (options?: IOptions): Promise<FontList>;
