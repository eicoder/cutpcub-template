'use strict'

const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const glob = require('glob');
const config= require('../config');
const utils = require('./index');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const PurifyCssPlugin = require('purifycss-webpack');
const SpritesmithPlugin = require('webpack-spritesmith');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isBuild = process.env.NODE_ENV === 'production';

const projectPath = './src/projects';

// 参数
let projectName = process.argv.slice(2);
if (!isBuild) {
  const params = process.argv[process.argv.length - 1];
  projectName = (params.match(/^--env.project=(.+)/) || [])[1];
}

if (!projectName) {
  console.log(chalk.red('项目名称不能为空'));
  console.log('  Examples:');
  console.log();
  console.log(chalk.gray('    # 开发'));
  console.log('    $ yarn dev --env.project= <项目名称>');
  console.log(chalk.gray('    # 打包'));
  console.log('    $ yarn build <项目名称>');
  console.log();
  throw new Error();
}

exports.projectName = projectName;

// 入口
exports.entries = () => {
  const entries = {};
  const scanPath = `${projectPath}/${projectName}/pages/**/index.js`;
  glob.sync(scanPath).forEach((entryPath) => {
    const dirname = path.dirname(entryPath);
    const name = dirname.substr(dirname.lastIndexOf('/') + 1);
    entries[name] = entryPath;
  });
  return entries;
};

// 多输出
exports.htmls = () => {
  const htmlPlugins = [];
  const scanPath = `${projectPath}/${projectName}/pages/**/index.html`;
  glob.sync(scanPath).forEach((templatePath) => {
    const dirname = path.dirname(templatePath);
    const name = dirname.substr(dirname.lastIndexOf('/') + 1);
    htmlPlugins.push(new HtmlWebpackPlugin({
      template: templatePath,
      filename: isBuild ? path.posix.join(config.assetsRoot, `${name}.html`) : `${name}`,
      chunks: [name],
      minify: false
    }));
  });
  return htmlPlugins;
};

// 样式处理
exports.cssRules = () => {
  const prependData = ` @import "@/styles/mixins/prepend.scss";
  @import "@/projects/${projectName}/var.scss";
  @import "~@/projects/${projectName}/sprites/sprite.css";`;
  return {
    test: /\.(css|scss|sass)$/,
    use: [
      isBuild ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../../',
        }
      } : {loader: 'style-loader'},
      { loader: 'css-loader' },
      {
        loader: 'sass-loader',
        options: {
          prependData,
          implementation: require('sass')
        }
      },
      { loader: 'postcss-loader' }
    ]
  }
};

// 雪碧图
// TODO 多张雪碧图
exports.spritesPlugins = () => {
  return new SpritesmithPlugin({
    src: {
      cwd: path.resolve(__dirname, `../../src/projects/${projectName}/sprites/`), // 图标根路径
      glob: '**/*.png' // 匹配任意 png 图标
    },
    target: {
      image: path.resolve(__dirname, `../../src/assets/projects/${projectName}/images/sprites-generated.png`), // 生成雪碧图目标路径与名称
      // 设置生成CSS背景及其定位的文件或方式
      // css: [
      //   [path.resolve(__dirname, '../src/assets/css/sprites-generated.css'), {
      //     format: 'function_based_template'
      //   }]
      // ]
      css: path.resolve(__dirname, `../../src/projects/${projectName}/sprites/sprite.css`)
    },
    // 样式文件中,调用雪碧图的写法????
    apiOptions: {
      cssImageRef: `../../../assets/projects/${projectName}/images/sprites-generated.png`
    },
    // 雪碧图生成算法
    spritesmithOptions: {
      algorithm: 'top-down', // 从上到下生成方向.
      padding: 2// 每个小图标之间的间隙
    }
  })
};

// 删除无用的css
exports.purifyCssPlugin = () => {
  if (isBuild && config.build.purifyCss) {
    return [new PurifyCssPlugin({
      paths: glob.sync(path.join(__dirname, `../../src/projects/${projectName}/pages/**/index.html`))
    })]
  }
  return [];
};

exports.output = () => {
  const output = {
    path: isBuild ? config.assetsRoot : config.assetsRoot,
    filename: isBuild ? utils.assetsPath('js/[name].js') : '[name].js',
    publicPath: isBuild
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  };
  if (isBuild) {
    output.chunkFilename = utils.assetsPath('js/[id].js');
  }
  return output;
};

exports.openPage = () => {
  const scanPath = `${projectPath}/${projectName}/pages/**/index.html`;
  const dirname = path.dirname(glob.sync(scanPath)[0]);
  return dirname.substr(dirname.lastIndexOf('/') + 1);
};
