# version-plugin

webpack plugin for injecting *version info*(git npm etc) to project.

## Getting Started

To begin, you'll need to install `version-plugin`:

```
npm install version-plugin -D
```

Then add the loader and the plugin to your webpack config. For example:

**webpack.config.js**
```
const VersionPlugin = require('version-plugin');

module.exports = {
  plugins: [new VersionPlugin()]
};
```

Then run `npm run dev`or `npm run build`, `version-plugin` will inject `VERSION_INFO` to global level of your project.

## Options

### Plugin Options

|              Name             |       Type      |                Default                |                       Description               |
| :---------------------------: | :-------------: | :-----------------------------------: | :---------------------------------------------- |
|        **`name`**             |    `{String}`   |             `VERSION_INFO`            | The variable name inject to global              |
|      **[`mode`](#mode)**      |`{'all'\|String\|Array}`|             `development`            | Specify webpack mode that Version-Plugin work  |
|**[`dataOption`](#dataOption)**|    `{Object}`   |                  {}                   | Configure the version content                   |


### mode

For safe reason, Version Plugin **only** work in development mode by default. You can change to `all` make it alway available. Specify a mode name or list also ok.

### dataOption

Version Plugin will inject `git_branch` and `git_commit_hash` by default. 

And 
```
git_commit_fullhash
git_commit_time
git_commit_author
git_commit_commiter
git_commit_message
package_version
build_time
```
are selectable. Your can set `true` to make it work, or `String` / `Number` value or function to overwrite. Extra data also acceptable. 

Example:

```js
new VersionPlugin({
  name: '_v_',
  mode: ['production', 'development'],
  dataOption:{
    git_commit_hash: false,
    git_commit_fullhash: true,
    git_commit_author: true,
    package_version: () => '1.0.0',
    extra_data_foo: 'extra_data_bar'
  }
})
```

then in broswer's console:

```js

// window._v_

{
  git_branch: "develop",
  git_commit_fullhash: "c3252175510b100a4a139f2af4b3f73ef753483a",
  git_commit_author: 'LiPinghai',
  package_version: "1.0.0", 
  extra_data_foo: "extra_data_bar"
}
```