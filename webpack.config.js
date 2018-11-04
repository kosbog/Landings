const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  entry: './src/assets/js/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)?$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'sass-loader'
        ],
      },
      {
        test: /\.(jpg|png|gif)?$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[path][name].[ext]',
              // outputPath: 'static/'
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[path][name].[ext]',
              // outputPath: 'static/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin('dist'),
    new MiniCssExtractPlugin({
      filename: "[path][name].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      title: 'Example',
      template: './src/index.html',
      minify: {
        collapseWhitespace: true
      }
    })
  ],
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".json"]
  }
}

if (process.env.NODE_ENV === 'prod') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    })
  );
}

module.exports = config;