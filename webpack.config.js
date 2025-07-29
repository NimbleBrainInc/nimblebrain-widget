const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/widget.ts',
  output: {
    filename: 'widget.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'NimbleBrainWidget',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
    clean: true,
    // Enable source maps for debugging
    sourceMapFilename: '[file].map',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
    }),
  ],
  optimization: {
    minimize: true,
  },
  // Generate source maps for production debugging
  devtool: 'source-map',
};