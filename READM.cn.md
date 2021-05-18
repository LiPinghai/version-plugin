# version-plugin

用于注入*版本信息*到项目代码中的webpack插件。

## 开始

首先安装 `version-plugin`:

```
npm install version-plugin -D
```

然后在webpack配置中加入VersionPlugin相关配置：

**webpack.config.js**
```
const VersionPlugin = require('version-plugin');

module.exports = {
  plugins: [new VersionPlugin()]
};
```

运行 `npm run dev`或 `npm run build`, `version-plugin` 会在项目中注入全局变量 `VERSION_INFO` 。

## 选项

### 插件选项

|              变量名             |       类型      |                默认值                |                       描述               |
| :---------------------------: | :-------------: | :-----------------------------------: | :---------------------------------------------- |
|        **`name`**             |    `{String}`   |             `VERSION_INFO`            | 注入到全局中的变量名              |
|      **[`mode`](#mode)**      |`{'all'\|String\|Array}`|             `development`            | 指定在哪些webpack模式中启用  |
|**[`dataOption`](#dataOption)**|    `{Object}`   |                  {}                   | 具体的版本信息配置                 |


### mode

基于安全理由，Version Plugin默认**只在**development mode中启用。改成`all`的话就会在所以模式中启用，也可以传入指定mode名字或数组。

### dataOption

Version Plugin 会默认注入 `git_branch` 和 `git_commit_hash` 两项版本信息。 

还有以下信息供选用：
```
git_commit_fullhash
git_commit_time
git_commit_author
git_commit_commiter
git_commit_message
package_version
build_time
```
把这些信息设置为 `true` 就会启用, 传 `String` / `Number` 值或者函数的话，会覆写掉默认值。 除了以上9项信息，也可以自行传扩展字段。

示例:

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

然后看浏览器控制台:

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