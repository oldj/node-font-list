/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict';

/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict';

const path = require('path');
const execFile = require('child_process').execFile;
const platform = process.platform;
const bin = path.join(__dirname, 'bin', platform, 'fontlist');

const font_exceptions = ['iconfont'];

function tryToGetFonts(s) {
    let fonts = [];
    let m = s.match(/\([\s\S]+?\)/);
    if (m) {
        let a = m[0].replace(/\(|\)/g, '').split('\n');
        fonts = fonts.concat(a.map(i => {
            return i.replace(/^\s+|\s+$/g, '').replace(/\,$/, '');
        }));
    }

    return fonts;
}

exports.getFonts = (callback) => {
    if (platform !== 'darwin') {
        setTimeout(() => {
            callback(`Error: font-list not support on ${platform}.`);
        }, 0);
        return;
    }

    execFile(bin, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
        }
        let fonts = [];
        if (stdout) {
            fonts = fonts.concat(tryToGetFonts(stdout));
        }
        if (stderr) {
            fonts = fonts.concat(tryToGetFonts(stderr));
        }

        let dict = {};
        fonts.map(i => {
            if (i) {
                dict[i] = 1;
            }
        });
        fonts = [];
        for (let k in dict) {
            if (dict.hasOwnProperty(k) && !font_exceptions.includes(k)) {
                fonts.push(k);
            }
        }
        fonts.sort();
        callback(null, fonts);
    });
};
