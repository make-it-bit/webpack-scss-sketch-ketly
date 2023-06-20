const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/js/index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './js/[name].js',
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
    port: 8000,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: { postcssOptions: { plugins: () => [autoprefixer] } } },
          { loader: 'sass-loader' },
        ],
      },
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
      filename: './[name].html',
    }),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
  ],
  watch: true /*--> saab ka nii! */,
};
