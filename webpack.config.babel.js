import * as util from './assets/gulp/util';
import path from 'path';

const srcDir = path.resolve(__dirname, 'src');

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false
  },
  mode: util.mode,
  entry: {
    index: './src/index.ts'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        include: [srcDir],
        exclude: /(node_modules|bower_components)/,
        use: { loader: 'ts-loader' }
      }
    ]
  }
};
