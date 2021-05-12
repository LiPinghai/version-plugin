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
        const {
          chunks,
        } = this.options;

        const files = getFiles(compilation.entrypoints, chunks);

        const git_info = {
          branch: exec('git rev-parse --abbrev-ref HEAD').toString()
            .trim(),
          commit: exec('git rev-parse --short HEAD').toString()
            .trim(),
        }

        const gitString = `window.VERSION_INFO = ${JSON.stringify(git_info)};\n`

        files.js.map(jsFilename => {
          compilation.assets[jsFilename] = new sources.ConcatSource(gitString, compilation.assets[jsFilename],);
        })
      })

  }
}

module.exports = VersionPlugin;