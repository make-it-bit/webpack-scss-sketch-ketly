const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',

  entry: {
    index: './src/scripts/index.js',
    mealPlan: './src/scripts/meal-plan.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './scripts/[name].js',
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
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src'),
          to: './src/public' /* ??? */,
        },
      ],
    }),
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
      directory: path.resolve(__dirname, 'public'),
    },
    /* miks hosti vaja? webpack ametlikul lehel ka polnud seda näidetes! */
    compress: true,
    port: 8080,
  },

  devtool: 'inline-source-map',
};
