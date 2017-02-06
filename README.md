# font-list

`font-list` is a Node.js package for getting system font list.

Current version is only available on **macOS**, not support Windows or Linux.

## Usage

```js
require('./index').getFonts((err, fonts) => {
    if (err) {
        console.log(err);
    } else {
        console.log(fonts);
    }
});
```

The output looks like:

```
[ '"Adobe Arabic"',
  '"Adobe Caslon Pro"',
  '"Adobe Devanagari"',
  '"Adobe Fan Heiti Std"',
  '"Adobe Fangsong Std"',
  ...
  ]
```
