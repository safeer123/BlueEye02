const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');


const API_SERVER_URL = 'http://is-gnv-hpapp01:9701/';

// Development Configuration
const devConfig = () => ({
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'dist',
    compress: true,
    port: process.env.port,
    stats: 'errors-only',
    open: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true,
    },
    proxy: {
      '/api': {
        // Rest API Server
        target: API_SERVER_URL,
        changeOrigin: true,
      },
      '/token': {
        // auth proxy
        target: API_SERVER_URL,
      },
      '/auth': {
        target: API_SERVER_URL,
      },
      '/notifications': {
        target: API_SERVER_URL,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});

// Production Configuration
const prodConfig = () => ({
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        // cache: true,
        // parallel: true,
        // sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    //  new BundleAnalyzerPlugin()
  ],
});

// Common configuration for Prod and Dev
const commonConfig = () => ({
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
    //   {
    //     type: 'javascript/auto',
    //     test: /\.json$/,
    //     use: [
    //         {
    //           loader: 'file-loader',
    //           options: {
    //               name: "./externalConfig/[name].[ext]"
    //           }
    //         }
    //     ]
    // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'fonts/[name].[ext]?[hash]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[name].[ext]?[hash]',
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader', // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new CopyWebpackPlugin([
      {
        from: `${__dirname}/src/app/assets`,
        to: `${__dirname}/dist/app/assets/`,
      },
    ]),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname),
      verbose: true,
      dry: false,
      exclude: ['node_modules'],
    }),
    new webpack.ProvidePlugin({
      ReactDOM: 'react-dom',
      React: 'react',
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new ImageminPlugin({
      pngquant: ({ quality: '50' }),
      plugins: [imageminMozjpeg({ quality: '50' })],
    }),

  ],
});

module.exports = (env) => {
  if (env.prod === 'true') {
    return WebpackMerge(commonConfig(), prodConfig());
  }
  return WebpackMerge(commonConfig(), devConfig());
};
