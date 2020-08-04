import * as path from 'path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'development',
  entry: './main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'foo.bundle.js'
  }
};

export default config;