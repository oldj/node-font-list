# font-list

`font-list` is a Node.js package for listing the fonts available on your system.

Current version supports **macOS** only, can not be used on Windows or Linux yet.

## Install

```bash
npm install font-list
```

## Usage

```js
require('font-list').getFonts((err, fonts) => {
    if (err) {
        console.log(err);
    } else {
        console.log(fonts);
    }
});
```

The return value `fonts` is an Array, looks like:

```
[ '"Adobe Arabic"',
  '"Adobe Caslon Pro"',
  '"Adobe Devanagari"',
  '"Adobe Fan Heiti Std"',
  '"Adobe Fangsong Std"',
  ...
  ]
```
