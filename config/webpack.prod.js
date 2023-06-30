const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');

const domain = process.env.PRODUCTION_DOMAIN;

const prodConfig = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        management: `management@${domain}/management/remoteEntry.js`,
        communication: `communication@${domain}/communication/remoteEntry.js`,
        authentication: `authentication@${domain}/authentication/remoteEntry.js`,
      },
    }),
  ],
};

module.exports = merge(commonConfig, prodConfig);
