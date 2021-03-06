import * as path from 'path';
import * as webpack from 'webpack';
import * as webpackDevServer from 'webpack-dev-server'
import { resolve } from 'path';
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

interface Configuration extends webpack.Configuration {
  devServer?: webpackDevServer.Configuration;
}

const config: webpack.Configuration = {
  mode: 'development',
  context: __dirname,
  entry: ['webpack/hot/dev-server', './main.tsx'],
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: 'main.js',
    publicPath: '/dist/'
  },

  plugins: [
      new HtmlWebPackPlugin(),
      new MiniCssExtractPlugin()
  ],

  resolve: { 
    // adding .ts and .tsx to resolve.extensions 
    // will help babel look for .ts and .tsx files to transpile
    extensions:['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 8080,
    watchContentBase: true,
    publicPath: '/dist/',
    hot: true
  }
};

export default config;