const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const { InjectManifest } = require('workbox-webpack-plugin');
require('dotenv').config({ path: './.env.production' });
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src') + '/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      { test: /\.(json)$/, use: { loader: 'file-loader', options: { name: '[name].[ext]', outputPath: './' } } },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        exclude: /node_modules/,
        use: ['file-loader?name=[name].[ext]'],
      },
      {
        exclude: /node_modules/,
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: [
      '*',
      '.js',
      '.jsx',
      'ts',
      'tsx',
      '.css',
      'scss',
      '.json',
      'svg',
      'png',
      'jpg',
      'jpeg',
      'gif',
      'ico',
    ],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      path: require.resolve('path-browserify'),
      // Deduplication: ensure a single React instance even if dependencies bundle their own.
      // Alias to the package DIRECTORY (not the entry file) so subpath imports like
      // 'react-dom/client' and 'react/jsx-runtime' still resolve.
      react: path.dirname(require.resolve('react/package.json')),
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      favicon: './public/favicon.png',
      filename: 'index.html',
      manifest: './public/manifest.json',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/manifest.json', to: 'manifest.json' },
        // Prizma brand assets (símbolo de marca paraguas)
        { from: 'public/prizma-symbol.svg', to: 'prizma-symbol.svg' },
        { from: 'public/prizma-wordmark.svg', to: 'prizma-wordmark.svg' },
        { from: 'public/prizma-favicon.svg', to: 'prizma-favicon.svg' },
      ],
    }),
    // new InjectManifest({
    //   swSrc: './src/service-worker.js',
    //   swDest: 'service-worker.js',
    // }),
  ],
};
