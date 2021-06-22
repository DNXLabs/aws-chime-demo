// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
var webpack = require('webpack');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
/* eslint-enable */

module.exports = env => {
  console.info('Env:', JSON.stringify(env, null, 2));
  console.info('App:', process.env.npm_config_app);
  const app = env.app || process.env.npm_config_app || 'meetingV2';
  console.info('Using app', app);
  return {
    devServer: {
      hot: true,
      dev: {
        index: `${app}.html`,
      },
      onListening: (server) => {
        // Just so that the code in server.js isn't confused about
        // which app finally made it through the gauntlet.
        process.env.npm_config_app = app;
        const { serve } = require('./server.js');
        serve('0.0.0.0:8081');
      },
      static: {
        publicPath: '/',
      },
      port: 8080,
      public: 'e2a7602bbc87.ngrok.io',
      proxy: {
        '/join': 'http://0.0.0.0:8081',
        '/end': 'http://0.0.0.0:8081',
        '/fetch_credentials': 'http://0.0.0.0:8081',
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        inlineSource: '.(js|css)$',
        template: __dirname + `/app/${app}/${app}.html`,
        filename: __dirname + `/dist/${app}.html`,
        inject: 'head',
      }),
      new HtmlWebpackInlineSourcePlugin(),
      new webpack.EnvironmentPlugin({
        IS_LOCAL: process.env.npm_config_is_local === 'true' ? 'true' : 'false'
      })
    ],
    entry: [`./app/${app}/${app}.ts`],
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    output: {
      path: __dirname + '/dist',
      filename: `${app}-bundle.js`,
      publicPath: '/',
      libraryTarget: 'var',
      library: `app_${app}`,
    },
    module: {
      rules: [
        {
          test: /\.(svg)$/,
          loader: 'raw-loader',
        },
        {
          test: /\.(scss)$/,
          use: [{
            loader: 'style-loader',
            options: {
              insert: 'head',
            },
          }, {
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  "autoprefixer"
                ]
              }
            },
          }, {
            loader: 'sass-loader',
          }]
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
      ],
    },
    mode: 'development',
    performance: {
      hints: false,
    },
  };
};
