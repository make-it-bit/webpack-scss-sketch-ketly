const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/index.js',
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './js/index.js',
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        exclude: /node-modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'project 7 - index.html',
      template: path.resolve(__dirname, './src/index.html'),
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: './css/index.css',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, './public'),
    },
    compress: true,
    port: 8080,
  },
  devtool: 'inline-source-map',
};
