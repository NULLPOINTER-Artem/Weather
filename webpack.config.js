const path = require('path');
const webpack = require('webpack');




/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled MiniCssExtractPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/mini-css-extract-plugin
 *
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');




/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require('terser-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');



module.exports = {
  mode: 'development',
  entry: './src/index.ts',

  devtool: "source-map",

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 7070,
    liveReload: true,
    watchContentBase: true,
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: "main.js",
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
    new HtmlPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    })
  ],

  module: {
    rules: 
    [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [/node_modules/]
      }, 
      {
        test: /\.(css|sass|scss)$/,

        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",

            options: {
              sourceMap: true
            }
          }, 
          {
            loader: "sass-loader",

            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg)$/,

        use: [{
          loader: 'file-loader',
          options: {
            limit: 8000,
            name: 'assets/[name].png'
          }
        }]
      }
    ]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss', '.png']
  },

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        },
        css: {
          test: /\.(css|sass|scss)$/,
          name: "commons",
          chunks: "all",
          minChunks: 2,
        },
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false
    }
  }
}