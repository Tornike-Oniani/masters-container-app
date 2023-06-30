const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const commonConfig = require('./webpack.common');

const devConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: 'http://localhost:8080/',
    filename: 'bundle.js',
  },
  devServer: {
    port: 8080,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, '../public'),
    },
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        management: 'management@http://localhost:8081/remoteEntry.js',
        communication: 'communication@http://localhost:8082/remoteEntry.js',
        authentication: 'authentication@http://localhost:8083/remoteEntry.js',
      },
    }),
  ],
};

module.exports = merge(commonConfig, devConfig);
