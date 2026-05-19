# font-list

A Node.js package for listing system fonts with support for both CommonJS and ES modules.

[![npm version](https://badge.fury.io/js/font-list.svg)](https://badge.fury.io/js/font-list)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🖥️ **Cross-platform support**: Works on macOS, Windows, and Linux
- 📦 **Dual module support**: Compatible with both CommonJS and ES modules
- 🔍 **Two API methods**: Basic font listing and detailed font information
- 📝 **TypeScript support**: Includes TypeScript type definitions
- ⚡ **Async/Promise based**: Modern asynchronous API

## Installation

```bash
npm install font-list
```

## Quick Start

### CommonJS

```js
const { getFonts } = require('font-list')

getFonts()
  .then(fonts => {
    console.log(fonts)
  })
  .catch(err => {
    console.error(err)
  })
```

### ES Modules

```js
import { getFonts } from 'font-list'

const fonts = await getFonts()
console.log(fonts)
```

### TypeScript

```ts
import { getFonts, FontInfo } from 'font-list'

const fonts: string[] = await getFonts()
const detailedFonts: FontInfo[] = await getFonts2()
```

## API Reference

### `getFonts(options?)`

Returns a list of font family names available on the system.

**Parameters:**
- `options` (optional): Configuration object
  - `disableQuoting` (boolean): If `true`, font names with spaces won't be wrapped in quotes. Default: `false`

**Returns:** `Promise<string[]>`

**Example output:**
```js
[
  '"Adobe Arabic"',
  '"Adobe Caslon Pro"',
  'Arial',
  'Helvetica',
  ...
]
```

**Usage examples:**

```js
// Default behavior (with quotes for names containing spaces)
const fonts = await getFonts()
// Result: ['"Adobe Arabic"', 'Arial', ...]

// Disable quoting
const fonts = await getFonts({ disableQuoting: true })
// Result: ['Adobe Arabic', 'Arial', ...]
```

### `getFonts2(options?)`

Returns detailed font information including both family names and PostScript names.

**Parameters:**
- `options` (optional): Same as `getFonts()`
  - `disableQuoting` (boolean): Default: `false`

**Returns:** `Promise<FontInfo[]>`

**FontInfo interface:**
```ts
interface FontInfo {
  name: string           // Original family name
  familyName: string     // Standardized family name
  postScriptName: string // PostScript name
  weight: string         // Font weight (ultralight, light, regular, medium, semibold, bold, heavy)
  style: string          // Font style (normal, italic, oblique)
  width: string          // Font width (condensed, normal, expanded)
  monospace: boolean     // Whether the font is monospaced
}
```

**Example output:**
```js
[
  {
    name: 'Adobe Arabic',
    familyName: '"Adobe Arabic"',
    postScriptName: 'AdobeArabic-Regular',
    weight: 'regular',
    style: 'normal',
    width: 'normal',
    monospace: false
  },
  {
    name: 'Arial',
    familyName: 'Arial',
    postScriptName: 'ArialMT',
    weight: 'regular',
    style: 'normal',
    width: 'normal',
    monospace: false
  },
  {
    name: 'Courier New',
    familyName: '"Courier New"',
    postScriptName: 'CourierNewPSMT',
    weight: 'regular',
    style: 'normal',
    width: 'normal',
    monospace: true
  },
  ...
]
```

**Usage examples:**

```js
// Get detailed font information
const detailedFonts = await getFonts2()
console.log(detailedFonts[0].familyName)     // "Adobe Arabic"
console.log(detailedFonts[0].postScriptName) // AdobeArabic-Regular
console.log(detailedFonts[0].weight)         // regular
console.log(detailedFonts[0].style)          // normal
console.log(detailedFonts[0].width)          // normal
console.log(detailedFonts[0].monospace)      // false

// With disabled quoting
const detailedFonts = await getFonts2({ disableQuoting: true })
console.log(detailedFonts[0].familyName)     // Adobe Arabic

// Filter monospace fonts
const monospaceFonts = detailedFonts.filter(font => font.monospace)
console.log(monospaceFonts.map(f => f.familyName))

// Filter bold fonts
const boldFonts = detailedFonts.filter(font => font.weight === 'bold')
console.log(boldFonts.map(f => f.familyName))
```

## Platform Support

| Platform | Method | Implementation |
|----------|--------|--------------|
| macOS | `system_profiler` | Uses system font database |
| Windows | PowerShell/VBS | Registry and system font queries |
| Linux | `fc-list` | Fontconfig library |

## Module Formats

This package supports both CommonJS and ES modules through dual package exports:

```js
// CommonJS
const { getFonts, getFonts2 } = require('font-list')

// ES Modules
import { getFonts, getFonts2 } from 'font-list'

// Default export (ES Modules)
import fontList from 'font-list'
const fonts = await fontList.getFonts()
```

## Error Handling

```js
try {
  const fonts = await getFonts()
  console.log(`Found ${fonts.length} fonts`)
} catch (error) {
  console.error('Failed to get fonts:', error.message)
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Darwin helper binaries

The macOS implementation includes native Objective-C helper binaries at
`libs/darwin/fontlist` and `libs/darwin/fontlist2`. These binaries are kept in
git so macOS users can clone the repository and run it without a local build
step.

If you change `libs/darwin/fontlist.m` or `libs/darwin/fontlist2.m`, rebuild the
helper binaries on macOS before submitting the change:

```bash
npm run build:darwin
```

This command requires macOS and Xcode Command Line Tools. It produces universal
`x86_64` and `arm64` binaries with a default macOS deployment target of `11.0`.
Set `MACOSX_DEPLOYMENT_TARGET` before running the command to override the target
for a release build. Windows and Linux contributors do not need to run it for
JavaScript, type definition, documentation, or platform-specific changes outside
`libs/darwin`.

Pull requests should include Darwin binary diffs only when the corresponding
Objective-C source files changed.

### Publishing

Releases should be published from macOS. `npm publish` runs `prepublishOnly`,
which rebuilds the Darwin helper binaries before the package is packed and
published.

To inspect the package contents before publishing, run:

```bash
npm run pack:check
```

## License

MIT © [oldj](https://github.com/oldj)

## Repository

[https://github.com/oldj/node-font-list](https://github.com/oldj/node-font-list)
