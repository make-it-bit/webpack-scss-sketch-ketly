const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/* copyplugin ja babel ka? */

module.exports = {
  mode: 'development',

  entry: {
    index: './src/js/index.js',
    mealPlan: './src/js/meal-plan.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].js',
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
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      title: 'project 7 - meal-plan.html',
      template: path.resolve(__dirname, './src/meal-plan.html'),
      filename: './meal-plan.html',
      chunks: ['mealPlan'],
    }),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
  ],

  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public') /* src kausta pane public kaust? */,
    },
    compress: true,
    port: 8080,
  },

  devtool: 'inline-source-map',
};
