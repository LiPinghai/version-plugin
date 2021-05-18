const exec = require('child_process').execSync;
const path = require('path');
const sources = require('webpack-sources');

function getFiles (
  entrypoints,
  chunks
) {
  const ret = {};

  entrypoints.forEach((entry) => {
    if (chunks && !chunks.includes(entry.name)) {
      return;
    }

    entry.getFiles().forEach((file) => {
      const extension = path.extname(file).replace(/\./, '');

      if (!ret[extension]) {
        ret[extension] = [];
      }

      ret[extension].push(file);
    });
  });

  return ret;
}

class VersionPlugin {
  constructor(options = {}) {
    this.options = options
  }

  apply (compiler) {

    compiler.hooks.emit.tap('Version Plugin',
      compilation => {
        const currentmode = compilation.options.mode 

        const {
          name = "VERSION_INFO",
          mode = "development",
          chunks,
          dataOption = {},
        } = this.options;

        if (typeof mode === 'string') {
          if (mode !== 'all' && currentmode !== mode) {
            return
          }
        } else if (mode instanceof Array) {
          if (mode.indexOf(currentmode) < 0) {
            return
          }
        } else {
          throw new Error('[VersionPlugin] mode invalid')
        }

        const files = getFiles(compilation.entrypoints, chunks);

        const defaultDataOption = {
          git_branch: {
            default: true,
            func () {
              return exec('git rev-parse --abbrev-ref HEAD').toString().trim();
            }
          },
          git_commit_hash: {
            default: true,
            func () {
              return exec('git show -s --format=%h').toString().trim();
            }
          },
          git_commit_fullhash: {
            default: false,
            func () {
              return exec('git show -s --format=%H').toString().trim();
            }
          },
          git_commit_time: {
            default: false,
            func () {
              return exec('git show -s --format=%cI').toString().trim();
            }
          },
          git_commit_author: {
            default: false,
            func () {
              return exec('git show -s --format=%an').toString().trim();
            }
          },
          git_commit_commiter: {
            default: false,
            func () {
              return exec('git show -s --format=%cn').toString().trim();
            }
          },
          git_commit_message: {
            default: false,
            func () {
              return exec('git show -s --format=%b').toString().trim();
            }
          },
          package_version: {
            default: false,
            func () {
              return process.env.npm_package_version;
            }
          },
          build_time: {
            default: false,
            func () {
              return new Date().toISOString();
            }
          },
        }

        const VERSION_INFO = {}

        const dataNameList = Object.keys(defaultDataOption).concat(Object.keys(dataOption))

        for (let dataName of dataNameList) {

          if (typeof dataOption[dataName] === 'undefined') {
            if (defaultDataOption[dataName] && defaultDataOption[dataName].default) {
              VERSION_INFO[dataName] = defaultDataOption[dataName].func()
            }
          } else if (typeof dataOption[dataName] === 'boolean') {
            if (dataOption[dataName] && defaultDataOption[dataName]) {
              VERSION_INFO[dataName] = defaultDataOption[dataName].func()
            }
          } else if (typeof dataOption[dataName] === 'function') {
            VERSION_INFO[dataName] = dataOption[dataName]()
          } else {
            VERSION_INFO[dataName] = dataOption[dataName]
          }
        }

        const vsrsionString = `window.${name} = ${JSON.stringify(VERSION_INFO)};\n`

        files.js.map(jsFilename => {
          compilation.assets[jsFilename] = new sources.ConcatSource(vsrsionString, compilation.assets[jsFilename],);
        })
      })

  }
}

module.exports = VersionPlugin;