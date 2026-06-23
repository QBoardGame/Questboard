/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyPlugin = require('copy-webpack-plugin'),
  webpack = require('webpack'),
  dotenv = require('dotenv');

// Load .env file
dotenv.config();

module.exports = (env) => ({
  entry: {
    index: './src/windows/index.ts',
    'in-game': './src/windows/in-game.ts',
    desktop: './src/windows/desktop.tsx',
  },

  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },

  output: {
    path: path.resolve(__dirname, 'dist/'),
    clean: true,
    filename: 'windows/[name]/controller.js',
  },

  plugins: [
    // ✅ ENV injection (THIS FIXES YOUR ISSUE)
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    }),

    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, 'public/'),
          from: './',
          to: './',
          globOptions: { ignore: ['**/*.html'] },
        },
        { from: 'plugins', to: 'plugins' },
      ],
    }),

    new HtmlWebpackPlugin({
      template: './public/windows/in-game.html',
      filename: path.resolve(__dirname, './dist/windows/in-game/page.html'),
      chunks: ['in-game'],
    }),

    new HtmlWebpackPlugin({
      template: './public/windows/index.html',
      filename: path.resolve(__dirname, './dist/windows/index/page.html'),
      chunks: ['index'],
    }),

    new HtmlWebpackPlugin({
      template: './public/windows/desktop.html',
      filename: path.resolve(__dirname, './dist/windows/desktop/page.html'),
      chunks: ['desktop'],
    }),
  ],
});